import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, QrCode, Trash2 } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface CheckoutProps {
  user?: any;
  onBack: () => void;
  cart: Record<string, number>;
  onClearCart: () => void;
  onRemoveItem: (id: string) => void;
  onIncrementItem: (id: string) => void;
  onDecrementItem: (id: string) => void;
  onAddressUpdate?: (addressData: any) => void;
}

const SECUNDERABAD_ZONES = [
  "Select Area",
  "Alwal",
  "Bolarum",
  "Bowenpally",
  "Karkhana",
  "Kompally",
  "Malkajgiri",
  "Marredpally",
  "Sainikpuri",
  "Tarnaka",
  "Trimulgherry"
];

const BULLET = "\u2022";

const FALLBACK_MENU = [
  { id: "1", name: "Hulk Greens", desc: `Green Apple ${BULLET} Cucumber ${BULLET} Ginger ${BULLET} Spinach ${BULLET} Lime`, mrp: 170, offerPrice: 129, image: "/images/hulk-greens.png" },
  { id: "2", name: "Melon Booster", desc: `Watermelon ${BULLET} Cucumber ${BULLET} Mint`, mrp: 150, offerPrice: 119, image: "/images/melon-booster.png" },
  { id: "3", name: "ABC", desc: `Apple ${BULLET} Beetroot ${BULLET} Carrot`, mrp: 160, offerPrice: 119, image: "/images/abc.png" },
  { id: "4", name: "A-Star", desc: `Apple ${BULLET} Pomegranate`, mrp: 170, offerPrice: 129, image: "/images/a-star.png" },
  { id: "5", name: "AMG", desc: `Apple ${BULLET} Mint ${BULLET} Ginger`, mrp: 160, offerPrice: 119, image: "/images/amg.png" },
  { id: "6", name: "Ganga Jamuna", desc: `Orange ${BULLET} Mosambi`, mrp: 150, offerPrice: 119, image: "/images/ganga-jamuna.png" },
  { id: "7", name: "Coco Fresh", desc: "Tender Coconut Water", mrp: 170, offerPrice: 129, image: "/images/coco-fresh.png" },
  { id: "8", name: "Sunshine Sip", desc: "Mosambi", mrp: 150, offerPrice: 119, image: "/images/sunshine-sip.png" },
  { id: "9", name: "Golden Sunrise", desc: "Orange", mrp: 150, offerPrice: 119, image: "/images/golden-sunrise.png" },
  { id: "10", name: "Orchard Gold", desc: "Apple", mrp: 160, offerPrice: 119, image: "/images/orchard-gold.png" },
  { id: "11", name: "Tropical Bliss", desc: "Pineapple", mrp: 160, offerPrice: 119, image: "/images/tropical-bliss.png" },
  { id: "12", name: "Velvet Vine", desc: "Pomegranate", mrp: 170, offerPrice: 129, image: "/images/velvet-vine.png" },
  { id: "13", name: "Purple Crush", desc: "Black Grapes", mrp: 170, offerPrice: 129, image: "/images/purple-crush.png" },
  { id: "14", name: "Verjus", desc: "Green Grapes", mrp: 170, offerPrice: 129, image: "/images/verjus.png" },
  { id: "15", name: "Garden Joy", desc: "Carrot", mrp: 140, offerPrice: 109, image: "/images/garden-joy.png" }
];

const SUBSCRIPTION_ITEMS = [
  { 
    id: "sub_weekly", 
    name: "Weekly Subscription", 
    mrp: 899, 
    offerPrice: 699,
    desc: "1 cold-pressed juice (200 ml) delivered daily for 7 days"
  },
  { 
    id: "sub_monthly", 
    name: "Monthly Subscription", 
    mrp: 3599, 
    offerPrice: 2599,
    desc: "1 cold-pressed juice (200 ml) delivered daily for 28 days"
  }
];

function IngredientTicker({ desc }: { desc?: string }) {
  if (!desc) return null;

  const parts = desc
    .split(/\u2022|•/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1 && !desc.match(/\u2022|•/)) {
    return (
      <p className="text-[11px] text-[#6F6A63] mt-1 line-clamp-2">
        {desc}
      </p>
    );
  }

  return (
    <div className="text-[11px] text-[#6F6A63] mt-1 flex flex-wrap items-center gap-x-1.5">
      {parts.map((part, index) => (
        <React.Fragment key={`${part}-${index}`}>
          <span>{part}</span>
          {index < parts.length - 1 && (
            <span className="text-[#C6A05A] text-[8px]">{"\u25CF"}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Checkout({ user, onBack, cart, onClearCart, onRemoveItem, onIncrementItem, onDecrementItem, onAddressUpdate }: CheckoutProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [formData, setFormData] = useState({
    name: user?.displayName || user?.name || '',
    phone: user?.phoneNumber || user?.phone || '',
    address: user?.address || '',
    area: user?.area || ''
  });
  const [addressType, setAddressType] = useState(user?.addressType || 'Home');
  const [isAddressLocked, setIsAddressLocked] = useState(false);
  const rupee = "\u20B9";

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems(FALLBACK_MENU);
        }
      })
      .catch(() => setMenuItems(FALLBACK_MENU));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag && ["input", "textarea", "select", "button"].includes(tag)) {
        return;
      }
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touchStart.current.x - touch.clientX;
      const dy = touchStart.current.y - touch.clientY;
      const isHorizontal = Math.abs(dx) > Math.abs(dy) * 1.2;
      if (isHorizontal && dx > 60) {
        onBack();
      }
      touchStart.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onBack]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const acc = Math.round(pos.coords.accuracy);
        setLocation(`Lat ${lat}, Lng ${lng}`);
        setLocationAccuracy(acc);
        setIsLocating(false);
      },
      (err) => {
        setLocationError(err.message || "Location permission denied");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
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

  const allItems = [...SUBSCRIPTION_ITEMS, ...menuItems];
  const cartItems = allItems.filter(item => cart[item.id]);
  const cartCount = cartItems.reduce((sum, item) => sum + (cart[item.id] ?? 0), 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    const qty = cart[item.id] ?? 0;
    return sum + (getOffer(item) * qty);
  }, 0);
  const deliveryFee = cartTotal >= 250 ? 0 : (cartCount > 0 ? 30 : 0);
  const grandTotal = cartTotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    if (!onAddressUpdate) {
      alert("Please login to save your address.");
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.area || formData.area === "Select Area") {
      alert("Please fill all address fields before saving.");
      return;
    }
    onAddressUpdate({
      address: formData.address,
      area: formData.area,
      addressType: addressType,
      phone: formData.phone
    });
    setIsAddressLocked(true);
    alert("Address saved!");
  };

  const handleEditAddress = () => {
    setIsAddressLocked(false);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartCount) {
      alert("Your cart is empty.");
      return;
    }
    if (!location) {
      alert("Please allow location access for accurate delivery.");
      return;
    }
    if (locationAccuracy && locationAccuracy > 500) {
      alert(`Location accuracy is ${locationAccuracy}m. Please retry for 500m accuracy.`);
      return;
    }
    if (formData.name && formData.phone && formData.address && formData.area && formData.area !== "Select Area") {
      setStep(2);
    } else {
      alert("Please fill all fields.");
    }
  };

  const handlePaymentDone = async () => {
    const itemsText = cartItems
      .map((item) => {
        const desc = item.desc ? ` (${item.desc})` : "";
        return `${item.name}${desc} x${cart[item.id]} - ${rupee}${getOffer(item)} each`;
      })
      .join("\n");
    const accuracyText = locationAccuracy ? ` (accuracy ${locationAccuracy}m)` : "";
    const message = `Hi Simply Sip, I placed an order.\n\nItems:\n${itemsText}\n\nSubtotal: ${rupee}${cartTotal}\nDelivery: ${rupee}${deliveryFee}\nTotal: ${rupee}${grandTotal}\n\nName: ${formData.name}\nAddress: ${formData.address}\nArea: ${formData.area}\nLocation: ${location}${accuracyText}\nPayment Done.`;
    try {
      await addDoc(collection(db, "orders"), {
        userId: user?.uid || null,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: cart[item.id] ?? 0,
          price: getOffer(item)
        })),
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
        address: {
          name: formData.name,
          phone: formData.phone,
          area: formData.area,
          address: formData.address,
          addressType: addressType
        },
        location,
        locationAccuracy,
        status: "pending",
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to save order:", err);
    }
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClearCart();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-[#F5F2ED] px-6 py-12 md:py-24"
    >
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Return
        </button>

        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight mb-12 text-[#1A1A1A]">
          {step === 1 ? "Your Order." : "Complete."}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleProceedToPayment} className="space-y-10">
            <div className="bg-white p-6 md:p-8 border border-black/5 rounded-3xl shadow-[0_30px_70px_-55px_rgba(0,0,0,0.35)]" id="cart-summary">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">Cart Summary</div>
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">{cartCount} item{cartCount === 1 ? "" : "s"}</div>
              </div>

              {cartCount === 0 ? (
                <div className="text-sm text-gray-500">Your cart is empty.</div>
              ) : (
                <div className="divide-y divide-black/5">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-[#1A1A1A]">{item.name}</div>
                          <IngredientTicker desc={item.desc} />
                        </div>
                        <div className="text-sm font-semibold text-[#1A1A1A] sm:pl-2 shrink-0">{rupee}{getOffer(item) * cart[item.id]}</div>
                      </div>
                      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div className="text-xs text-gray-500">
                          <span className="line-through mr-2">{rupee}{getMrp(item)}</span>
                          <span className="text-[#1A1A1A] font-semibold">{rupee}{getOffer(item)}</span>
                        </div>
                        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                          <button
                            type="button"
                            onClick={() => onDecrementItem(item.id)}
                            aria-label={`Decrease ${item.name}`}
                            className="w-7 h-7 rounded-full border border-black/10 text-[#1A1A1A] font-medium hover:border-black/20 transition-colors flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-xs font-medium text-[#1A1A1A] w-6 text-center">{cart[item.id]}</span>
                          <button
                            type="button"
                            onClick={() => onIncrementItem(item.id)}
                            aria-label={`Increase ${item.name}`}
                            className="w-7 h-7 rounded-full border border-black/10 text-[#1A1A1A] font-medium hover:border-black/20 transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="w-7 h-7 rounded-full border border-black/10 text-gray-400 hover:text-[#1A1A1A] hover:border-black/20 transition-colors flex items-center justify-center"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-black/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">{rupee}{cartTotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                      <span>Delivery</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {deliveryFee === 0 ? "Free" : `${rupee}${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                      <span>Total</span>
                      <span className="text-2xl font-semibold text-[#1A1A1A]">{rupee}{grandTotal}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                      {deliveryFee === 0 ? "Free delivery unlocked" : `Free delivery over ${rupee}250`}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-6 md:p-8 border border-black/5 rounded-3xl shadow-[0_30px_70px_-55px_rgba(0,0,0,0.35)] space-y-8">
              <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">Delivery Details</div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isAddressLocked}
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isAddressLocked}
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="+91"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Delivery Area</label>
                  <div className="relative">
                    <select 
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      disabled={isAddressLocked}
                      className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors appearance-none font-light disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                    >
                      {SECUNDERABAD_ZONES.map(zone => (
                        <option key={zone} value={zone} disabled={zone === "Select Area"}>{zone}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">{"\u25BE"}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Complete Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={isAddressLocked}
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors resize-none h-[110px] font-light disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="House No, Street, Landmark"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Address Type</label>
                <div className="flex items-center gap-x-6">
                    {['Home', 'Office', 'Other'].map(type => (
                        <label key={type} className="flex items-center gap-2">
                            <input 
                                type="radio" 
                                name="addressType" 
                                value={type} 
                                checked={addressType === type}
                                onChange={(e) => setAddressType(e.target.value)}
                                disabled={isAddressLocked}
                                className="h-4 w-4 text-black border-gray-300 focus:ring-black disabled:cursor-not-allowed"
                            />
                            <span className="text-sm text-gray-600">{type}</span>
                        </label>
                    ))}
                </div>
              </div>

              <div className="pt-4">
                {!isAddressLocked ? (
                  <button 
                      type="button" 
                      onClick={handleSaveAddress}
                      className="px-5 py-3 rounded-full border border-black/10 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1D1C1A] hover:border-black/20 transition-colors"
                  >
                      Save Address
                  </button>
                ) : (
                  <button 
                      type="button" 
                      onClick={handleEditAddress}
                      className="px-5 py-3 rounded-full border border-black/10 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1D1C1A] hover:border-black/20 transition-colors"
                  >
                      Edit Address
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Location (Auto-detected)</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input 
                    type="text"
                    value={location || (isLocating ? "Detecting location..." : "")}
                    readOnly
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none font-light"
                    placeholder="Location required"
                  />
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="px-5 py-3 rounded-full border border-black/10 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1D1C1A] hover:border-black/20 transition-colors"
                  >
                    {isLocating ? "Locating..." : "Retry"}
                  </button>
                </div>
                {locationAccuracy !== null && (
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    Accuracy: {locationAccuracy}m
                  </div>
                )}
                {locationError && (
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    {locationError}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-10 border-t border-black/10">
              <button 
                type="submit"
                className="w-full py-5 bg-[#1A1A1A] text-white font-semibold tracking-[0.1em] hover:bg-black transition-all duration-500 uppercase text-[11px] shadow-xl shadow-black/5 hover:shadow-black/15 hover:-translate-y-0.5"
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-12">
            <div className="bg-white p-10 md:p-16 border border-black/5 text-center flex flex-col items-center relative overflow-hidden">
              <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-8 relative z-10">
                <QrCode className="text-white" size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif text-[#1A1A1A] mb-3 relative z-10">Scan to Pay {rupee}{grandTotal}</h3>
              <p className="text-sm font-light text-gray-500 mb-10 relative z-10">Use any UPI app (GPay, PhonePe, Paytm)</p>
              
              <div className="w-56 h-56 bg-white border border-black/10 flex items-center justify-center mb-10 relative z-10 p-4">
                <div className="w-full h-full border border-dashed border-black/20 flex items-center justify-center">
                  <span className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-semibold">[ UPI QR Placeholder ]</span>
                </div>
              </div>

              <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 relative z-10">
                UPI ID: simplysip@upi
              </div>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handlePaymentDone}
                className="w-full py-5 bg-[#1A1A1A] text-white font-semibold tracking-[0.1em] hover:bg-black transition-all duration-500 uppercase text-[11px] shadow-xl shadow-black/5 hover:shadow-black/15 hover:-translate-y-0.5"
              >
                I have made the payment
              </button>
              <p className="text-[10px] text-center text-gray-400 font-semibold tracking-[0.1em] uppercase">
                You will be redirected to WhatsApp to confirm.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
