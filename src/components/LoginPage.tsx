import { motion } from 'motion/react';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-ivory"
    >
      <div className="-mt-24">
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-[0.3em] uppercase text-ink">
          SIMPLYSIP
        </h1>
        <h2 className="text-4xl md:text-6xl font-script font-semibold tracking-wider text-ink -mt-2 md:-mt-4">
          Elixirs
        </h2>
        <p className="mt-6 text-sm md:text-base text-ash tracking-wide max-w-sm mx-auto">
          Your daily dose of health, delivered.
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 w-full px-8"
      >
        <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
        <a 
          href="#menu"
          className="text-[11px] font-semibold tracking-[0.2em] text-ash hover:text-ink transition-colors uppercase"
        >
          View Menu
        </a>
      </motion.div>
    </motion.div>
  );
}
