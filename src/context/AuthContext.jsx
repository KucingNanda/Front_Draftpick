import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState('guest');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const savedToken = localStorage.getItem('userToken');
    
    // Migrasi adminToken lama jika ada
    if (!savedRole && localStorage.getItem('adminToken')) {
      const oldToken = localStorage.getItem('adminToken');
      localStorage.setItem('userRole', 'wasit');
      localStorage.setItem('userToken', oldToken);
      localStorage.removeItem('adminToken');
      setRole('wasit');
      setToken(oldToken);
    } else if (savedRole && savedToken) {
      setRole(savedRole);
      setToken(savedToken);
    }
  }, []);

  const login = useCallback((newRole, newToken) => {
    localStorage.setItem('userRole', newRole);
    localStorage.setItem('userToken', newToken);
    setRole(newRole);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken'); // Just in case
    setRole('guest');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, token, login, logout, isWasit: role === 'wasit', isPeserta: role === 'peserta', isGuest: role === 'guest' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
