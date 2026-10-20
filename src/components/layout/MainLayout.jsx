import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, UserCheck, Swords, History, LogOut, Settings, User, Shield } from 'lucide-react';
import ThemeToggle from '../atoms/ThemeToggle';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import AuthModal from '../organisms/AuthModal';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, login, logout, isWasit, isPeserta, isMember, isGuest } = useAuth();
  const api = useApi();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} />, show: true },
    { name: 'Draft Pick', path: '/draft', icon: <Swords size={20} />, show: true },
    { name: 'Karakter', path: '/karakter', icon: <Users size={20} />, show: true },
    { name: 'Formasi Saya', path: '/my-peserta', icon: <Shield size={20} />, show: isMember || isPeserta },
    { name: 'Data Peserta', path: '/peserta', icon: <UserCheck size={20} />, show: !isGuest },
    { name: 'Riwayat Match', path: '/history', icon: <History size={20} />, show: true },
    { name: 'Panel Wasit', path: '/admin', icon: <Settings size={20} />, show: isWasit },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Anda akan kembali menjadi Guest.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: 'var(--theme-bg-panel)',
      color: 'var(--theme-text-main)'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/');
      }
    });
  };

  return (
    <div className="flex h-screen bg-theme-bgBase text-theme-textMain font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-theme-bgPanel border-r border-theme-border flex flex-col transition-colors duration-300 shrink-0">
        <div className="p-4 pt-6 pb-2">
          <h1 className="text-2xl font-bold text-theme-textMain tracking-wider text-center mb-4">
            DRAFT PICK
          </h1>
          <ThemeToggle />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
          {navItems.filter(item => item.show).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-theme-bgHover text-theme-textMain font-medium shadow-sm'
                  : 'text-theme-textSub hover:bg-theme-bgHover hover:text-theme-textMain'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth & Profile Section Modern di Bawah Sidebar */}
        <div className="p-3 border-t border-theme-border shrink-0">
          {isGuest ? (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <User size={16} /> Login
              </button>
              <button 
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <UserCheck size={16} /> Register
              </button>
            </div>
          ) : (
            <div className={`flex items-center justify-between p-2 rounded-xl transition-all border ${
              location.pathname === '/profil' 
                ? 'bg-theme-bgHover border-blue-500/40 shadow-sm' 
                : 'bg-theme-bgBase/60 hover:bg-theme-bgHover border-theme-border'
            }`}>
              {/* Klik kartu untuk langsung membuka halaman Profil */}
              <Link 
                to="/profil" 
                className="flex items-center gap-3 min-w-0 flex-1 pr-2 group"
                title="Buka Pengaturan Profil"
              >
                <div className="w-10 h-10 rounded-lg bg-theme-bgPanel flex items-center justify-center border border-theme-border shrink-0 group-hover:border-blue-500/50 transition-colors shadow-inner">
                  <User size={20} className={isWasit ? 'text-yellow-400' : isPeserta ? 'text-emerald-400' : 'text-amber-400'} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-theme-textMain capitalize truncate group-hover:text-blue-400 transition-colors">
                    {role}
                  </span>
                  <span className="text-[10px] text-theme-textSub truncate">
                    Akun Pengguna
                  </span>
                </div>
              </Link>

              {/* Tombol Logout Compact di Ujung Kanan */}
              <button 
                onClick={handleLogout}
                title="Keluar dari Akun"
                className="p-2 text-theme-textSub hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-theme-bgBase relative">
        {/* Scrollable content inside Outlet */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode} 
      />
    </div>
  );
}
