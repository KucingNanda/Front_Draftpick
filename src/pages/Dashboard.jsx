import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Users, UserPlus, Sparkles, Clock, Crown, Star, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { ELEMENS, REGIONS } from '../utils/constants';
import DraftRulesModal from '../components/organisms/DraftRulesModal';

export default function Dashboard() {
  const { isGuest } = useAuth();
  const api = useApi();
  
  const [karakters, setKarakters] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

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

  // Hitung karakter spesial (1 karakter)
  const specialKarakter = useMemo(() => {
    if (!settings || !settings.free4StarId || karakters.length === 0) return null;
    return karakters.find(k => k.id === settings.free4StarId);
  }, [karakters, settings]);

  // Hitung karakter terbaru (Ambil 4 karakter dengan ID terbesar)
  const newestKarakters = useMemo(() => {
    if (karakters.length === 0) return [];
    // Copy array dan urutkan berdasarkan ID descending
    const sorted = [...karakters].sort((a, b) => b.id - a.id);
    return sorted.slice(0, 4); // Ambil 4 teratas
  }, [karakters]);

  // Helper untuk mendapatkan icon elemen
  const getElemenIcon = (elemenName) => {
    const el = ELEMENS.find(e => e.name === elemenName);
    return el && el.icon ? el.icon : null;
  };

  // Helper untuk mendapatkan icon region
  const getRegionIcon = (regionName) => {
    const r = REGIONS.find(e => e.name === regionName);
    return r && r.icon ? r.icon : null;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* HEADER */}
      <div className="text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-4 pb-2 tracking-tight">
          Selamat Datang di Draft Pick
        </h1>
        <p className="text-lg text-gray-400 dark:text-slate-500 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          Mulai persaingan strategi tingkat tinggi, kelola daftar pahlawan Anda, dan pantau peserta turnamen.
        </p>
        <button 
          onClick={() => setIsRulesOpen(true)} 
          className="inline-flex items-center gap-2 bg-slate-300 dark:bg-gray-900/60 hover:bg-slate-100 dark:bg-gray-800 border border-blue-500/30 hover:border-blue-500/80 text-blue-400 px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-blue-500/20 backdrop-blur-md font-medium"
        >
          <ShieldAlert size={18} /> Baca Panduan & Aturan
        </button>
      </div>

      {/* SPOTLIGHT SECTION (DI ATAS) */}
      <div className="mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-500"></div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
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
              <span className="text-gray-400 dark:text-slate-500 dark:text-gray-400">Memuat Info Karakter...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Karakter Spesial Card (Large Vertical Card) */}
            <div className="lg:col-span-1">
              {specialKarakter ? (
                <div className="bg-gradient-to-b from-slate-100 dark:from-gray-800 via-slate-100 dark:via-gray-800 to-yellow-900/30 rounded-3xl border border-yellow-500/30 p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-[50px] rounded-full group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                  
                  {/* Label dipindah ke dalam bounds agar tidak terpotong (top-0 left-0) */}
                  <div className="absolute top-0 left-0 bg-yellow-500 text-yellow-950 text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-br-2xl flex items-center gap-1 shadow-lg z-20">
                    <Crown size={14} /> Karakter Spesial
                  </div>
                  
                  <div className="w-48 h-48 mt-6 shrink-0 bg-gradient-to-br from-slate-200 dark:from-gray-900 to-slate-100 dark:to-gray-800 rounded-2xl border-2 border-yellow-500/50 p-2 relative shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    {specialKarakter.imageUrl && (
                      <img src={specialKarakter.imageUrl} alt={specialKarakter.nama} className="w-full h-full object-contain drop-shadow-2xl z-10 relative" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/50 to-transparent z-0"></div>
                  </div>

                  <div className="mt-6 z-10 relative w-full">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight truncate">{specialKarakter.nama}</h3>
                      {getElemenIcon(specialKarakter.elemen) && (
                        <img src={getElemenIcon(specialKarakter.elemen)} alt={specialKarakter.elemen} className="w-6 h-6 drop-shadow-md" />
                      )}
                    </div>
                    
                    <p className="text-yellow-400 font-medium mb-4 flex items-center justify-center gap-1">
                      <Star size={16} fill="currentColor" /> {specialKarakter.rarity}
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      <span className="text-xs bg-slate-300 dark:bg-gray-900/60 border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm">
                        {specialKarakter.senjata}
                      </span>
                      <span className="text-xs bg-slate-300 dark:bg-gray-900/60 border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                        {getRegionIcon(specialKarakter.region) && (
                          <img src={getRegionIcon(specialKarakter.region)} alt={specialKarakter.region} className="w-4 h-4 opacity-90" />
                        )}
                        {specialKarakter.region}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-gray-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <Crown className="text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400">Belum ada Karakter Spesial yang ditentukan.</p>
                </div>
              )}
            </div>

            {/* Karakter Terbaru (Grid 2x2 of Mini Cards) */}
            <div className="lg:col-span-2 flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 px-2">
                <Clock className="text-blue-400" size={20} /> Baru Rilis (Patch Terkini)
              </h3>
              
              {newestKarakters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  {newestKarakters.map((k, index) => (
                    <div key={k.id} className="bg-gradient-to-r from-slate-100 dark:from-gray-800 to-blue-900/10 rounded-2xl border border-blue-500/20 p-4 flex items-center gap-4 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden relative shadow-lg">
                      {/* Label Baru */}
                      {index === 0 && (
                         <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg shadow-md z-20 tracking-wider">
                           Terbaru
                         </div>
                      )}

                      <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-slate-200 dark:from-gray-900 to-slate-100 dark:to-gray-800 rounded-xl border border-blue-500/30 p-1 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                        {k.imageUrl && (
                          <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain drop-shadow-md" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 z-10">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-bold text-slate-800 dark:text-white truncate">{k.nama}</h4>
                          {getElemenIcon(k.elemen) && (
                            <img src={getElemenIcon(k.elemen)} alt={k.elemen} className="w-4 h-4 shrink-0 drop-shadow-sm" />
                          )}
                        </div>
                        <p className="text-blue-400 text-xs font-medium truncate mb-2">
                          {k.rarity}
                        </p>
                        <span className="text-[10px] bg-slate-300 dark:bg-gray-900/60 border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 px-2 py-0.5 rounded-full inline-block">
                          {k.senjata}
                        </span>
                        <span className="text-[10px] bg-slate-300 dark:bg-gray-900/60 border border-slate-300 dark:border-gray-700 text-slate-600 dark:text-gray-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1 ml-1">
                          {getRegionIcon(k.region) && (
                            <img src={getRegionIcon(k.region)} alt={k.region} className="w-3 h-3 opacity-90" />
                          )}
                          {k.region}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-100 dark:bg-gray-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-center flex-1">
                  <Clock className="text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400">Belum ada karakter di database.</p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* BENTO GRID MENU (DI BAWAH) */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-600"></div>
          <h2 className="text-xl font-semibold text-slate-600 dark:text-gray-300 uppercase tracking-widest">
            Menu Utama
          </h2>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Card Draft Pick */}
          <Link 
            to="/draft"
            className="group block bg-slate-100 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-300 dark:border-gray-700/50 hover:border-blue-500/50 hover:bg-slate-100 dark:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-blue-900/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/20 p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                <Swords size={42} className="text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-blue-300 transition-colors">Mulai Draft Pick</h2>
              <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400 leading-relaxed">
                Masuk ke arena untuk melakukan sesi Ban dan Pick karakter melawan tim lawan dengan UI interaktif.
              </p>
            </div>
          </Link>

          {/* Card Master Karakter */}
          <Link 
            to="/karakter"
            className="group block bg-slate-100 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-300 dark:border-gray-700/50 hover:border-purple-500/50 hover:bg-slate-100 dark:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-purple-900/20"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/20 p-5 rounded-2xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-inner">
                <Users size={42} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-purple-300 transition-colors">Master Karakter</h2>
              <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400 leading-relaxed">
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
              className="group block bg-slate-100 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-300 dark:border-gray-700/50 hover:border-emerald-500/50 hover:bg-slate-100 dark:bg-gray-800 transition-all duration-300 shadow-xl hover:shadow-emerald-900/20 md:col-span-2 max-w-2xl mx-auto w-full"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/20 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <UserPlus size={42} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-emerald-300 transition-colors">Master Peserta</h2>
                <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400 leading-relaxed">
                  Kelola data peserta turnamen dan lihat 8 karakter andalan pilihan mereka untuk persaingan sengit.
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      <DraftRulesModal 
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
