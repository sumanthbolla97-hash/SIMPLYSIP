import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';

interface MenuProps {
  cart: Record<string, number>;
  setCart: Dispatch<SetStateAction<Record<string, number>>>;
  onCheckout: () => void;
  onCartTotalChange: (total: number) => void;
}

export default function Menu({ cart, setCart, onCheckout, onCartTotalChange }: MenuProps) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const rupee = "\u20B9";
  const bullet = "\u2022";

  const fallbackMenu = [
    {
      id: "1",
      category: "Signature Blends",
      name: "Hulk Greens",
      desc: `Green Apple ${bullet} Cucumber ${bullet} Ginger ${bullet} Spinach ${bullet} Lime`,
      image: "/images/hulk-greens.png",
      mrp: 170,
      offerPrice: 129
    },
    {
      id: "2",
      category: "Signature Blends",
      name: "Melon Booster",
      desc: `Watermelon ${bullet} Cucumber ${bullet} Mint`,
      image: "/images/melon-booster.png",
      mrp: 150,
      offerPrice: 119
    },
    {
      id: "3",
      category: "Signature Blends",
      name: "ABC",
      desc: `Apple ${bullet} Beetroot ${bullet} Carrot`,
      image: "/images/abc.png",
      mrp: 160,
      offerPrice: 119
    },
    {
      id: "4",
      category: "Signature Blends",
      name: "A-Star",
      desc: `Apple ${bullet} Pomegranate`,
      image: "/images/a-star.png",
      mrp: 170,
      offerPrice: 129
    },
    {
      id: "5",
      category: "Signature Blends",
      name: "AMG",
      desc: `Apple ${bullet} Mint ${bullet} Ginger`,
      image: "/images/amg.png",
      mrp: 160,
      offerPrice: 119
    },
    {
      id: "6",
      category: "Signature Blends",
      name: "Ganga Jamuna",
      desc: `Orange ${bullet} Mosambi`,
      image: "/images/ganga-jamuna.png",
      mrp: 150,
      offerPrice: 119
    },
    {
      id: "7",
      category: "Single Fruit Series",
      name: "Coco Fresh",
      desc: "Tender Coconut Water",
      image: "/images/coco-fresh.png",
      mrp: 170,
      offerPrice: 129
    },
    {
      id: "8",
      category: "Single Fruit Series",
      name: "Sunshine Sip",
      desc: "Mosambi",
      image: "/images/sunshine-sip.png",
      mrp: 150,
      offerPrice: 119
    },
    {
      id: "9",
      category: "Single Fruit Series",
      name: "Golden Sunrise",
      desc: "Orange",
      image: "/images/golden-sunrise.png",
      mrp: 150,
      offerPrice: 119
    },
    {
      id: "10",
      category: "Single Fruit Series",
      name: "Orchard Gold",
      desc: "Apple",
      image: "/images/orchard-gold.png",
      mrp: 160,
      offerPrice: 119
    },
    {
      id: "11",
      category: "Single Fruit Series",
      name: "Tropical Bliss",
      desc: "Pineapple",
      image: "/images/tropical-bliss.png",
      mrp: 160,
      offerPrice: 119
    },
    {
      id: "12",
      category: "Single Fruit Series",
      name: "Velvet Vine",
      desc: "Pomegranate",
      image: "/images/velvet-vine.png",
      mrp: 170,
      offerPrice: 129
    },
    {
      id: "13",
      category: "Single Fruit Series",
      name: "Purple Crush",
      desc: "Black Grapes",
      image: "/images/purple-crush.png",
      mrp: 170,
      offerPrice: 129
    },
    {
      id: "14",
      category: "Single Fruit Series",
      name: "Verjus",
      desc: "Green Grapes",
      image: "/images/verjus.png",
      mrp: 170,
      offerPrice: 129
    },
    {
      id: "15",
      category: "Single Fruit Series",
      name: "Garden Joy",
      desc: "Carrot",
      image: "/images/garden-joy.png",
      mrp: 140,
      offerPrice: 109
    }
  ];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems(fallbackMenu);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMenuItems(fallbackMenu);
        setLoading(false);
      });
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
    const isLong = desc.length > 36;
    return (
      <div
        className={`mt-2 text-[11px] sm:text-xs text-[#6F6A63] ${
          isLong
            ? "overflow-x-auto no-scrollbar whitespace-nowrap sm:overflow-visible sm:whitespace-normal sm:line-clamp-2"
            : "whitespace-normal"
        }`}
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
              <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
                <h4 className="text-base sm:text-xl font-semibold tracking-tight text-[#1D1C1A] font-display">{item.name}</h4>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] border border-black/10 rounded-full min-w-[72px] h-6 px-2 flex items-center justify-center">
                  25% Off
                </span>
              </div>
              {renderIngredients(item.desc)}
              <div className="flex items-baseline justify-center gap-3 mt-2">
                <span className="text-[11px] sm:text-sm text-[#A7A29C] line-through font-medium">{rupee}{getMrp(item)}</span>
                <span className="text-sm sm:text-lg font-semibold text-[#1D1C1A]">{rupee}{getOffer(item)}</span>
              </div>
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
