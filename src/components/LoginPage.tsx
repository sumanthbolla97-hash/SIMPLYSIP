import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FBFAF7]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Simply Sip</h1>
        <p className="text-lg text-gray-600 mb-8">Sign in to continue</p>
        <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
