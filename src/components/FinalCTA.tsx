import { motion } from 'motion/react';

interface FinalCTAProps {
  onSubscribe: () => void;
}

export default function FinalCTA({ onSubscribe }: FinalCTAProps) {
  return (
    <section className="py-40 px-6 bg-white text-center">
      <div className="max-w-3xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 text-[#1D1D1F] leading-[1.1]"
        >
          Drink Clean.<br />
          Feel Light.<br />
          Live Fresh.
        </motion.h2>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={onSubscribe}
          className="px-10 py-4 bg-[#1D1D1F] text-white rounded-full font-medium tracking-wide hover:bg-black transition-colors duration-300 text-sm"
        >
          Order Now
        </motion.button>
      </div>
    </section>
  );
}
