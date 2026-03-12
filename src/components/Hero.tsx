import { motion } from 'motion/react';

interface HeroProps {
  onSubscribe: () => void;
}

export default function Hero({ onSubscribe }: HeroProps) {
  return (
    <section className="relative h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1622597467836-f38240662c8b?q=80&w=2000&auto=format&fit=crop" 
          alt="Simply Sip Cold Pressed Juice" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6 mt-32 w-full">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 text-white leading-[0.9]"
        >
          Pure. Raw.<br />Vital.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl font-light text-white/90 mb-12 tracking-tight max-w-2xl mx-auto"
        >
          Clean hydration engineered for the modern professional.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <a 
            href="#menu"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-medium tracking-wide hover:bg-white/20 transition-colors duration-300 text-sm flex items-center justify-center"
          >
            Explore Menu
          </a>
          <button 
            onClick={onSubscribe}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium tracking-wide hover:bg-gray-100 transition-colors duration-300 text-sm"
          >
            Start Weekly Plan
          </button>
        </motion.div>
      </div>
    </section>
  );
}
