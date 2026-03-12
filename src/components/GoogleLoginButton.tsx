import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  onLoginSuccess: (user: any) => void;
}

export default function GoogleLoginButton({ onLoginSuccess }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      const credential = response.credential;
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential }),
        });
        const user = await res.json();
        onLoginSuccess(user);
      } catch (error) {
        console.error("Login Failed:", error);
      }
    };

    const initializeGoogleSignIn = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: '131277848486-tq80mrkpkmdvjpfn9p6eedn0mo5vbno3.apps.googleusercontent.com',
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          buttonRef.current,
          { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' }  // Customization options
        );
        window.google.accounts.id.prompt(); // Optional: display the One Tap prompt
      }
    };

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      script?.addEventListener('load', initializeGoogleSignIn);
      return () => {
        script?.removeEventListener('load', initializeGoogleSignIn);
      };
    }

  }, [onLoginSuccess]);

  return <div ref={buttonRef}></div>;
}
