import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyCTAProps {
  onSubscribe: () => void;
}

export default function StickyCTA({ onSubscribe }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 sm:bottom-6 left-0 right-0 px-4 sm:px-6 z-50 pointer-events-none flex justify-center"
        >
          <div className="bg-white/85 backdrop-blur-2xl border border-black/5 p-3 rounded-full shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)] flex items-center justify-between pointer-events-auto w-full max-w-sm mx-auto">
            <div className="pl-4 flex items-center gap-3">
              <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6F6A63]">Weekly Plan</div>
              <div className="text-lg font-semibold text-[#1D1C1A] font-display">₹699</div>
            </div>
            <button 
              onClick={onSubscribe}
              className="px-5 sm:px-6 py-2.5 bg-[#1D1C1A] text-white rounded-full font-semibold tracking-[0.2em] uppercase text-[10px] hover:bg-black transition-colors"
            >
              Subscribe
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
