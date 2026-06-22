import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Fetch Interceptor untuk otomatis menyertakan JWT Token
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem('userToken');
  if (token && typeof input === 'string' && input.includes('/api/')) {
    init = init || {};
    init.headers = {
      ...init.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
