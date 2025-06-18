// components/Auth/LogoutButton.js
import React, { useState } from 'react';
import { signOut } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = '' }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('Signing out...');
      
      // Sign out from Cognito
      await signOut();
      
      console.log('Successfully signed out');
      
      // Redirect to login page
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`block w-full px-3 py-2 rounded transition text-left ${
        isLoggingOut 
          ? 'bg-red-300 text-red-800 cursor-not-allowed' 
          : 'bg-red-600 text-white hover:bg-red-700'
      } ${className}`}
      type="button"
    >
      {isLoggingOut ? 'Signing out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;