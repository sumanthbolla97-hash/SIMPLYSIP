import React from 'react';

interface GoogleLoginButtonProps {
  onLoginSuccess: (user: any) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onLoginSuccess }) => {
  const handleGoogleLogin = (response: any) => {
    fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: response.credential }),
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.error) {
            throw new Error(user.error);
        }
        onLoginSuccess(user);
      })
      .catch((err) => {
        console.error("Error logging in:", err);
      });
  };

  React.useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { theme: "outline", size: "large" } 
      );
    }
  }, []);

  return <div id="google-login-button"></div>;
};

export default GoogleLoginButton;
