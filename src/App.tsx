import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import Story from './components/Story';
import Menu from './components/Menu';
import Subscription from './components/Subscription';
import Checkout from './components/Checkout';
import StickyCTA from './components/StickyCTA';
import AdminDashboard from './components/AdminDashboard';
import FinalCTA from './components/FinalCTA';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-white selection:bg-[#1D1D1F] selection:text-white">
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
            <Checkout onBack={() => setIsCheckoutOpen(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Header onSubscribe={() => setIsCheckoutOpen(true)} />
            <Hero onSubscribe={() => setIsCheckoutOpen(true)} />
            <Story />
            <Menu />
            <Subscription onSubscribe={() => setIsCheckoutOpen(true)} />
            <FinalCTA onSubscribe={() => setIsCheckoutOpen(true)} />
            <StickyCTA onSubscribe={() => setIsCheckoutOpen(true)} />
            
            {/* Hidden Admin Trigger in Footer */}
            <footer className="py-12 text-center text-xs font-medium tracking-wide text-gray-400 bg-white">
              <p>© 2026 SIMPLY SIP. All rights reserved. <button onClick={() => setIsAdminOpen(true)} className="opacity-0 hover:opacity-100 transition-opacity ml-2">Admin</button></p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
