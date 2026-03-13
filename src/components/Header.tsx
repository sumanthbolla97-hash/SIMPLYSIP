import { motion } from 'motion/react';

interface HeaderProps {
  user: any | null;
  onAuth: () => void;
  onLogout: () => void;
}

export default function Header({ user, onAuth, onLogout }: HeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-4 sm:py-5 px-4 sm:px-6 md:px-12 bg-white/70 backdrop-blur-2xl border-b border-black/5"
    >
      <div className="flex items-baseline">
        <div className="text-base sm:text-lg md:text-xl font-extrabold tracking-[0.32em] sm:tracking-[0.38em] text-[#1D1C1A] font-display uppercase">
          SIMPLYSIP
        </div>
        <span className="ml-2 text-base sm:text-lg md:text-xl text-[#1D1C1A] font-script font-semibold tracking-[0.08em] uppercase">
          ELIXIRS
        </span>
      </div>
      
      <div className="flex items-center gap-3 sm:gap-6">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#6F6A63] uppercase">
              {user.displayName ? `Hi, ${user.displayName}` : "Signed In"}
            </span>
            <button
              onClick={onLogout}
              className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#6F6A63] hover:text-black transition-colors uppercase"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={onAuth}
            className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] text-[#6F6A63] hover:text-black transition-colors uppercase"
          >
            Login
          </button>
        )}
      </div>
    </motion.header>
  );
}
