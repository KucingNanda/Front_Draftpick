import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, UserCheck, Swords, History, LogOut, Settings, User } from 'lucide-react';
import ThemeToggle from '../atoms/ThemeToggle';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, login, logout, isWasit, isPeserta, isGuest } = useAuth();
  const api = useApi();

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
    <div className="flex h-screen bg-slate-200 dark:bg-gray-900 text-slate-800 dark:text-gray-300 font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-100 dark:bg-gray-800 border-r border-slate-300 dark:border-gray-700 flex flex-col transition-colors duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-wider text-center">
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
            <div className="mt-3 text-center bg-gray-500/20 border border-gray-500/50 text-slate-600 dark:text-gray-400 text-xs font-bold py-1 px-3 rounded-full w-max mx-auto">
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
                  ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white font-medium'
                  : 'hover:bg-slate-200 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
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
        <header className="h-16 bg-slate-100 dark:bg-gray-800 border-b border-slate-300 dark:border-gray-700 flex items-center justify-between px-8 shadow-sm transition-colors duration-300">
          <div className="text-sm font-medium text-slate-500 dark:text-gray-400 capitalize flex items-center gap-2">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).replace('/', ' > ')}
          </div>
          
          <div className="flex items-center gap-4">
            {isGuest ? (
              <>
              <button 
                onClick={() => {
                  Swal.fire({
                    title: 'Login',
                    html: `
                      <input id="swal-input-username" class="swal2-input" placeholder="Username" autocomplete="off" style="width: 80%; background: #1e293b; color: white; border: 1px solid #475569;">
                      <div style="position: relative; width: 80%; margin: 1em auto 0;">
                        <input id="swal-input-password" type="password" class="swal2-input" placeholder="Password" autocomplete="off" style="width: 100%; background: #1e293b; color: white; border: 1px solid #475569; margin: 0; padding-right: 40px;">
                        <span id="toggle-password" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; user-select: none;">👁️</span>
                      </div>
                    `,
                    background: '#0f172a',
                    color: '#fff',
                    showCancelButton: true,
                    confirmButtonText: 'Login',
                    cancelButtonText: 'Batal',
                    confirmButtonColor: '#3b82f6',
                    focusConfirm: false,
                    didOpen: () => {
                      const user = document.getElementById('swal-input-username');
                      const pass = document.getElementById('swal-input-password');
                      const toggleBtn = document.getElementById('toggle-password');
                      user.focus();
                      
                      toggleBtn.addEventListener('click', () => {
                        const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
                        pass.setAttribute('type', type);
                        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
                      });

                      const enterListener = (e) => {
                        if (e.key === 'Enter') Swal.clickConfirm();
                      };
                      user.addEventListener('keypress', enterListener);
                      pass.addEventListener('keypress', enterListener);
                    },
                    preConfirm: () => {
                      const user = document.getElementById('swal-input-username').value;
                      const pass = document.getElementById('swal-input-password').value;
                      if (!user || !pass) {
                        Swal.showValidationMessage('Username dan Password wajib diisi');
                      }
                      return { username: user, password: pass };
                    }
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: 'Memeriksa...',
                        allowOutsideClick: false,
                        background: '#0f172a',
                        color: '#fff',
                        didOpen: () => Swal.showLoading()
                      });
                      try {
                        const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
                          method: 'POST',
                          body: JSON.stringify(result.value)
                        });
                        const data = await res.json();
                        if (res.ok) {
                          login(data.role, data.token);
                          Swal.fire({ title: 'Berhasil', text: data.message, icon: 'success', timer: 1500, showConfirmButton: false, background: '#1e293b', color: '#fff' });
                        } else {
                          Swal.fire('Gagal', data.error || 'Login gagal', 'error');
                        }
                      } catch (error) {
                        Swal.fire('Error', 'Koneksi terputus', 'error');
                      }
                    }
                  });
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <User size={16} /> Login
              </button>
              <button 
                onClick={() => {
                  Swal.fire({
                    title: 'Register Peserta',
                    html: `
                      <input id="swal-input-reg-username" class="swal2-input" placeholder="Username" autocomplete="off" style="width: 80%; background: #1e293b; color: white; border: 1px solid #475569;">
                      <div style="position: relative; width: 80%; margin: 1em auto 0;">
                        <input id="swal-input-reg-password" type="password" class="swal2-input" placeholder="Password" autocomplete="off" style="width: 100%; background: #1e293b; color: white; border: 1px solid #475569; margin: 0; padding-right: 40px;">
                        <span id="toggle-reg-password" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; user-select: none;">👁️</span>
                      </div>
                    `,
                    background: '#0f172a',
                    color: '#fff',
                    showCancelButton: true,
                    confirmButtonText: 'Daftar',
                    cancelButtonText: 'Batal',
                    confirmButtonColor: '#10b981',
                    focusConfirm: false,
                    didOpen: () => {
                      const user = document.getElementById('swal-input-reg-username');
                      const pass = document.getElementById('swal-input-reg-password');
                      const toggleBtn = document.getElementById('toggle-reg-password');
                      user.focus();
                      
                      toggleBtn.addEventListener('click', () => {
                        const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
                        pass.setAttribute('type', type);
                        toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
                      });

                      const enterListener = (e) => {
                        if (e.key === 'Enter') Swal.clickConfirm();
                      };
                      user.addEventListener('keypress', enterListener);
                      pass.addEventListener('keypress', enterListener);
                    },
                    preConfirm: () => {
                      const user = document.getElementById('swal-input-reg-username').value;
                      const pass = document.getElementById('swal-input-reg-password').value;
                      if (!user || !pass) {
                        Swal.showValidationMessage('Username dan Password wajib diisi');
                      }
                      return { username: user, password: pass, role: 'peserta' };
                    }
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: 'Mendaftarkan...',
                        allowOutsideClick: false,
                        background: '#0f172a',
                        color: '#fff',
                        didOpen: () => Swal.showLoading()
                      });
                      try {
                        const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
                          method: 'POST',
                          body: JSON.stringify(result.value)
                        });
                        const data = await res.json();
                        if (res.ok) {
                          Swal.fire({ title: 'Berhasil', text: 'Akun peserta berhasil dibuat! Silakan Login.', icon: 'success', background: '#1e293b', color: '#fff' });
                        } else {
                          Swal.fire('Gagal', data.error || 'Register gagal', 'error');
                        }
                      } catch (error) {
                        Swal.fire('Error', 'Koneksi terputus', 'error');
                      }
                    }
                  });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <UserCheck size={16} /> Register
              </button>
            </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600">
                    <User size={16} className={isWasit ? 'text-yellow-500 dark:text-yellow-400' : 'text-blue-500 dark:text-blue-400'} />
                  </div>
                  <span>Halo, <strong className="text-slate-800 dark:text-white capitalize">{role}</strong></span>
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
        <div className="flex-1 overflow-y-auto p-8 bg-slate-200 dark:bg-gray-900 transition-colors duration-300">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
