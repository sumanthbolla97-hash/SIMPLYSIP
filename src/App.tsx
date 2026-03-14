import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Subscription from './components/Subscription';
import Story from './components/Story';
import Checkout from './components/Checkout';
import StickyCTA from './components/StickyCTA';
import AdminDashboard from './components/AdminDashboard';
import FinalCTA from './components/FinalCTA';
import AuthModal from './components/AuthModal';
import ProfilePanel from './components/ProfilePanel';
import { isSignInWithEmailLink, onAuthStateChanged, signInWithEmailLink, signOut, User } from 'firebase/auth';
import { get, onValue, ref, update } from 'firebase/database';
import { auth, db } from './firebaseConfig';
import { Product, UserProfile, Order } from './types';
import { seedMenu } from './data/seedMenu';

export default function App() {
  const ADMIN_EMAIL = "sumanthbolla97@gmail.com";
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [menuItems, setMenuItems] = useState<Product[]>([]);
  const [menuTotal, setMenuTotal] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly">("weekly");
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile> | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [localUserOrders, setLocalUserOrders] = useState<Order[]>([]);
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;
  const [isCartHydrated, setIsCartHydrated] = useState(false);
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const subscriptionTotal =
    (cart.sub_weekly ? 699 : 0) + (cart.sub_monthly ? 2599 : 0);
  const combinedTotal = menuTotal + subscriptionTotal;

  const handleSubscription = (plan: "weekly" | "monthly") => {
    setCart((prev) => {
      const next = { ...prev };
      delete next.sub_weekly;
      delete next.sub_monthly;
      next[plan === "weekly" ? "sub_weekly" : "sub_monthly"] = 1;
      return next;
    });
    setSelectedPlan(plan);
    setIsPlanOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleIncrementItem = (id: string) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1
    }));
  };

  const handleDecrementItem = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[id]) return prev;
      if (next[id] === 1) {
        delete next[id];
      } else {
        next[id] -= 1;
      }
      return next;
    });
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAuthOpen(false);
      } else {
        setIsAdminOpen(false);
        setIsCartHydrated(false);
        setUserProfile(null);
      }
    });
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("simplysip_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch {
      // ignore malformed local storage
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("simplysip_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!user) return;
    const hydrateCart = async () => {
      const localCart = (() => {
        try {
          const saved = window.localStorage.getItem("simplysip_cart");
          return saved ? JSON.parse(saved) : null;
        } catch {
          return null;
        }
      })();
      try {
        const snap = await get(ref(db, `users/${user.uid}`));
        const data = snap.exists() ? (snap.val() as any) : null;
        if (data?.cart && Object.keys(data.cart).length > 0) {
          setCart(data.cart);
        } else if (localCart && Object.keys(localCart).length > 0) {
          setCart(localCart);
          await update(ref(db, `users/${user.uid}`), { cart: localCart });
        }
      } catch (err) {
        console.warn("Failed to hydrate cart from database:", err);
        if (localCart && Object.keys(localCart).length > 0) {
          setCart(localCart);
        }
      } finally {
        setIsCartHydrated(true);
      }
    };
    hydrateCart();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    return onValue(
      userRef,
      (snapshot) => {
        setUserProfile(snapshot.val() || null);
      },
      (err) => {
        console.warn("Failed to load user profile:", err);
      }
    );
  }, [user]);

  useEffect(() => {
    const menuRef = ref(db, "menu");
    const unsubscribe = onValue(
      menuRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const data: Product[] = Object.entries(val).map(([id, item]) => ({
            id,
            ...(item as Omit<Product, 'id'>),
          }));
          setMenuItems(data);
        } else {
          // Fallback or seed if necessary
          setMenuItems(seedMenu.map((item, i) => ({ ...item, id: String(i + 1) } as Product)));
        }
      },
      (err) => {
        console.error("Menu realtime update failed:", err);
        // Fallback to static seed data on error
        setMenuItems(seedMenu.map((item, i) => ({ ...item, id: String(i + 1) } as Product)));
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      return;
    }

    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allOrders: Order[] = Object.entries(data).map(([id, orderData]) => ({
          id,
          ...(orderData as any)
        }));
        
        const myOrders: Order[] = allOrders.filter(o => 
          o.userId === user.uid || (user.email && o.userEmail === user.email)
        ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setUserOrders(myOrders);
        setLocalUserOrders((prev) => prev.filter((lo) => !myOrders.some((mo) => mo.id === lo.id)));
      } else {
        setUserOrders([]);
      }
    }, (error) => {
      console.error("Failed to load user orders:", error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user || !isCartHydrated) return;
    const handle = window.setTimeout(() => {
      update(ref(db, `users/${user.uid}`), { cart, cartUpdatedAt: Date.now() }).catch((err) => {
        console.warn("Failed to persist cart:", err);
      });
    }, 500);
    return () => window.clearTimeout(handle);
  }, [cart, user, isCartHydrated]);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("simplysip_email_link") || window.prompt("Confirm your email to complete sign-in");
      if (!email) return;
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("simplysip_email_link");
          setIsAuthOpen(false);
        })
        .catch((err) => {
          console.error("Email link sign-in failed:", err);
        });
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsProfileOpen(false);
  };

  const handleAddressUpdate = async (addressData: any) => {
    if (!user) return;
    const payload = { ...addressData, updatedAt: Date.now() };
    await update(ref(db, `users/${user.uid}`), payload);
    setUserProfile((prev: any) => ({ ...(prev || {}), ...payload }));
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setLocalUserOrders((prev) => {
      if (prev.some((o) => o.id === newOrder.id)) return prev;
      return [newOrder, ...prev];
    });
  };

  const displayOrders: Order[] = [...localUserOrders, ...userOrders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  return (
    <div className="relative min-h-screen bg-[#FBFAF7] selection:bg-[#1D1C1A] selection:text-white">
      <AnimatePresence mode="wait">
        {isAdminOpen ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminDashboard onBack={() => setIsAdminOpen(false)} />
          </motion.div>
        ) : isCheckoutOpen ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Checkout 
              onBack={() => setIsCheckoutOpen(false)} 
              user={user ? ({
                ...(userProfile || {}),
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber
              } as UserProfile) : null}
              menuItems={menuItems}
              cart={cart}
              onClearCart={() => setCart({})}
              onRemoveItem={handleRemoveItem}
              onIncrementItem={handleIncrementItem}
              onDecrementItem={handleDecrementItem}
              onAddressUpdate={handleAddressUpdate}
              onOrderPlaced={handleOrderPlaced}
            />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Header 
              user={user}
              onAuth={() => {
                setAuthMode("login");
                setIsAuthOpen(true);
              }}
              onLogout={handleLogout}
              isAdmin={isAdmin}
              onAdminOpen={() => setIsAdminOpen(true)}
              onProfileToggle={() => setIsProfileOpen(true)}
            />
            <Hero onSubscribe={() => setIsPlanOpen(true)} />
            <Menu 
              cart={cart}
              menuItems={menuItems}
              setCart={setCart}
              onCheckout={() => setIsCheckoutOpen(true)}
              onCartTotalChange={setMenuTotal}
            />
            <Subscription 
              onSubscribe={(plan) => handleSubscription(plan)}
              selectedPlan={selectedPlan}
              onPlanChange={(plan) => setSelectedPlan(plan)}
            />
            <Story />
            <FinalCTA onSubscribe={() => setIsCheckoutOpen(true)} />
            <StickyCTA 
              onSubscribePlan={handleSubscription}
              selectedPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
              onCheckout={() => setIsCheckoutOpen(true)}
              cartCount={cartCount}
            />

            {isPlanOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="w-full max-w-lg bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_50px_120px_-80px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63]">Select Plan</div>
                    <button
                      onClick={() => setIsPlanOpen(false)}
                      className="text-xs uppercase tracking-[0.3em] text-[#6F6A63]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => handleSubscription("weekly")}
                      className="w-full text-left border border-black/10 rounded-3xl p-5 hover:border-black/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm uppercase tracking-[0.3em] text-[#6F6A63] mb-1">Weekly Plan</div>
                          <div className="text-lg font-semibold text-[#1D1C1A] font-display">{"\u20B9"}699 / week</div>
                          <div className="text-xs text-[#6F6A63]">7 cold-pressed juices (200 ml each)</div>
                        </div>
                        <span className="pointer-events-none inline-flex items-center justify-center min-w-[140px] px-5 sm:px-6 py-2.5 bg-[#1D1C1A] text-white rounded-full font-semibold tracking-[0.2em] uppercase text-[10px]">
                          Subscribe Now
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSubscription("monthly")}
                      className="w-full text-left border border-black/10 rounded-3xl p-5 hover:border-black/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm uppercase tracking-[0.3em] text-[#6F6A63] mb-1">Monthly Plan</div>
                          <div className="text-lg font-semibold text-[#1D1C1A] font-display">{"\u20B9"}2599 / month</div>
                          <div className="text-xs text-[#6F6A63]">One cold-pressed juice a day for the month</div>
                        </div>
                        <span className="pointer-events-none inline-flex items-center justify-center min-w-[140px] px-5 sm:px-6 py-2.5 bg-[#1D1C1A] text-white rounded-full font-semibold tracking-[0.2em] uppercase text-[10px]">
                          Subscribe Now
                        </span>
                      </div>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            <AuthModal
              isOpen={isAuthOpen}
              mode={authMode}
              onClose={() => setIsAuthOpen(false)}
              onModeChange={(mode) => setAuthMode(mode)}
            />
            
            <ProfilePanel
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              user={user}
              userProfile={userProfile}
              orders={displayOrders}
              onLogout={handleLogout}
              onAddressUpdate={handleAddressUpdate}
              isAdmin={isAdmin}
              onAdminOpen={() => {
                setIsProfileOpen(false);
                setIsAdminOpen(true);
              }}
            />

            {/* Hidden Admin Trigger in Footer */}
            <footer className="py-12 text-center text-xs font-medium tracking-wide text-gray-400 bg-white">
              <p>(c) 2026 SIMPLY SIP. All rights reserved. <button onClick={() => setIsAdminOpen(true)} className="opacity-0 hover:opacity-100 transition-opacity ml-2">Admin</button></p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
