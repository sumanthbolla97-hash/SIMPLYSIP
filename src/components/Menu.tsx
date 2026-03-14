import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction, CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { get, onValue, ref } from 'firebase/database';
import { db } from '../firebaseConfig';
import { seedMenu } from '../data/seedMenu';
import { X } from 'lucide-react';

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
    .split(/\u2022/)
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

type NutritionInfo = {
  calories: number;
  vitamin: string;
  preservatives: string;
};

type ProductData = {
  id: string;
  name: string;
  image: string;
  desc?: string;
  tagline: string;
  mrp?: number;
  offerPrice?: number;
  price?: number;
  bestSeller?: boolean;
  sweetness: number;
  nutrition: NutritionInfo;
  benefits: string[];
  ingredients: string[];
};

const defaultBenefits = ["Detox support", "Gut health", "Skin glow", "Immunity boost"];
const buildProduct = (item: any, index: number): ProductData => {
  const parts = (item.desc || "")
    .split(/\u2022|,/)
    .map((part: string) => part.trim())
    .filter(Boolean);
  const sweetness = item.sweetness ?? ((index % 5) + 1);
  return {
    ...item,
    id: String(item.id ?? index),
    tagline: item.tagline || item.desc || "Cold-pressed blend crafted for daily balance",
    bestSeller: item.bestSeller ?? index === 0,
    sweetness,
    nutrition: item.nutrition || {
      calories: 90 + (index % 6) * 15,
      vitamin: `${50 + (index % 5) * 10}%`,
      preservatives: "None"
    },
    benefits: item.benefits || defaultBenefits,
    ingredients: parts.length > 0 ? parts : ["Green Apple", "Spinach", "Ginger", "Lime"]
  };
};

function SweetnessScale({ value }: { value: number }) {
  const clamped = Math.max(1, Math.min(5, value));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, idx) => (
        <span
          key={idx}
          className={`h-1.5 w-6 rounded-full ${idx < clamped ? "bg-[#1D1C1A]" : "bg-black/10"}`}
        />
      ))}
    </div>
  );
}

function MenuCard({
  product,
  onClick,
  onIncrement,
  onDecrement,
  qty
}: {
  product: ProductData;
  onClick: (product: ProductData) => void;
  onIncrement: (product: ProductData) => void;
  onDecrement: (product: ProductData) => void;
  qty: number;
}) {
  return (
    <div className="group text-left w-full">
      <button type="button" onClick={() => onClick(product)} className="w-full text-left">
        <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full bg-[#FBFAF7] rounded-[2rem] overflow-hidden mb-3 sm:mb-6 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.35)] border border-black/5 transition-transform duration-500 group-hover:-translate-y-1">
          {product.bestSeller && (
            <div className="absolute top-4 left-4 z-10 bg-[#1D1C1A] text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full">
              Best Seller
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="px-2 text-center flex flex-col flex-1 min-w-0">
          <h4 className="text-base sm:text-xl font-semibold tracking-tight text-[#1D1C1A] font-display whitespace-nowrap overflow-hidden text-ellipsis">
            {product.name}
          </h4>
          <div className="flex items-baseline justify-center gap-3 mt-2">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] border border-black/10 rounded-full min-w-[72px] h-6 px-2 flex items-center justify-center">
              25% Off
            </span>
            <span className="text-[11px] sm:text-sm text-[#A7A29C] line-through font-medium">
              {"\u20B9"}{product.mrp ?? product.price ?? 0}
            </span>
            <span className="text-sm sm:text-lg font-semibold text-[#1D1C1A]">
              {"\u20B9"}{product.offerPrice ?? product.price ?? 0}
            </span>
          </div>
          <IngredientTicker desc={product.desc} />
        </div>
      </button>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onDecrement(product)}
          disabled={qty <= 0}
          className="h-8 w-8 rounded-full border-2 border-[#1D1C1A] text-sm font-semibold text-[#1D1C1A] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label={`Decrease ${product.name}`}
        >
          -
        </button>
        <span className="text-sm font-semibold text-[#1D1C1A] w-6 text-center">{qty}</span>
        <button
          type="button"
          onClick={() => onIncrement(product)}
          className="h-8 w-8 rounded-full border-2 border-[#1D1C1A] bg-[#1D1C1A] text-sm font-semibold text-white"
          aria-label={`Increase ${product.name}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function CartState({ count, total, onCheckout }: { count: number; total: number; onCheckout: () => void }) {
  if (count <= 0) return null;
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur border border-black/5 rounded-full px-5 sm:px-6 py-3 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)] text-sm font-medium text-[#1D1C1A] flex items-center gap-4">
        <span>
          Cart: {count} item{count > 1 ? "s" : ""} {"\u2022"} {"\u20B9"}{total}
        </span>
        <button
          onClick={onCheckout}
          className="px-4 py-2 bg-[#1D1C1A] text-white rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-black transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

function ProductPanel({
  product,
  isOpen,
  onClose,
  onAdd,
  isAdded
}: {
  product: ProductData | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: ProductData) => void;
  isAdded: boolean;
}) {
  if (!product) return null;
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: 16 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed z-[90] bg-[#F7F5F0] left-1/2 top-1/2 w-[94vw] sm:w-[92vw] max-w-2xl h-[92vh] sm:h-[90vh] max-h-[92vh] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_50px_140px_-80px_rgba(0,0,0,0.6)] border border-black/10"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-full overflow-hidden">
              <div className="absolute inset-0 bg-white pointer-events-none" />
              <div
                className="absolute inset-0 pointer-events-none opacity-100"
                style={{
                  backgroundImage: `url(${product.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              />
              <div className="relative z-10 flex h-full flex-col p-4 sm:p-8">
                <div className="sticky top-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 py-3 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-black/10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/90 px-4 py-1.5 text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#1D1C1A] font-semibold">
                      Product Details
                    </span>
                    <button onClick={onClose} className="h-9 w-9 flex items-center justify-center rounded-full border border-black/10 hover:border-black/20 bg-white/90">
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 pb-6 sm:pb-8">
                  <div className="h-20 sm:h-40" />

                  <div className="mb-5 sm:mb-7">
                    <h3 className="text-xl sm:text-3xl font-bold text-[#1D1C1A] font-display tracking-tight">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-[#1D1C1A]/90 mt-2 font-medium">{product.tagline}</p>
                    <div className="mt-3 sm:mt-4 flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 font-semibold">Sweetness</span>
                      <SweetnessScale value={product.sweetness} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-7">
                    <div className="rounded-[2rem] border border-black/20 bg-white/80 px-4 py-3 sm:py-4">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 mb-2 font-semibold">Calories</div>
                      <div className="text-base sm:text-lg font-bold text-[#1D1C1A]">{product.nutrition.calories} kcal</div>
                    </div>
                    <div className="rounded-[2rem] border border-black/20 bg-white/80 px-4 py-3 sm:py-4">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 mb-2 font-semibold">Vitamin</div>
                      <div className="text-base sm:text-lg font-bold text-[#1D1C1A]">{product.nutrition.vitamin}</div>
                    </div>
                    <div className="rounded-[2rem] border border-black/20 bg-white/80 px-4 py-3 sm:py-4">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 mb-2 font-semibold">Preservatives</div>
                      <div className="text-base sm:text-lg font-bold text-[#1D1C1A]">{product.nutrition.preservatives}</div>
                    </div>
                    <div className="rounded-[2rem] border border-black/20 bg-white/80 px-4 py-3 sm:py-4">
                      <div className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 mb-2 font-semibold">Cold Pressed</div>
                      <div className="text-base sm:text-lg font-bold text-[#1D1C1A]">Yes</div>
                    </div>
                  </div>

                  <div className="mb-5 sm:mb-7">
                    <div className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 mb-3 font-semibold">Health Benefits</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-2 text-xs sm:text-sm text-[#1D1C1A] font-semibold">
                          <span className="mt-1 h-2 w-2 rounded-full bg-[#1D1C1A]" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5 sm:mb-7">
                    <div className="text-[9px] uppercase tracking-[0.35em] text-[#1D1C1A]/70 mb-3 font-semibold">Ingredients</div>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] sm:text-xs font-semibold text-[#1D1C1A]"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5 sm:mb-7 rounded-2xl border border-black/10 bg-[#F9F6F0]/95 px-4 py-3 text-left">
                    <div className="text-sm sm:text-base font-bold text-[#1D1C1A]">
                      No artificial sweeteners or sugar added.
                    </div>
                    <div className="mt-2 text-xs sm:text-sm font-semibold text-[#1D1C1A]/80">
                      Serving size: 200 ml • Keep refrigerated • Best served chilled
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-8 px-4 sm:px-8 border-t border-black/10 pt-4 pb-3 flex items-center justify-between gap-4 shrink-0 bg-[#F7F5F0]/95 backdrop-blur-sm">
                  <div className="text-2xl font-semibold text-[#1D1D1F]">{"\u20B9"}{product.offerPrice ?? product.price ?? 0}</div>
                  <button
                    onClick={() => onAdd(product)}
                    className={`px-6 py-3 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors ${
                      isAdded ? "bg-[#1D1C1A] text-white" : "bg-[#1D1C1A] text-white hover:bg-black"
                    }`}
                  >
                    {isAdded ? "Added" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
export default function Menu({ cart, setCart, onCheckout, onCartTotalChange }: MenuProps) {
  const [menuItems, setMenuItems] = useState<any[]>(
    seedMenu.map((item, index) => ({ id: `${index + 1}`, ...item }))
  );
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Record<string, number>>(cart);
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);


  useEffect(() => {
    if (!isPanelOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPanelOpen]);

  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPanelOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPanelOpen]);

  useEffect(() => {
    if (isPanelOpen) return;
    if (!selectedProduct) return;
    const timer = window.setTimeout(() => setSelectedProduct(null), 250);
    return () => window.clearTimeout(timer);
  }, [isPanelOpen, selectedProduct]);
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const snap = await get(ref(db, "menu"));
        const val = snap.val();
        const data = val ? Object.entries(val).map(([id, item]) => ({ id, ...(item as any) })) : [];
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

    const menuRef = ref(db, "menu");
    const unsubscribe = onValue(
      menuRef,
      (snapshot) => {
        const val = snapshot.val();
        const data = val ? Object.entries(val).map(([id, item]) => ({ id, ...(item as any) })) : [];
        if (data.length > 0) {
          setMenuItems(data);
        }
      },
      (err) => {
        console.error("Menu realtime update failed:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  const roundUpTo9 = (value: number) => {
    const base = Math.ceil(value);
    const mod = base % 10;
    return mod === 9 ? base : base + (9 - mod);
  };

  const getMrp = (item: any) => {
    return Number(item.mrp ?? item.price ?? 0);
  };

  const getOffer = (item: any) => {
    const mrp = getMrp(item);
    const rawOffer = Number(item.offerPrice ?? (mrp * 0.75));
    return roundUpTo9(rawOffer);
  };

  const adjustCartQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      const current = prev[id] ?? 0;
      const nextQty = Math.max(0, current + delta);
      const next = { ...prev };
      if (nextQty === 0) {
        delete next[id];
      } else {
        next[id] = nextQty;
      }
      setCart(next);
      return next;
    });
  };

  const handleIncrement = (product: ProductData) => {
    adjustCartQty(product.id, 1);
  };

  const handleDecrement = (product: ProductData) => {
    adjustCartQty(product.id, -1);
  };

  const openPanel = (product: ProductData) => {
    setSelectedProduct(product);
    setIsPanelOpen(true);
  };

  const handleAddToCart = (product: ProductData) => {
    const id = product.id;
    setCartItems((prev) => {
      const next = prev[id] ? prev : { ...prev, [id]: 1 };
      setCart(next);
      return next;
    });
    setAddedId(id);
    window.setTimeout(() => setAddedId(null), 1500);
    setIsPanelOpen(false);
  };

  const products = menuItems.map((item, index) =>
    buildProduct(
      {
        ...item,
        mrp: getMrp(item),
        offerPrice: getOffer(item)
      },
      index
    )
  );
  const layeredFlavours = products.filter((item) => item.category === "Signature Blends");
  const pureExpression = products.filter((item) => item.category === "Single Fruit Series");
  const cartCount = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = products.reduce((sum, item) => {
    const qty = cartItems[item.id] ?? 0;
    if (!qty) return sum;
    return sum + (getOffer(item) * qty);
  }, 0);
  const subscriptionTotal =
    (cartItems.sub_weekly ? 699 : 0) + (cartItems.sub_monthly ? 2599 : 0);
  const combinedTotal = cartTotal + subscriptionTotal;

  useEffect(() => {
    onCartTotalChange(combinedTotal);
  }, [combinedTotal, onCartTotalChange]);

  const renderGrid = (items: ProductData[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 md:gap-14">
      {items.map((item, index) => (
        <motion.div
          key={item.id || index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          <MenuCard
            product={item}
            onClick={openPanel}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            qty={cartItems[item.id] ?? 0}
          />
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
            <CartState count={cartCount} total={combinedTotal} onCheckout={onCheckout} />
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
      <ProductPanel
        product={selectedProduct}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onAdd={handleAddToCart}
        isAdded={Boolean(selectedProduct && addedId === selectedProduct.id)}
      />
    </section>
  );
}


