import { Link } from 'react-router-dom';
import { Swords, Users, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isGuest } = useAuth();
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Selamat Datang di Draft Pick</h1>
        <p className="text-lg text-gray-400">Pilih menu di bawah ini untuk memulai.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Draft Pick */}
        <Link 
          to="/draft"
          className="group block bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500 hover:bg-gray-750 transition-all shadow-lg"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-700 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <Swords size={48} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Mulai Draft Pick</h2>
            <p className="text-gray-400">
              Masuk ke arena untuk melakukan sesi Ban dan Pick karakter melawan tim lawan.
            </p>
          </div>
        </Link>

        {/* Card Master Karakter */}
        <Link 
          to="/karakter"
          className="group block bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500 hover:bg-gray-750 transition-all shadow-lg"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-700 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <Users size={48} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Master Karakter</h2>
            <p className="text-gray-400">
              Lihat, tambah, ubah, atau hapus daftar karakter yang tersedia dalam sistem.
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 justify-center">
        {/* Card Master Peserta */}
        {!isGuest && (
          <Link 
            to="/peserta"
            className="group block bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-gray-500 hover:bg-gray-750 transition-all shadow-lg md:col-span-2 max-w-xl mx-auto w-full"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gray-700 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform">
                <UserPlus size={48} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Master Peserta</h2>
              <p className="text-gray-400">
                Kelola data peserta turnamen dan lihat 8 karakter andalan mereka.
              </p>
            </div>
          </Link>
        )}
      </div>

        {/* Card Panel Wasit */}

    </div>
  );
}
