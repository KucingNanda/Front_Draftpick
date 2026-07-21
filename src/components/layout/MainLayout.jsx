import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, UserCheck, Swords, History, LogOut, Settings, User } from 'lucide-react';
import ThemeToggle from '../atoms/ThemeToggle';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import AuthModal from '../organisms/AuthModal';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, login, logout, isWasit, isPeserta, isGuest } = useAuth();
  const api = useApi();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} />, show: true },
    { name: 'Draft Pick', path: '/draft', icon: <Swords size={20} />, show: true },
    { name: 'Karakter', path: '/karakter', icon: <Users size={20} />, show: true },
    { name: 'Data Peserta', path: '/peserta', icon: <UserCheck size={20} />, show: !isGuest },
    { name: 'Riwayat Match', path: '/history', icon: <History size={20} />, show: true },
    { name: 'Profil', path: '/profil', icon: <User size={20} />, show: !isGuest },
    { name: 'Panel Wasit', path: '/admin', icon: <Settings size={20} />, show: isWasit },
  ];

  return (
    <div className="flex h-screen bg-theme-bgBase text-theme-textMain font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-theme-bgPanel border-r border-theme-border flex flex-col transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-theme-textMain tracking-wider text-center">
            DRAFT PICK
          </h1>
          {isWasit && (
            <div className="mt-3 text-center bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold py-1 px-3 rounded-full w-max mx-auto shadow-[0_0_10px_rgba(234,179,8,0.2)]">
              🛡️ WASIT AKTIF
            </div>
          )}
          {isPeserta && (
            <div className="mt-3 text-center bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-bold py-1 px-3 rounded-full w-max mx-auto shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              🎮 PESERTA AKTIF
            </div>
          )}
          {isGuest && (
            <div className="mt-3 text-center bg-gray-500/20 border border-gray-500/50 text-theme-textSub text-xs font-bold py-1 px-3 rounded-full w-max mx-auto">
              👁️ GUEST MODE
            </div>
          )}
          <div className="mt-6">
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
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
      </aside>

        {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header & Navbar Login */}
        <header className="h-16 bg-theme-bgPanel border-b border-theme-border flex items-center justify-between px-8 shadow-sm transition-colors duration-300">
          <div className="text-sm font-medium text-theme-textSub capitalize flex items-center gap-2">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).replace('/', ' > ')}
          </div>
          
          <div className="flex items-center gap-4">
            {isGuest ? (
              <>
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <User size={16} /> Login
              </button>
              <button 
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <UserCheck size={16} /> Register
              </button>
            </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-theme-textSub">
                  <div className="w-8 h-8 rounded-full bg-theme-bgHover flex items-center justify-center border border-theme-border">
                    <User size={16} className={isWasit ? 'text-yellow-500 dark:text-yellow-400' : 'text-blue-500 dark:text-blue-400'} />
                  </div>
                  <span>Halo, <strong className="text-theme-textMain capitalize">{role}</strong></span>
                </div>
                <button 
                  onClick={() => {
                    Swal.fire({
                      title: 'Logout?',
                      text: 'Anda akan kembali menjadi Guest.',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: '#ef4444',
                      background: '#1e293b',
                      color: '#fff'
                    }).then((result) => {
                      if (result.isConfirmed) {
                        logout();
                        navigate('/');
                      }
                    });
                  }}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable content inside Outlet */}
        <div className="flex-1 overflow-y-auto p-8 bg-theme-bgBase transition-colors duration-300 relative">
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
