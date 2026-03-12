import { motion } from 'motion/react';

interface HeaderProps {
  onSubscribe: () => void;
}

export default function Header({ onSubscribe }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 sm:py-5 px-4 sm:px-6 md:px-12 bg-white/70 backdrop-blur-2xl border-b border-black/5"
    >
      <div className="text-base sm:text-lg md:text-xl font-semibold tracking-[0.2em] sm:tracking-[0.3em] text-[#1D1C1A] font-display">
        SIMPLY SIP
      </div>
      
      <div className="flex items-center gap-4 sm:gap-8">
        <a href="#menu" className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#6F6A63] hover:text-black transition-colors uppercase">
          Menu
        </a>
        <button 
          onClick={onSubscribe}
          className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-white bg-[#1D1C1A] hover:bg-black transition-colors rounded-full px-4 sm:px-6 py-2.5 uppercase"
        >
          Order Now
        </button>
      </div>
    </motion.header>
  );
}
