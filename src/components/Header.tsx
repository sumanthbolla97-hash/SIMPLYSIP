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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 px-6 md:px-12 bg-white/80 backdrop-blur-2xl border-b border-black/5"
    >
      <div className="text-xl font-bold tracking-tight text-[#1D1D1F]">
        SIMPLY SIP
      </div>
      
      <div className="flex items-center gap-8">
        <a href="#menu" className="hidden md:block text-xs font-medium tracking-wide text-gray-500 hover:text-black transition-colors">
          Menu
        </a>
        <button 
          onClick={onSubscribe}
          className="text-xs font-medium tracking-wide text-white bg-[#1D1D1F] hover:bg-black transition-colors rounded-full px-5 py-2"
        >
          Order Now
        </button>
      </div>
    </motion.header>
  );
}
