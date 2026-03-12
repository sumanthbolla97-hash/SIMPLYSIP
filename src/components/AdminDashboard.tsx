import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('15');
  const [image, setImage] = useState('');
  const [day, setDay] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, desc, price: Number(price), image, day })
      });
      if (res.ok) {
        setName('');
        setDesc('');
        setPrice('15');
        setImage('');
        setDay('');
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/menu?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-[#1D1D1F]">Menu Admin.</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 sticky top-6">
              <h2 className="text-2xl font-bold tracking-tight mb-8 text-[#1D1D1F]">Add New Item</h2>
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Day/Label</label>
                  <input required value={day} onChange={e => setDay(e.target.value)} placeholder="e.g. Day 8" className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Juice Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Citrus Blast" className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Ingredients</label>
                  <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Orange, Lemon, Ginger" className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent min-h-[80px] resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Price (₹)</label>
                  <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Image URL</label>
                  <input required value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#1D1D1F] text-white rounded-full font-medium tracking-wide hover:bg-black transition-colors duration-300 text-sm mt-4">
                  Add Item
                </button>
              </form>
            </div>
          </div>

          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-[#1D1D1F]">Current Menu</h2>
            {loading ? (
              <p className="text-gray-500 font-medium">Loading menu...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-500 font-medium">No items found.</p>
            ) : (
              items.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-black/5 flex items-center gap-8 group"
                >
                  <div className="w-24 h-24 bg-[#F5F5F7] rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xs font-semibold tracking-wide uppercase text-gray-400">{item.day}</span>
                      <span className="text-sm font-bold text-[#1D1D1F]">₹{item.price}</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-[#1D1D1F] mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 font-light truncate max-w-md">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-4 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
