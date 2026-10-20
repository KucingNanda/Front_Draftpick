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

const getInitialAuth = () => {
  try {
    localStorage.removeItem('userRole');
    localStorage.removeItem('adminToken');
    const savedToken = localStorage.getItem('userToken');
    if (savedToken && savedToken !== 'null' && savedToken !== 'undefined') {
      const decoded = parseJwt(savedToken);
      if (decoded && decoded.role) {
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('userToken');
        } else {
          return { role: decoded.role, token: savedToken };
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { role: 'guest', token: null };
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth);
  const role = auth.role;
  const token = auth.token;

  const login = useCallback((newToken) => {
    localStorage.setItem('userToken', newToken);
    const decoded = parseJwt(newToken);
    if (decoded && decoded.role) {
      setAuth({ role: decoded.role, token: newToken });
    } else {
      setAuth({ role: 'guest', token: newToken });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userToken');
    setAuth({ role: 'guest', token: null });
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('userToken');
    if (!currentToken || currentToken === 'null' || currentToken === 'undefined') return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.role) {
          setAuth(prev => ({ ...prev, role: data.role }));
        }
      }
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  }, []);


  return (
    <AuthContext.Provider value={{ 
      role, 
      token, 
      login, 
      logout, 
      refreshUser,
      isWasit: role === 'wasit', 
      isPeserta: role === 'peserta', 
      isMember: role === 'member',
      isGuest: role === 'guest' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

