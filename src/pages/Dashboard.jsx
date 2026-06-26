import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Users, UserPlus, Sparkles, Clock, Crown, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { ELEMENS, SENJATAS } from '../utils/constants';

export default function Dashboard() {
  const { isGuest } = useAuth();
  const api = useApi();
  
  const [karakters, setKarakters] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resKarakter, resSettings] = await Promise.all([
          api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`),
          api(`${import.meta.env.VITE_API_BASE_URL}/api/settings`)
        ]);
        
        const dataKarakter = await resKarakter.json();
        const dataSettings = await resSettings.json();
        
        setKarakters(dataKarakter || []);
        setSettings(dataSettings);
      } catch (err) {
        console.error("Gagal mengambil data untuk dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Hitung karakter spesial dan karakter terbaru
  const specialKarakter = useMemo(() => {
    if (!settings || !settings.free4StarId || karakters.length === 0) return null;
    return karakters.find(k => k.id === settings.free4StarId);
  }, [karakters, settings]);

  const newestKarakter = useMemo(() => {
    if (karakters.length === 0) return null;
    // Cari ID terbesar
    return karakters.reduce((max, current) => (max.id > current.id ? max : current), karakters[0]);
  }, [karakters]);

  // Helper untuk mendapatkan icon elemen
  const getElemenIcon = (elemenName) => {
    const el = ELEMENS.find(e => e.name === elemenName);
    return el && el.icon ? el.icon : null;
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-4 tracking-tight">
          Selamat Datang di Draft Pick
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Mulai persaingan strategi tingkat tinggi, kelola daftar pahlawan Anda, dan pantau peserta turnamen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Card Draft Pick */}
        <Link 
          to="/draft"
          className="group block bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-blue-900/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/20 p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
              <Swords size={42} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">Mulai Draft Pick</h2>
            <p className="text-gray-400 leading-relaxed">
              Masuk ke arena untuk melakukan sesi Ban dan Pick karakter melawan tim lawan dengan UI interaktif.
            </p>
          </div>
        </Link>

        {/* Card Master Karakter */}
        <Link 
          to="/karakter"
          className="group block bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-purple-900/20"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/20 p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
              <Users size={42} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">Master Karakter</h2>
            <p className="text-gray-400 leading-relaxed">
              Lihat, tambah, ubah, atau hapus daftar karakter yang tersedia dalam database sistem secara *real-time*.
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 justify-center relative z-10">
        {/* Card Master Peserta */}
        {!isGuest && (
          <Link 
            to="/peserta"
            className="group block bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-emerald-500/50 hover:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-emerald-900/20 md:col-span-2 max-w-2xl mx-auto w-full"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/20 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <UserPlus size={42} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">Master Peserta</h2>
              <p className="text-gray-400 leading-relaxed">
                Kelola data peserta turnamen dan lihat 8 karakter andalan pilihan mereka untuk persaingan sengit.
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Info Spotlight Section */}
      <div className="mt-20 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-500"></div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={24} />
            Spotlight Karakter
            <Sparkles className="text-yellow-400" size={24} />
          </h2>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-500"></div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse flex space-x-4 items-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-400">Memuat Info Karakter...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Karakter Spesial Card */}
            {specialKarakter ? (
              <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-yellow-900/30 rounded-3xl border border-yellow-500/30 p-6 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                <div className="absolute -top-3 -left-3 bg-yellow-500 text-yellow-950 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-br-2xl flex items-center gap-1 shadow-lg z-10">
                  <Crown size={14} /> Karakter Spesial (Free)
                </div>
                
                <div className="w-32 h-32 shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-yellow-500/50 p-2 relative shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {specialKarakter.imageUrl && (
                    <img src={specialKarakter.imageUrl} alt={specialKarakter.nama} className="w-full h-full object-contain drop-shadow-2xl z-10 relative" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/50 to-transparent z-0"></div>
                </div>

                <div className="flex-1 z-10 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{specialKarakter.nama}</h3>
                    {getElemenIcon(specialKarakter.elemen) && (
                      <img src={getElemenIcon(specialKarakter.elemen)} alt={specialKarakter.elemen} className="w-6 h-6 drop-shadow-md" />
                    )}
                  </div>
                  
                  <p className="text-yellow-400 text-sm font-medium mb-3 flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {specialKarakter.rarity}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-900/60 border border-gray-700 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
                      {specialKarakter.senjata}
                    </span>
                    <span className="text-xs bg-gray-900/60 border border-gray-700 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
                      {specialKarakter.region}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-3xl border border-dashed border-gray-700 p-8 flex flex-col items-center justify-center text-center">
                <Crown className="text-gray-600 mb-3" size={32} />
                <p className="text-gray-400">Belum ada Karakter Spesial yang ditentukan.</p>
              </div>
            )}

            {/* Karakter Terbaru Card */}
            {newestKarakter ? (
              <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-blue-900/30 rounded-3xl border border-blue-500/30 p-6 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
                <div className="absolute -top-3 -left-3 bg-blue-500 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-br-2xl flex items-center gap-1 shadow-lg z-10">
                  <Clock size={14} /> Karakter Baru Rilis
                </div>
                
                <div className="w-32 h-32 shrink-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-2 border-blue-500/50 p-2 relative shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {newestKarakter.imageUrl && (
                    <img src={newestKarakter.imageUrl} alt={newestKarakter.nama} className="w-full h-full object-contain drop-shadow-2xl z-10 relative" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent z-0"></div>
                </div>

                <div className="flex-1 z-10 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{newestKarakter.nama}</h3>
                    {getElemenIcon(newestKarakter.elemen) && (
                      <img src={getElemenIcon(newestKarakter.elemen)} alt={newestKarakter.elemen} className="w-6 h-6 drop-shadow-md" />
                    )}
                  </div>
                  
                  <p className="text-blue-400 text-sm font-medium mb-3">
                    {newestKarakter.rarity}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-900/60 border border-gray-700 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
                      {newestKarakter.senjata}
                    </span>
                    <span className="text-xs bg-gray-900/60 border border-gray-700 text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
                      {newestKarakter.region}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-3xl border border-dashed border-gray-700 p-8 flex flex-col items-center justify-center text-center">
                <Clock className="text-gray-600 mb-3" size={32} />
                <p className="text-gray-400">Belum ada karakter di database.</p>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
