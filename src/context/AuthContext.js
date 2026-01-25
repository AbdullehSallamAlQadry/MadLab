'use client'

import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [logout, setLogout] = useState(false);
  const [showLoginReminder, setShowLoginReminder] = useState(false);

  const openLogin = () => {
    setLogin(true);
    setSignup(false);
  };

  const openSignup = () => {
    setSignup(true);
    setLogin(false);
  };

  const closeAll = () => {
    setLogin(false);
    setSignup(false);
    setLogout(false);
  };

  const logoutAction = (bool) => {
    setLogout(bool);
  };

  const openLoginReminder = () => setShowLoginReminder(true);
  const closeLoginReminder = () => setShowLoginReminder(false);

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        logout,
        showLoginReminder,
        openLogin,
        openSignup,
        closeAll,
        logoutAction,
        openLoginReminder,
        closeLoginReminder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}