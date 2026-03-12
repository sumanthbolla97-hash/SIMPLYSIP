import { motion } from 'motion/react';
import { Droplet, Ban, Leaf, GlassWater, Sparkles } from 'lucide-react';

const features = [
  { icon: Droplet, title: "Cold-Pressed Daily" },
  { icon: Ban, title: "No Added Sugar" },
  { icon: Leaf, title: "No Preservatives" },
  { icon: GlassWater, title: "Glass Bottled" },
  { icon: Sparkles, title: "Clean Ingredients" }
];

export default function Story() {
  return (
    <section className="py-24 px-6 bg-white border-b border-black/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 mb-4 flex items-center justify-center text-[#1D1D1F]">
                <feature.icon strokeWidth={1.5} size={28} />
              </div>
              <h3 className="text-sm font-medium tracking-tight text-[#1D1D1F]">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
