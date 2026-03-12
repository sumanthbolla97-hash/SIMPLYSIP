import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface StickyCTAProps {
  onSubscribe: () => void;
}

export default function StickyCTA({ onSubscribe }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling down 500px
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
          className="fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none flex justify-center"
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-black/5 p-3 rounded-full shadow-2xl flex items-center justify-between pointer-events-auto w-full max-w-sm mx-auto">
            <div className="pl-4 flex items-center gap-3">
              <div className="text-xs font-medium text-gray-500">Weekly Plan</div>
              <div className="text-lg font-bold text-[#1D1D1F]">₹699</div>
            </div>
            <button 
              onClick={onSubscribe}
              className="px-6 py-2.5 bg-[#1D1D1F] text-white rounded-full font-medium hover:bg-black transition-colors text-sm"
            >
              Subscribe
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
