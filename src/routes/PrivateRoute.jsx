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
        <div className="bg-theme-bgPanel p-8 rounded-2xl shadow-2xl w-full max-w-md border border-theme-border text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Akses Ditolak</h1>
          <p className="text-theme-textSub mb-6">Anda tidak memiliki hak akses untuk halaman ini.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-theme-bgHover hover:bg-theme-bgBase text-theme-textMain font-bold py-3 px-4 rounded-lg transition-colors"
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
