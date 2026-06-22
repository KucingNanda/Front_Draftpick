import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useApi } from '../hooks/useApi';

export default function Profil() {
  const { role, token, logout } = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      Swal.fire('Gagal', 'Konfirmasi password baru tidak cocok', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/change-password`, {
        method: 'PUT',
        body: JSON.stringify({
          old_password: passwords.oldPassword,
          new_password: passwords.newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Password berhasil diubah. Silakan login kembali dengan password baru.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          logout();
          navigate('/');
        });
      } else {
        Swal.fire('Gagal', data.error || 'Terjadi kesalahan', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Koneksi terputus', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </button>

        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex items-center gap-3">
            <User className="text-blue-500" size={28} />
            <h1 className="text-2xl font-bold">Profil Pengguna</h1>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Info Akun */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                <User size={32} className={role === 'wasit' ? 'text-yellow-400' : 'text-blue-400'} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status Akun</p>
                <h2 className="text-2xl font-bold text-white capitalize">{role}</h2>
              </div>
            </div>

            {/* Ganti Password */}
            <form onSubmit={handleSubmit} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="text-yellow-500" size={24} />
                <h2 className="text-xl font-bold text-white">Ganti Password</h2>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Password Lama</label>
                <input 
                  type="password"
                  required
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Masukkan password lama"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Password Baru</label>
                <input 
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Masukkan password baru"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Konfirmasi Password Baru</label>
                <input 
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ulangi password baru"
                />
              </div>

              <div className="pt-4 mt-4 border-t border-gray-700 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save size={20} />
                  )}
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
