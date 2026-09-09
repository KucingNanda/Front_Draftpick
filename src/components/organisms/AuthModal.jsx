import { useState, useEffect } from 'react';
import { X, User, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const api = useApi();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setUsername('');
      setPassword('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/login' : '/api/register';
      const body = mode === 'login' 
        ? { username, password }
        : { username, password, role: 'peserta' };

      const res = await api(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (mode === 'login') {
        if (data.token) {
          login(data.token);
          Swal.fire({ 
            title: 'Berhasil', 
            text: data.message, 
            icon: 'success', 
            timer: 1500, 
            showConfirmButton: false,
            background: 'var(--theme-bg-panel)',
            color: 'var(--theme-text-main)'
          });
          onClose();
        } else {
          Swal.fire({
            title: 'Gagal', 
            text: data.error || 'Login gagal, pastikan Username dan Password benar.', 
            icon: 'error',
            background: 'var(--theme-bg-panel)',
            color: 'var(--theme-text-main)'
          });
        }
      } else {
        if (res.ok) {
          Swal.fire({ 
            title: 'Berhasil', 
            text: 'Akun peserta berhasil dibuat! Silakan Login.', 
            icon: 'success',
            background: 'var(--theme-bg-panel)',
            color: 'var(--theme-text-main)'
          });
          setMode('login');
          setPassword('');
        } else {
          Swal.fire({
            title: 'Gagal', 
            text: data.error || 'Register gagal, username mungkin sudah dipakai.', 
            icon: 'error',
            background: 'var(--theme-bg-panel)',
            color: 'var(--theme-text-main)'
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error', 
        text: 'Koneksi ke server terputus.', 
        icon: 'error',
        background: 'var(--theme-bg-panel)',
        color: 'var(--theme-text-main)'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div 
        className="bg-theme-bgPanel w-full max-w-md rounded-2xl shadow-2xl border border-theme-border overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/20 to-purple-600/20 pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-theme-textSub hover:text-theme-textMain bg-theme-bgBase hover:bg-theme-bgHover p-2 rounded-full transition-colors z-20"
        >
          <X size={18} />
        </button>

        <div className="p-8 pt-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-theme-textMain mb-2">
              {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h2>
            <p className="text-theme-textSub">
              {mode === 'login' ? 'Silakan masuk ke akun Anda untuk melanjutkan.' : 'Daftarkan diri Anda sebagai peserta turnamen.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-theme-textSub mb-1.5 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-textSub">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full bg-theme-bgBase border border-theme-border rounded-xl pl-11 pr-4 py-3.5 text-theme-textMain focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-theme-textSub/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-textSub mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-textSub">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-theme-bgBase border border-theme-border rounded-xl pl-11 pr-12 py-3.5 text-theme-textMain focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-theme-textSub/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-theme-textSub hover:text-theme-textMain transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />
              )}
              {mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-8 text-center text-theme-textSub text-sm">
            {mode === 'login' ? (
              <p>
                Belum punya akun?{' '}
                <button 
                  onClick={() => setMode('register')} 
                  className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah punya akun?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
                >
                  Masuk di sini
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
