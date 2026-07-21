import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState('guest');
  const [token, setToken] = useState(null);

  useEffect(() => {
    localStorage.removeItem('userRole'); // Bersihkan sisa-sisa lama
    localStorage.removeItem('adminToken');
    
    const savedToken = localStorage.getItem('userToken');
    if (savedToken) {
      const decoded = parseJwt(savedToken);
      if (decoded && decoded.role) {
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('userToken');
        } else {
          setRole(decoded.role);
          setToken(savedToken);
        }
      }
    }
  }, []);

  const login = useCallback((newToken) => {
    localStorage.setItem('userToken', newToken);
    const decoded = parseJwt(newToken);
    if (decoded && decoded.role) {
      setRole(decoded.role);
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userRole'); // Just in case
    localStorage.removeItem('userToken');
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
