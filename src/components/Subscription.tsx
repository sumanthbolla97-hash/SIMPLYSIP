import { motion } from 'motion/react';

interface SubscriptionProps {
  onSubscribe: () => void;
}

export default function Subscription({ onSubscribe }: SubscriptionProps) {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2200&auto=format&fit=crop" 
          alt="Luxury wellness lifestyle" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/90 backdrop-blur-2xl p-8 sm:p-10 md:p-16 rounded-[2.2rem] sm:rounded-[2.5rem] shadow-[0_40px_90px_-60px_rgba(0,0,0,0.4)] border border-black/5"
        >
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[11px] tracking-[0.4em] uppercase text-[#6F6A63] mb-4">Subscribe & Save</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1C1A] font-display">Weekly detox. Monthly cleanse.</h2>
            <p className="text-sm sm:text-base text-[#6F6A63] font-light mt-4">Fresh delivery. Every day. No commitment.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <div className="p-6 sm:p-8 rounded-[2rem] border border-black/5 bg-white shadow-[0_30px_70px_-55px_rgba(0,0,0,0.35)]">
              <p className="text-[11px] tracking-[0.4em] uppercase text-[#6F6A63] mb-3">Weekly Plan</p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1C1A] font-display mb-2">Weekly Detox Plan</h3>
              <p className="text-sm text-[#6F6A63] font-light mb-6">7 juices (200 ml each)</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-sm text-[#A7A29C] line-through font-medium">₹930</span>
                <span className="text-3xl sm:text-4xl font-semibold text-[#1D1C1A]">₹699</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#6F6A63]">/ week</span>
              </div>
              <p className="text-xs text-[#6F6A63]">₹99 per bottle effective</p>
              <button
                onClick={onSubscribe}
                className="mt-8 w-full px-8 py-4 bg-[#1D1C1A] text-white rounded-full font-semibold tracking-[0.2em] uppercase text-[11px] hover:bg-black transition-colors"
              >
                Start Weekly
              </button>
            </div>

            <div className="p-6 sm:p-8 rounded-[2rem] border border-black/5 bg-[#FBFAF7] shadow-[0_30px_70px_-55px_rgba(0,0,0,0.35)]">
              <p className="text-[11px] tracking-[0.4em] uppercase text-[#6F6A63] mb-3">Monthly Plan</p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1D1C1A] font-display mb-2">Monthly Cleanse Plan</h3>
              <p className="text-sm text-[#6F6A63] font-light mb-6">28 juices (200 ml each)</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-sm text-[#A7A29C] line-through font-medium">₹3720</span>
                <span className="text-3xl sm:text-4xl font-semibold text-[#1D1C1A]">₹2599</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#6F6A63]">/ month</span>
              </div>
              <p className="text-xs text-[#6F6A63]">₹93 per bottle effective</p>
              <button
                onClick={onSubscribe}
                className="mt-8 w-full px-8 py-4 bg-white text-[#1D1C1A] border border-black/10 rounded-full font-semibold tracking-[0.2em] uppercase text-[11px] hover:border-black/20 transition-colors"
              >
                Start Monthly
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
