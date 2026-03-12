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
    const handleCredentialResponse = (response: any) => {
      const credential = response.credential;
      const payload = JSON.parse(atob(credential.split('.')[1]));
      onLoginSuccess({ name: payload.given_name, email: payload.email, picture: payload.picture });
    };

    const initializeGoogleSignIn = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: '855236257473-b7mll0j645j2h8fofm4kch15799vj4g4.apps.googleusercontent.com',
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
