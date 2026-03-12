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

  return (
    <section id="menu" className="py-32 px-6 bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-[#1D1D1F]">Signature Menu.</h2>
          <p className="text-lg text-gray-500 font-light">Crafted for optimal performance and taste.</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[4/5] w-full bg-white rounded-3xl overflow-hidden mb-6 shadow-sm border border-black/5">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="px-2 text-center">
                  <h3 className="text-xl font-semibold tracking-tight text-[#1D1D1F] mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
