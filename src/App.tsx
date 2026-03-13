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
import { isSignInWithEmailLink, onAuthStateChanged, signInWithEmailLink, signOut } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartTotal, setCartTotal] = useState(0);
  const [menuTotal, setMenuTotal] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly">("weekly");
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<any | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
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
      }
    });
  }, []);

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
    setIsLogoutOpen(false);
  };

  const handleAddressUpdate = async (addressData: any) => {
    if (!user) return;
    await setDoc(
      doc(db, "users", user.uid),
      {
        ...addressData,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  };

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
              user={user}
              cart={cart}
              onClearCart={() => setCart({})}
              onRemoveItem={handleRemoveItem}
              onIncrementItem={handleIncrementItem}
              onDecrementItem={handleDecrementItem}
              onAddressUpdate={handleAddressUpdate}
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
              onLogout={() => setIsLogoutOpen(true)}
            />
            <Hero onSubscribe={() => setIsPlanOpen(true)} />
            <Menu 
              cart={cart}
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
                          <div className="text-lg font-semibold text-[#1D1C1A] font-display">₹699 / week</div>
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
                          <div className="text-lg font-semibold text-[#1D1C1A] font-display">₹2599 / month</div>
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

            {isLogoutOpen && (
              <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
                <div className="w-full max-w-sm bg-white rounded-[1.8rem] p-6 border border-black/5 shadow-[0_50px_120px_-80px_rgba(0,0,0,0.5)]">
                  <div className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63] mb-3">
                    Confirm Logout
                  </div>
                  <p className="text-sm text-[#1D1C1A] mb-6">
                    Do you want to log out?
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLogout}
                      className="flex-1 py-3 bg-[#1A1A1A] text-white font-semibold tracking-[0.1em] uppercase text-[11px] rounded-full hover:bg-black transition-colors"
                    >
                      Yes, Logout
                    </button>
                    <button
                      onClick={() => setIsLogoutOpen(false)}
                      className="flex-1 py-3 border border-black/10 text-[#1A1A1A] font-semibold tracking-[0.1em] uppercase text-[11px] rounded-full hover:border-black/20 transition-colors"
                    >
                      No, Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

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
