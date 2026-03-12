import { motion } from 'motion/react';

interface SubscriptionProps {
  onSubscribe: () => void;
}

export default function Subscription({ onSubscribe }: SubscriptionProps) {
  return (
    <section className="relative py-32 px-6 flex items-center justify-center min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop" 
          alt="Healthy Lifestyle" 
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/90 backdrop-blur-2xl p-10 md:p-12 rounded-[2rem] shadow-2xl border border-white/20 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-[#1D1D1F]">Weekly Plan</h2>
          <div className="text-4xl font-bold tracking-tighter text-[#1D1D1F] mb-8">₹699<span className="text-lg text-gray-500 font-medium tracking-normal">/week</span></div>
          
          <div className="w-full h-[1px] bg-black/10 mb-8"></div>

          <ul className="space-y-4 mb-10 text-left">
            <li className="flex items-center gap-3 text-[#1D1D1F] font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
              7 Cold-Pressed Juices (200 ml each)
            </li>
            <li className="flex items-center gap-3 text-[#1D1D1F] font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
              Fresh daily production
            </li>
            <li className="flex items-center gap-3 text-[#1D1D1F] font-medium">
              <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0"></div>
              Delivered every morning
            </li>
          </ul>

          <button 
            onClick={onSubscribe}
            className="w-full py-4 bg-[#1D1D1F] text-white rounded-full font-medium tracking-wide hover:bg-black transition-colors duration-300 text-sm"
          >
            Subscribe Weekly
          </button>
        </motion.div>
      </div>
    </section>
  );
}
