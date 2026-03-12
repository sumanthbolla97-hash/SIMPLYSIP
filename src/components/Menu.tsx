import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Menu() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackMenu = [
    {
      id: "1",
      category: "Signature Blends",
      name: "Hulk Greens",
      desc: "Green Apple • Cucumber • Ginger • Spinach • Lime",
      image: "/images/hulk-greens.png"
    },
    {
      id: "2",
      category: "Signature Blends",
      name: "Melon Booster",
      desc: "Watermelon • Cucumber • Mint",
      image: "/images/melon-booster.png"
    },
    {
      id: "3",
      category: "Signature Blends",
      name: "ABC",
      desc: "Apple • Beetroot • Carrot",
      image: "/images/abc.png"
    },
    {
      id: "4",
      category: "Signature Blends",
      name: "A-Star",
      desc: "Apple • Pomegranate",
      image: "/images/a-star.png"
    },
    {
      id: "5",
      category: "Signature Blends",
      name: "AMG",
      desc: "Apple • Mint • Ginger",
      image: "/images/amg.png"
    },
    {
      id: "6",
      category: "Signature Blends",
      name: "Ganga Jamuna",
      desc: "Orange • Mosambi",
      image: "/images/ganga-jamuna.png"
    },
    {
      id: "7",
      category: "Single Fruit Series",
      name: "Coco Fresh",
      desc: "Tender Coconut Water",
      image: "/images/coco-fresh.png"
    },
    {
      id: "8",
      category: "Single Fruit Series",
      name: "Sunshine Sip",
      desc: "Mosambi",
      image: "/images/sunshine-sip.png"
    },
    {
      id: "9",
      category: "Single Fruit Series",
      name: "Golden Sunrise",
      desc: "Orange",
      image: "/images/golden-sunrise.png"
    },
    {
      id: "10",
      category: "Single Fruit Series",
      name: "Orchard Gold",
      desc: "Apple",
      image: "/images/orchard-gold.png"
    },
    {
      id: "11",
      category: "Single Fruit Series",
      name: "Tropical Bliss",
      desc: "Pineapple",
      image: "/images/tropical-bliss.png"
    },
    {
      id: "12",
      category: "Single Fruit Series",
      name: "Velvet Vine",
      desc: "Pomegranate",
      image: "/images/velvet-vine.png"
    },
    {
      id: "13",
      category: "Single Fruit Series",
      name: "Purple Crush",
      desc: "Black Grapes",
      image: "/images/purple-crush.png"
    },
    {
      id: "14",
      category: "Single Fruit Series",
      name: "Verjus",
      desc: "Green Grapes",
      image: "/images/verjus.png"
    },
    {
      id: "15",
      category: "Single Fruit Series",
      name: "Garden Joy",
      desc: "Carrot",
      image: "/images/garden-joy.png"
    }
  ];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems(fallbackMenu);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMenuItems(fallbackMenu);
        setLoading(false);
      });
  }, []);

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
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-4">Signature Menu</p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight mb-4 text-[#1D1C1A] font-display">Pure blends. Minimal ingredients.</h2>
          <p className="text-sm md:text-base text-[#6F6A63] font-light">Cold-pressed daily for clean, effortless hydration.</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-14">
            {menuItems.map((item, index) => (
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
        )}
      </div>
    </section>
  );
}
