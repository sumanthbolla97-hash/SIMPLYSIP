import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction, CSSProperties } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { seedMenu } from '../data/seedMenu';

interface MenuProps {
  cart: Record<string, number>;
  setCart: Dispatch<SetStateAction<Record<string, number>>>;
  onCheckout: () => void;
  onCartTotalChange: (total: number) => void;
}

function IngredientTicker({ desc }: { desc?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(12);

  useEffect(() => {
    if (!desc) return;
    const update = () => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;
      const overflow = content.scrollWidth > container.clientWidth;
      setShouldScroll(overflow);
      if (overflow) {
        const travel = Math.max(0, content.scrollWidth - container.clientWidth);
        const seconds = Math.min(18, Math.max(8, travel / 20));
        setDistance(travel);
        setDuration(seconds);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desc]);

  if (!desc) return null;
  const parts = desc
    .split(/\u2022|•/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;

  return (
    <div ref={containerRef} className="mt-2 text-[11px] sm:text-xs text-[#6F6A63] max-w-full overflow-hidden whitespace-nowrap">
      <div
        ref={contentRef}
        className={`inline-flex items-center ${shouldScroll ? "marquee" : ""}`}
        style={
          shouldScroll
            ? ({
                "--marquee-distance": `${distance}px`,
                "--marquee-duration": `${duration}s`
              } as CSSProperties)
            : undefined
        }
      >
        {parts.map((part, index) => (
          <span key={`${part}-${index}`}>
            {part}
            {index < parts.length - 1 && (
              <span className="mx-1 text-[#C6A05A]">{"\u2605"}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Menu({ cart, setCart, onCheckout, onCartTotalChange }: MenuProps) {
  const [menuItems, setMenuItems] = useState<any[]>(
    seedMenu.map((item, index) => ({ id: `${index + 1}`, ...item }))
  );
  const [loading, setLoading] = useState(false);
  const rupee = "\u20B9";
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const snap = await getDocs(collection(db, "menu"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (data.length > 0) {
          setMenuItems(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  const roundUpTo9 = (value: number) => {
    const base = Math.ceil(value);
    const mod = base % 10;
    return mod === 9 ? base : base + (9 - mod);
  };

  const renderIngredients = (desc?: string) => {
    if (!desc) return null;
    const parts = desc
      .split(/\u2022|•/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return null;
    return (
      <div
        className="mt-2 text-[11px] sm:text-xs text-[#6F6A63] max-w-full overflow-x-auto no-scrollbar whitespace-nowrap sm:overflow-visible sm:whitespace-normal sm:line-clamp-2"
      >
        {parts.map((part, index) => (
          <span key={`${part}-${index}`}>
            {part}
            {index < parts.length - 1 && (
              <span className="mx-1 text-[#C6A05A]">{"\u2605"}</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  const getMrp = (item: any) => {
    return Number(item.mrp ?? item.price ?? 0);
  };

  const getOffer = (item: any) => {
    const mrp = getMrp(item);
    const rawOffer = Number(item.offerPrice ?? (mrp * 0.75));
    return roundUpTo9(rawOffer);
  };

  const addToCart = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return prev;
      if (next[id] === 1) {
        delete next[id];
      } else {
        next[id] -= 1;
      }
      return next;
    });
  };

  const layeredFlavours = menuItems.filter((item) => item.category === "Signature Blends");
  const pureExpression = menuItems.filter((item) => item.category === "Single Fruit Series");
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = menuItems.reduce((sum, item) => {
    const qty = cart[item.id] ?? 0;
    if (!qty) return sum;
    return sum + (getOffer(item) * qty);
  }, 0);
  const subscriptionTotal =
    (cart.sub_weekly ? 699 : 0) + (cart.sub_monthly ? 2599 : 0);
  const combinedTotal = cartTotal + subscriptionTotal;

  useEffect(() => {
    onCartTotalChange(combinedTotal);
  }, [combinedTotal, onCartTotalChange]);

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 md:gap-14">
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="group cursor-pointer flex flex-col min-w-0"
        >
          <div className="aspect-[4/5] sm:aspect-[3/4] w-full bg-[#FBFAF7] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden mb-3 sm:mb-6 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.35)] border border-black/5 transition-transform duration-500 group-hover:-translate-y-1">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="px-2 text-center flex flex-col flex-1 min-w-0">
            <div>
              <h4 className="text-base sm:text-xl font-semibold tracking-tight text-[#1D1C1A] font-display whitespace-nowrap overflow-hidden text-ellipsis">
                {item.name}
              </h4>
              <div className="flex items-baseline justify-center gap-3 mt-2">
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] border border-black/10 rounded-full min-w-[72px] h-6 px-2 flex items-center justify-center">
                  25% Off
                </span>
                <span className="text-[11px] sm:text-sm text-[#A7A29C] line-through font-medium">{rupee}{getMrp(item)}</span>
                <span className="text-sm sm:text-lg font-semibold text-[#1D1C1A]">{rupee}{getOffer(item)}</span>
              </div>
              <IngredientTicker desc={item.desc} />
            </div>
            <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 mt-auto">
              {cart[item.id] ? (
                <div className="flex items-center gap-2 w-full justify-center">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full border border-black/10 text-[#1D1C1A] font-medium hover:border-black/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium text-[#1D1C1A] w-6 text-center">{cart[item.id]}</span>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="w-8 h-8 rounded-full border border-black/10 text-[#1D1C1A] font-medium hover:border-black/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(item.id)}
                  className="w-full max-w-[180px] px-4 py-2.5 bg-[#1D1C1A] text-white rounded-full font-semibold tracking-[0.2em] uppercase text-[9px] sm:text-[10px] hover:bg-black transition-colors"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section id="menu" className="scroll-mt-24 sm:scroll-mt-28 py-16 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-3">SIMPLY SIP</p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight mb-3 text-[#1D1C1A] font-display">Layered flavours and pure expression.</h2>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#6F6A63] font-medium">Flat 25% Off {"\u2014"} Limited Launch Offer</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading collection...</div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {cartCount > 0 && (
              <div className="flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur border border-black/5 rounded-full px-5 sm:px-6 py-3 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)] text-sm font-medium text-[#1D1C1A] flex items-center gap-4">
                  <span>
                    Cart: {cartCount} item{cartCount > 1 ? "s" : ""} {"\u2022"} {rupee}{combinedTotal}
                  </span>
                  <button
                    onClick={onCheckout}
                    className="px-4 py-2 bg-[#1D1C1A] text-white rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-8 sm:space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-3">Layered Flavours</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#1D1C1A] font-display">
                    Blends with depth. Clean finish.
                  </h3>
                </div>
                <div className="hidden md:block h-px w-48 bg-black/10"></div>
              </div>
              {renderGrid(layeredFlavours)}
            </div>

            <div className="space-y-8 sm:space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-3">Pure Expression</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#1D1C1A] font-display">
                    Single fruit. Pure cold-pressed juice.
                  </h3>
                </div>
                <div className="hidden md:block h-px w-48 bg-black/10"></div>
              </div>
              {renderGrid(pureExpression)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
