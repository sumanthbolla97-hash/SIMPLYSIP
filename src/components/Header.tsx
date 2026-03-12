import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onSubscribe: () => void;
  onCheckout: () => void;
  cartCount: number;
  cartTotal: number;
}

export default function Header({ onSubscribe, onCheckout, cartCount, cartTotal }: HeaderProps) {
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
      
      <div className="flex items-center gap-3 sm:gap-6">
        <a href="#menu" className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#6F6A63] hover:text-black transition-colors uppercase">
          Menu
        </a>
        <div className="flex flex-col items-end gap-1">
          <button 
            onClick={onCheckout}
            className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-white bg-[#1D1C1A] hover:bg-black transition-colors rounded-full px-4 sm:px-5 py-2.5 uppercase"
          >
            <ShoppingBag size={12} />
            Cart {cartCount}
          </button>
        </div>
        <button 
          onClick={onSubscribe}
          className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#1D1C1A] bg-white/80 border border-black/10 hover:border-black/20 transition-colors rounded-full px-4 sm:px-6 py-2.5 uppercase"
        >
          Order Now
        </button>
      </div>
    </motion.header>
  );
}
