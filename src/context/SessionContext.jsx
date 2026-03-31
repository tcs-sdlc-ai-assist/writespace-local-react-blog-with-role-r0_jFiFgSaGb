import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as authLogin, register as authRegister, logout as authLogout, getSession } from '../services/authService';

const SessionContext = createContext(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    const result = authLogin(username, password);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const register = useCallback((username, password, confirmPassword) => {
    const result = authRegister(username, password, confirmPassword);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = !!user && user.role === 'admin';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;