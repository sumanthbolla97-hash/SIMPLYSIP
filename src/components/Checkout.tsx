import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, QrCode } from 'lucide-react';

interface CheckoutProps {
  onBack: () => void;
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

export default function Checkout({ onBack }: CheckoutProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    area: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.address && formData.area && formData.area !== "Select Area") {
      setStep(2);
    } else {
      alert("Please fill all fields.");
    }
  };

  const handlePaymentDone = () => {
    const message = `Hi Simply Sip, I subscribed to Weekly Plan ₹699.\n\nName: ${formData.name}\nAddress: ${formData.address}\nArea: ${formData.area}\nPayment Done.`;
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-[#F5F2ED] px-6 py-12 md:py-24"
    >
      <div className="max-w-xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors mb-16"
        >
          <ArrowLeft size={14} />
          Return
        </button>

        <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight mb-12 text-[#1A1A1A]">
          {step === 1 ? "Your Details." : "Complete."}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleProceedToPayment} className="space-y-10">
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-b border-black/10 py-3 text-lg focus:outline-none focus:border-black transition-colors bg-transparent font-light"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border-b border-black/10 py-3 text-lg focus:outline-none focus:border-black transition-colors bg-transparent font-light"
                  placeholder="+91"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">Delivery Area</label>
                <select 
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full border-b border-black/10 py-3 text-lg focus:outline-none focus:border-black transition-colors bg-transparent appearance-none rounded-none font-light"
                  required
                >
                  {SECUNDERABAD_ZONES.map(zone => (
                    <option key={zone} value={zone} disabled={zone === "Select Area"}>{zone}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">Complete Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border-b border-black/10 py-3 text-lg focus:outline-none focus:border-black transition-colors bg-transparent resize-none h-24 font-light"
                  placeholder="House No, Street, Landmark"
                  required
                />
              </div>
            </div>

            <div className="pt-10 border-t border-black/10">
              <div className="flex justify-between items-center mb-10">
                <span className="text-sm font-light tracking-widest uppercase text-gray-500">Total</span>
                <span className="text-4xl font-serif text-[#1A1A1A]">₹699</span>
              </div>
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
              <h3 className="text-3xl font-serif text-[#1A1A1A] mb-3 relative z-10">Scan to Pay ₹699</h3>
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
