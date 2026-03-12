import { useState, useEffect } from 'react';
import Header from './components/Header';
import Menu from './components/Menu';
import Checkout from './components/Checkout';
import LoginPage from './components/LoginPage';
import { AnimatePresence } from 'motion/react';

function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState('menu'); // 'menu' or 'checkout'
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setView('menu');
  };

  const handleAddToCart = (id: string) => {
    setCart(prevCart => ({ ...prevCart, [id]: (prevCart[id] || 0) + 1 }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  const handleRemoveItem = (id: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      delete newCart[id];
      return newCart;
    });
  };

  const handleAddressUpdate = (addressData: any) => {
    setUser((prevUser: any) => ({ ...prevUser, ...addressData }));
  };

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A]">
      <Header 
        user={user}
        onLogout={handleLogout}
        onCheckout={() => setView('checkout')}
        cartCount={cartCount}
        onLoginSuccess={handleLoginSuccess}
      />
      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <Menu onAddToCart={handleAddToCart} />
        )}
        {view === 'checkout' && (
          <Checkout 
            user={user}
            onBack={() => setView('menu')}
            cart={cart}
            onClearCart={handleClearCart}
            onRemoveItem={handleRemoveItem}
            onIncrementItem={handleAddToCart}
            onDecrementItem={handleRemoveFromCart}
            onAddressUpdate={handleAddressUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
