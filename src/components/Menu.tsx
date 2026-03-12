import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Menu() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const groupedItems = menuItems.reduce((acc: Record<string, any[]>, item) => {
    const key = item.category || "Signature Blends";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const categoryOrder = ["Signature Blends", "Single Fruit Series"];

  return (
    <section id="menu" className="scroll-mt-24 sm:scroll-mt-28 py-24 sm:py-32 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 sm:mb-20 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-4">Menu</p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight mb-4 text-[#1D1C1A] font-display">Signature blends and single-fruit series.</h2>
          <p className="text-sm md:text-base text-[#6F6A63] font-light">Minimal ingredients, cold-pressed daily.</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading collection...</div>
        ) : (
          <div className="space-y-16 sm:space-y-20">
            {categoryOrder.map((category) => (
              <div key={category} className="space-y-8 sm:space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-3">{category}</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-[#1D1C1A] font-display">
                      {category === "Signature Blends" ? "Layered flavors, clean finish." : "Single fruit, pure expression."}
                    </h3>
                  </div>
                  <div className="hidden md:block h-px w-48 bg-black/10"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-14">
                  {(groupedItems[category] || []).map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="aspect-[3/4] w-full bg-[#FBFAF7] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden mb-5 sm:mb-6 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.35)] border border-black/5 transition-transform duration-500 group-hover:-translate-y-1">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="px-2 text-center">
                        <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-[#1D1C1A] mb-2 font-display">{item.name}</h4>
                        <p className="text-[11px] sm:text-[12px] text-[#6F6A63] font-light tracking-[0.08em] sm:tracking-[0.12em] uppercase leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
