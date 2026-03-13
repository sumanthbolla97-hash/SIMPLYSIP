import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  mode: "login" | "signup";
  onClose: () => void;
  onModeChange: (mode: "login" | "signup") => void;
}

export default function AuthModal({ isOpen, mode, onClose, onModeChange }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-md bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_50px_120px_-80px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-[11px] uppercase tracking-[0.4em] text-[#6F6A63]">
              {mode === "login" ? "Login" : "Sign Up"}
            </div>
            <button
              onClick={onClose}
              className="text-xs uppercase tracking-[0.3em] text-[#6F6A63]"
            >
              Close
            </button>
          </div>

          <div className="inline-flex rounded-full border border-black/10 bg-[#F4F1EC] p-1 mb-6">
            <button
              onClick={() => onModeChange("login")}
              className={`px-4 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors ${
                mode === "login" ? "bg-[#1D1C1A] text-white" : "text-[#6F6A63]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => onModeChange("signup")}
              className={`px-4 py-2 rounded-full text-[10px] font-semibold tracking-[0.2em] uppercase transition-colors ${
                mode === "signup" ? "bg-[#1D1C1A] text-white" : "text-[#6F6A63]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Auth coming soon.");
            }}
            className="space-y-4"
          >
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light"
            />
            {mode === "signup" && (
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light"
              />
            )}
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-base focus:outline-none focus:border-black transition-colors font-light"
            />
            <button
              type="submit"
              className="w-full py-4 bg-[#1A1A1A] text-white font-semibold tracking-[0.1em] hover:bg-black transition-all duration-500 uppercase text-[11px]"
            >
              {mode === "login" ? "Continue" : "Create Account"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
