import { Play, Pause, Volume2, VolumeX, SkipForward, Download, X, Save, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';

export default function ArenaHeader({
  currentBgm,
  bgms,
  isPlaying,
  togglePlay,
  handleNextTrack,
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  draftState,
  isDraftComplete,
  exportToPDF,
  handleExit,
  playerA,
  playerB,
  onOpenRules
}) {
  const { isGuest, role } = useAuth();
  const api = useApi();

  const handleSaveOptions = () => {
    if (isGuest) {
      exportToPDF('capture-arena');
      return;
    }

    Swal.fire({
      title: 'Pilih Opsi Penyimpanan',
      text: 'Riwayat akan tersimpan ke database. Anda juga bisa langsung mengunduh gambar hasilnya.',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Simpan & Unduh PDF',
      denyButtonText: 'Simpan Saja',
      cancelButtonText: 'Batal',
      background: '#1e293b',
      color: '#fff',
      confirmButtonColor: '#10b981',
      denyButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await saveToDatabase();
        exportToPDF('capture-arena');
      } else if (result.isDenied) {
        await saveToDatabase();
      }
    });
  };

  const saveToDatabase = async () => {
    Swal.fire({
      title: 'Menyimpan...',
      allowOutsideClick: false,
      background: '#1e293b',
      color: '#fff',
      didOpen: () => Swal.showLoading()
    });

    try {
      const payload = {
        role: role,
        playerA: playerA?.nama || 'Player A',
        playerB: playerB?.nama || 'Player B',
        draftData: JSON.stringify(draftState)
      };

      const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/history`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Gagal menyimpan riwayat');
      
      Swal.fire({
        icon: 'success',
        title: 'Tersimpan!',
        text: 'Riwayat pertandingan berhasil disimpan.',
        background: '#1e293b',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  return (
    <header className="h-16 bg-slate-300 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-300 dark:border-gray-800 flex justify-between items-center px-8 shrink-0 relative z-10 shadow-lg">
      <div className="flex-1 flex items-center gap-3">
        {currentBgm && (
          <div className="bg-slate-100 dark:bg-gray-800/80 p-2 px-3 rounded-lg flex items-center gap-4 border border-slate-300 dark:border-gray-700 shadow-inner">
            <div className="flex items-center gap-1">
              <button onClick={togglePlay} className="text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:text-white transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-600 p-1.5 rounded-full" title="Play/Pause">
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
              {bgms.length > 1 && (
                <button onClick={handleNextTrack} className="text-gray-400 dark:text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:text-white transition-colors p-1.5 rounded-full hover:bg-gray-200 dark:bg-gray-700" title="Next Track">
                  <SkipForward size={14} />
                </button>
              )}
            </div>
            <div className="flex flex-col w-[120px] md:w-[150px] relative overflow-hidden group">
              <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-0.5 leading-none bg-transparent relative z-10">Now Playing</span>
              <div className="w-full overflow-hidden relative">
                <span 
                  className={`text-xs text-slate-800 dark:text-white leading-none whitespace-nowrap ${currentBgm.nama.length > 20 ? 'animate-scroll-text group-hover:[animation-play-state:paused]' : 'truncate block'}`} 
                  title={currentBgm.nama}
                >
                  {currentBgm.nama.length > 20 ? `${currentBgm.nama} \u00A0\u00A0\u00A0\u00A0\u00A0 ${currentBgm.nama}` : currentBgm.nama}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-300 dark:border-gray-600 pl-3">
              <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 dark:text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input 
                type="range" 
                min="0" max="1" step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 md:w-20 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1 shrink-0">
        <span className={`font-bold tracking-widest uppercase text-sm md:text-base animate-pulse ${draftState.phase === 'REGISTRATION' ? 'text-yellow-400' : 'text-blue-400'}`}>
          {draftState.phase === 'REGISTRATION' ? 'Fase Persiapan' : 'Fase Draft Pick'}
        </span>
        <span className="text-gray-400 dark:text-slate-500 dark:text-gray-400 text-xs md:text-sm">
          {draftState.phase === 'REGISTRATION' 
            ? 'Silakan Pilih Peserta dari Dropdown' 
            : 'Pilih & Larang Karakter Secara Bergantian'}
        </span>
      </div>
      
      <div className="flex-1 flex justify-end gap-3">
        {/* Tombol Aturan */}
        <button 
          onClick={onOpenRules}
          className="flex items-center justify-center p-2 bg-blue-900/40 hover:bg-blue-800/60 text-blue-400 rounded-lg transition-colors border border-blue-900/50"
          title="Aturan Main"
        >
          <ShieldAlert size={20} />
        </button>

        {/* Opsi Simpan Ganda (Jika Selesai) */}
        {isDraftComplete && (
          <button 
            onClick={handleSaveOptions}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-400 font-semibold rounded-lg transition-colors border border-emerald-900/50"
          >
            {isGuest ? <Download size={20} /> : <Save size={20} />}
            {isGuest ? 'Unduh Hasil' : 'Simpan Hasil'}
          </button>
        )}
        <button 
          onClick={handleExit}
          className="flex items-center gap-2 px-5 py-2 bg-red-900/40 hover:bg-red-800/60 text-red-400 font-semibold rounded-lg transition-colors border border-red-900/50"
        >
          <X size={20} />
          Keluar
        </button>
      </div>
    </header>
  );
}
