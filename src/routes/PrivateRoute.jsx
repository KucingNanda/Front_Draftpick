import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ allowedRoles = [] }) {
  const { isGuest, role } = useAuth();
  const navigate = useNavigate();

  // Jika belum login sama sekali
  if (isGuest) {
    return <Navigate to="/" replace />;
  }

  // Jika route meminta role spesifik, tapi user tidak memiliki role tersebut
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-slate-100 dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-300 dark:border-gray-700 text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Akses Ditolak</h1>
          <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400 mb-6">Anda tidak memiliki hak akses untuk halaman ini.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 text-slate-800 dark:text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // Jika lolos semua penjagaan, render halaman tujuan
  return <Outlet />;
}
