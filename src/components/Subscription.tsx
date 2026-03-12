import { motion } from 'motion/react';

interface SubscriptionProps {
  onSubscribe: () => void;
}

export default function Subscription({ onSubscribe }: SubscriptionProps) {
  const weeklyLineup = [
    "Green Clarity",
    "Citrus Lift",
    "Berry Focus",
    "Golden Glow",
    "Root Reset",
    "Garden Calm",
    "Coco Fresh"
  ];

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
          className="grid md:grid-cols-[1.1fr_0.9fr] gap-10 sm:gap-12 bg-white/90 backdrop-blur-2xl p-8 sm:p-10 md:p-16 rounded-[2.2rem] sm:rounded-[2.5rem] shadow-[0_40px_90px_-60px_rgba(0,0,0,0.4)] border border-black/5"
        >
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] tracking-[0.4em] uppercase text-[#6F6A63] mb-4">Weekly Plan</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1C1A] font-display mb-4">Seven days. One clean ritual.</h2>
              <p className="text-sm sm:text-base md:text-lg text-[#6F6A63] font-light mb-8 sm:mb-10">7 Cold-Pressed Juices (200 ml each)</p>
              <div className="flex items-end gap-2">
                <div className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1D1C1A] font-display">₹699</div>
                <div className="text-sm text-[#6F6A63] font-medium tracking-[0.2em] uppercase pb-2">Per Week</div>
              </div>
            </div>

            <button 
              onClick={onSubscribe}
              className="mt-10 sm:mt-12 md:mt-16 w-full md:w-auto px-9 sm:px-10 py-4 bg-[#1D1C1A] text-white rounded-full font-semibold tracking-[0.2em] uppercase text-[11px] hover:bg-black transition-colors duration-300"
            >
              Subscribe Weekly
            </button>
          </div>

          <div className="border-t border-black/10 pt-8 md:pt-0 md:border-t-0 md:border-l md:pl-10">
            <p className="text-[11px] tracking-[0.4em] uppercase text-[#6F6A63] mb-6">Weekly Lineup</p>
            <ul className="space-y-4">
              {weeklyLineup.map((item) => (
                <li key={item} className="flex items-center justify-between text-[#1D1C1A] font-medium">
                  <span className="text-sm sm:text-base md:text-lg font-display">{item}</span>
                  <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-[#6F6A63]">200 ml</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
