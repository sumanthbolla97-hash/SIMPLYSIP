import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trash2, ArrowLeft } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { seedMenu } from '../data/seedMenu';

export default function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<any[]>(
    seedMenu.map((item, index) => ({ id: `seed-${index + 1}`, ...item }))
  );
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [upcomingOrders, setUpcomingOrders] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [userCountError, setUserCountError] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [toastOrder, setToastOrder] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const hasLoadedOrders = useRef(false);
  const hasAutoSeeded = useRef(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<"Signature Blends" | "Single Fruit Series">("Signature Blends");
  const [mrp, setMrp] = useState('150');
  const [offerPrice, setOfferPrice] = useState('119');
  const [image, setImage] = useState('');

  const handleSeedMenu = async () => {
    if (items.length > 0) return;
    setIsSeeding(true);
    try {
      await Promise.all(
        seedMenu.map((item) =>
          addDoc(collection(db, "menu"), {
            ...item,
            createdAt: serverTimestamp()
          })
        )
      );
    } catch (err) {
      console.error("Failed to seed menu:", err);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    const menuQuery = query(collection(db, "menu"));
    const unsubscribeMenu = onSnapshot(
      menuQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(data.length > 0 ? data : seedMenu.map((item, index) => ({ id: `seed-${index + 1}`, ...item })));
        setMenuError(null);
        setLoading(false);
        if (data.length === 0 && !hasAutoSeeded.current) {
          hasAutoSeeded.current = true;
          handleSeedMenu();
        }
      },
      (err) => {
        console.error("Failed to load menu:", err);
        setMenuError("Menu failed to load. Check Firestore rules.");
        setLoading(false);
      }
    );

    fetchUserCount();

    const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      if (hasLoadedOrders.current) {
        const added = snapshot.docChanges().find((change) => change.type === "added");
        if (added) {
          setToastOrder({ id: added.doc.id, ...added.doc.data() });
          window.setTimeout(() => setToastOrder(null), 5000);
        }
      }
      hasLoadedOrders.current = true;
    });
    return () => {
      unsubscribeMenu();
      unsubscribe();
    };
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

  const fetchUserCount = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      setTotalUsers(usersSnap.size);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      setUserCountError(true);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    setUpcomingOrders(
      orders.filter((order: any) => (order.status || "pending") === "pending").length
    );
    setSubscribers(
      orders.filter((order: any) =>
        Array.isArray(order.items) &&
        order.items.some((item: any) => item.id === "sub_weekly" || item.id === "sub_monthly")
      ).length
    );
    if (userCountError) {
      const uniqueUsers = new Set(
        orders.map((order: any) => order.userId).filter(Boolean)
      );
      setTotalUsers(uniqueUsers.size);
    }
  }, [orders, userCountError]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "menu"), {
        name,
        desc,
        image,
        category,
        mrp: Number(mrp),
        offerPrice: Number(offerPrice),
        price: Number(offerPrice),
        createdAt: serverTimestamp()
      });
      setName('');
      setDesc('');
      setMrp('150');
      setOfferPrice('119');
      setImage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menu", id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {toastOrder && (
          <button
            type="button"
            onClick={() => setSelectedOrder(toastOrder)}
            className="fixed top-6 right-6 z-[90] bg-white border border-black/10 rounded-2xl shadow-[0_30px_80px_-50px_rgba(0,0,0,0.45)] px-5 py-4 text-left hover:border-black/20 transition-colors"
          >
            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">New Order</div>
            <div className="text-sm font-semibold text-[#1D1D1F]">
              {toastOrder?.address?.name || "Customer"} • ₹{toastOrder?.total ?? "-"}
            </div>
          </button>
        )}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-10 text-[#1D1D1F]">Admin Dashboard.</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Total Users</div>
            <div className="text-3xl font-semibold text-[#1D1D1F]">
              {statsLoading ? "…" : totalUsers}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Upcoming Orders</div>
            <div className="text-3xl font-semibold text-[#1D1D1F]">
              {statsLoading ? "…" : upcomingOrders}
            </div>
          </div>
          <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-sm">
            <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Subscribers</div>
            <div className="text-3xl font-semibold text-[#1D1D1F]">
              {statsLoading ? "…" : subscribers}
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-bold tracking-tight mb-6 text-[#1D1D1F]">Live Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 font-medium">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 6).map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-5 rounded-2xl border border-black/5 flex items-center justify-between text-left hover:border-black/20 transition-colors"
                >
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                      {order.status || "pending"}
                    </div>
                    <div className="text-sm font-semibold text-[#1D1D1F]">
                      {order.address?.name || "Customer"} • ₹{order.total ?? "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.address?.area || "Area"} • {order.address?.phone || "Phone"}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    {order.id}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_50px_120px_-80px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">Order Details</div>
                  <div className="text-lg font-semibold text-[#1D1D1F]">
                    {selectedOrder.address?.name || "Customer"}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs uppercase tracking-[0.3em] text-[#6F6A63]"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-[#1D1D1F]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Phone</div>
                  <div>{selectedOrder.address?.phone || "-"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Area</div>
                  <div>{selectedOrder.address?.area || "-"}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">Address</div>
                  <div>{selectedOrder.address?.address || "-"}</div>
                </div>
              </div>

              <div className="border-t border-black/10 pt-4 space-y-3">
                {(selectedOrder.items || []).map((item: any, idx: number) => (
                  <div key={`${item.id}-${idx}`} className="flex items-center justify-between text-sm">
                    <div>{item.name} × {item.qty}</div>
                    <div>₹{item.price}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm font-semibold text-[#1D1D1F] pt-2 border-t border-black/10">
                  <span>Total Paid</span>
                  <span>₹{selectedOrder.total ?? "-"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-black/5 sticky top-6">
              <h2 className="text-2xl font-bold tracking-tight mb-8 text-[#1D1D1F]">Add New Juice</h2>
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as "Signature Blends" | "Single Fruit Series")}
                    className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                  >
                    <option value="Signature Blends">Signature Blends (Blends)</option>
                    <option value="Single Fruit Series">Single Fruit Series (Pure)</option>
                  </select>
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
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">MRP (₹)</label>
                  <input required type="number" value={mrp} onChange={e => setMrp(e.target.value)} className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide text-gray-500 mb-2 uppercase">Offer Price (₹)</label>
                  <input required type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} className="w-full border-b border-black/10 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent" />
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
            ) : menuError ? (
              <p className="text-red-500 font-medium">{menuError}</p>
            ) : items.length === 0 ? (
              <div className="space-y-4">
                <p className="text-gray-500 font-medium">No items found.</p>
                <button
                  onClick={handleSeedMenu}
                  disabled={isSeeding}
                  className="px-5 py-3 rounded-full border border-black/10 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1D1C1A] hover:border-black/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSeeding ? "Seeding..." : "Seed Default Menu"}
                </button>
              </div>
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
                      <span className="text-xs font-semibold tracking-wide uppercase text-gray-400">{item.category || "Menu"}</span>
                      <span className="text-sm font-bold text-[#1D1D1F]">₹{item.offerPrice ?? item.price}</span>
                      {item.mrp && (
                        <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                      )}
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
