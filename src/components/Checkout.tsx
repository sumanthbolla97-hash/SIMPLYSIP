import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, QrCode } from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
  cart: Record<string, number>;
  onClearCart: () => void;
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

const FALLBACK_MENU = [
  { id: "1", name: "Hulk Greens", mrp: 170, offerPrice: 129, image: "/images/hulk-greens.png" },
  { id: "2", name: "Melon Booster", mrp: 150, offerPrice: 119, image: "/images/melon-booster.png" },
  { id: "3", name: "ABC", mrp: 160, offerPrice: 119, image: "/images/abc.png" },
  { id: "4", name: "A-Star", mrp: 170, offerPrice: 129, image: "/images/a-star.png" },
  { id: "5", name: "AMG", mrp: 160, offerPrice: 119, image: "/images/amg.png" },
  { id: "6", name: "Ganga Jamuna", mrp: 150, offerPrice: 119, image: "/images/ganga-jamuna.png" },
  { id: "7", name: "Coco Fresh", mrp: 170, offerPrice: 129, image: "/images/coco-fresh.png" },
  { id: "8", name: "Sunshine Sip", mrp: 150, offerPrice: 119, image: "/images/sunshine-sip.png" },
  { id: "9", name: "Golden Sunrise", mrp: 150, offerPrice: 119, image: "/images/golden-sunrise.png" },
  { id: "10", name: "Orchard Gold", mrp: 160, offerPrice: 119, image: "/images/orchard-gold.png" },
  { id: "11", name: "Tropical Bliss", mrp: 160, offerPrice: 119, image: "/images/tropical-bliss.png" },
  { id: "12", name: "Velvet Vine", mrp: 170, offerPrice: 129, image: "/images/velvet-vine.png" },
  { id: "13", name: "Purple Crush", mrp: 170, offerPrice: 129, image: "/images/purple-crush.png" },
  { id: "14", name: "Verjus", mrp: 170, offerPrice: 129, image: "/images/verjus.png" },
  { id: "15", name: "Garden Joy", mrp: 140, offerPrice: 109, image: "/images/garden-joy.png" }
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

export default function Checkout({ onBack, cart, onClearCart }: CheckoutProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: ''
  });

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
    if (locationAccuracy && locationAccuracy > 10) {
      alert(`Location accuracy is ${locationAccuracy}m. Please retry for 10m accuracy.`);
      return;
    }
    if (formData.name && formData.phone && formData.address && formData.area && formData.area !== "Select Area") {
      setStep(2);
    } else {
      alert("Please fill all fields.");
    }
  };

  const handlePaymentDone = () => {
    const itemsText = cartItems
      .map((item) => {
        const desc = item.desc ? ` (${item.desc})` : "";
        return `${item.name}${desc} x${cart[item.id]} - ₹${getOffer(item)} each`;
      })
      .join("\n");
    const accuracyText = locationAccuracy ? ` (accuracy ${locationAccuracy}m)` : "";
    const message = `Hi Simply Sip, I placed an order.\n\nItems:\n${itemsText}\n\nSubtotal: ₹${cartTotal}\nDelivery: ₹${deliveryFee}\nTotal: ₹${grandTotal}\n\nName: ${formData.name}\nAddress: ${formData.address}\nArea: ${formData.area}\nLocation: ${location}${accuracyText}\nPayment Done.`;
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
            <div className="bg-white p-6 md:p-8 border border-black/5 rounded-3xl shadow-[0_30px_70px_-55px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">Cart Summary</div>
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">{cartCount} item{cartCount === 1 ? "" : "s"}</div>
              </div>

              {cartCount === 0 ? (
                <div className="text-sm text-gray-500">Your cart is empty.</div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-base font-medium text-[#1A1A1A]">{item.name}</div>
                        {item.desc && (
                          <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                        )}
                        <div className="text-xs text-gray-500">
                          <span className="line-through mr-2">₹{getMrp(item)}</span>
                          <span className="text-[#1A1A1A] font-semibold">₹{getOffer(item)}</span>
                          <span className="ml-2">x{cart[item.id]}</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">₹{getOffer(item) * cart[item.id]}</div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-black/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">₹{cartTotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                      <span>Delivery</span>
                      <span className="text-sm font-semibold text-[#1A1A1A]">
                        {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                      <span>Total</span>
                      <span className="text-2xl font-semibold text-[#1A1A1A]">₹{grandTotal}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                      {deliveryFee === 0 ? "Free delivery unlocked" : "Free delivery over ₹250"}
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
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light"
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
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light"
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
                      className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors appearance-none font-light"
                      required
                    >
                      {SECUNDERABAD_ZONES.map(zone => (
                        <option key={zone} value={zone} disabled={zone === "Select Area"}>{zone}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">▾</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400">Complete Address</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors resize-none h-[110px] font-light"
                    placeholder="House No, Street, Landmark"
                    required
                  />
                </div>
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
              <h3 className="text-3xl font-serif text-[#1A1A1A] mb-3 relative z-10">Scan to Pay ₹{grandTotal}</h3>
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
