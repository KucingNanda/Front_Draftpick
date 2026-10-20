import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, Eye, Trash2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import TeamPanel from '../components/organisms/TeamPanel';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useApi } from '../hooks/useApi';

export default function RiwayatPertandingan() {
  const { role, token, isWasit, isPeserta } = useAuth();
  const api = useApi();
  const [histories, setHistories] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistories = async () => {
    setIsLoading(true);
    try {
      const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/history?role=${role}`);
      if (res.ok) {
        const data = await res.json();
        setHistories(data || []);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && (isWasit || isPeserta)) {
      fetchHistories();
    }
  }, [token, role, api, isWasit, isPeserta]);
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Hapus Riwayat?',
      text: "Riwayat ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/history/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setHistories(histories.filter(h => h.id !== id));
            Swal.fire('Terhapus!', 'Riwayat berhasil dihapus.', 'success');
          }
        } catch (error) {
          Swal.fire('Error!', 'Gagal menghapus', 'error');
        }
      }
    });
  };

  const handleExportPDF = async () => {
    const target = document.getElementById('capture-history-arena');
    if (!target) return;

    Swal.fire({
      title: 'Memproses PDF...',
      didOpen: () => Swal.showLoading()
    });

    try {
      const canvas = await html2canvas(target, { useCORS: true, scale: 2, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Riwayat_DraftPick_${new Date().toISOString().slice(0,10)}.pdf`);
      Swal.fire('Berhasil!', 'PDF berhasil diunduh.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Gagal memproses gambar.', 'error');
    }
  };

  if (!isWasit && !isPeserta) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h1 className="text-xl text-theme-textSub">Anda tidak memiliki akses ke Riwayat.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto text-theme-textMain pb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-theme-border pb-4 pt-8 -mt-8 gap-4 sticky -top-8 z-40 bg-theme-bgBase">
        <div>
          <h1 className="text-3xl font-bold text-blue-400 flex items-center gap-3 mb-2">
            <Clock size={32} /> Riwayat Pertandingan
          </h1>
          <p className="text-theme-textSub">
            Anda dapat menyimpan hingga {isWasit ? '20' : '10'} riwayat. Jika penuh, riwayat terlama otomatis ditimpa.
          </p>
        </div>
        <div className="bg-theme-bgPanel px-4 py-2 rounded-lg border border-theme-border font-bold text-theme-textMain shrink-0">
          Tersimpan: <span className={histories.length >= (isWasit ? 20 : 10) ? 'text-red-400' : 'text-green-400'}>{histories.length}</span> / {isWasit ? 20 : 10}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-theme-textSub">Memuat riwayat...</div>
      ) : histories.length === 0 ? (
        <div className="text-center py-20 bg-theme-bgPanel rounded-xl border border-theme-border shadow-sm">
          <Clock size={48} className="mx-auto text-theme-textSub mb-4" />
          <h2 className="text-xl font-bold text-theme-textSub">Belum Ada Riwayat</h2>
          <p className="text-theme-textSub">Hasil pertandingan yang Anda simpan akan muncul di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {histories.map(h => {
            const date = new Date(h.updated_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
            return (
              <div key={h.id} className="bg-theme-bgPanel border border-theme-border rounded-xl p-5 shadow-lg hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs text-theme-textSub font-mono bg-theme-bgBase px-2 py-1 rounded">ID: {h.id}</div>
                  <div className="text-xs text-blue-400">{date}</div>
                </div>
                
                <div className="flex items-center justify-between my-6">
                  <div className="text-center flex-1 min-w-0">
                    <p className="font-bold text-blue-400 truncate px-2" title={h.playerA}>{h.playerA}</p>
                  </div>
                  <div className="font-black text-theme-textSub text-xl px-2 shrink-0">VS</div>
                  <div className="text-center flex-1 min-w-0">
                    <p className="font-bold text-red-400 truncate px-2" title={h.playerB}>{h.playerB}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-3 pt-4 border-t border-theme-border">
                  <button 
                    onClick={() => setSelectedHistory(h)}
                    className="flex-1 flex justify-center items-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-2 rounded-lg font-bold transition-all"
                  >
                    <Eye size={18} /> Lihat Hasil
                  </button>
                  <button 
                    onClick={() => handleDelete(h.id)}
                    className="flex justify-center items-center bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded-lg transition-all"
                    title="Hapus"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Preview Riwayat ala PDF Export */}
      {selectedHistory && (
        <div className="fixed inset-0 z-[100] bg-theme-bgBase flex flex-col overflow-auto">
          
          <div className="p-4 border-b border-theme-border flex justify-between items-center bg-theme-bgPanel sticky top-0 z-50">
            <h2 className="text-xl font-bold text-theme-textMain flex items-center gap-2 min-w-0">
              <Clock size={20} className="text-blue-400 shrink-0" /> 
              <span className="truncate">Riwayat: {selectedHistory.playerA} vs {selectedHistory.playerB}</span>
            </h2>
            <div className="flex gap-3">
              <button 
                onClick={handleExportPDF}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Unduh PDF
              </button>
              <button 
                onClick={() => setSelectedHistory(null)}
                className="bg-red-900/40 hover:bg-red-800/60 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                Tutup <X size={20} />
              </button>
            </div>
          </div>

          {/* Read-Only Arena */}
          <div className="flex-1 p-2 flex justify-center min-h-max overflow-x-auto custom-scrollbar">
            <div id="capture-history-arena" className="flex w-full min-w-[1100px] max-w-[1920px] min-h-[700px] relative rounded-2xl overflow-hidden border border-theme-border shadow-2xl bg-theme-bgBase">
              {/* Background Glows */}
              <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
              <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {/* Overlays untuk memblokir klik (Membuatnya Read-Only) */}
              <div className="absolute inset-0 z-50 cursor-default"></div>

              <div className="w-1/2 bg-theme-bgPanel border-r border-theme-border relative z-10 flex shrink-0">
                <TeamPanel 
                  playerKey="playerA" 
                  pesertaProfile={{ nama: selectedHistory.playerA }} 
                  pesertas={[]}
                  glowColor="bg-blue-500" 
                  draftState={JSON.parse(selectedHistory.draftData)}
                  settings={{ maxCost: 7, free4StarId: 0 }}
                  calculateCost={() => 0} // visual only
                  onSelectPeserta={() => {}}
                  onSlotClick={() => {}}
                  onRemoveCharacter={() => {}}
                  onToggleWeapon={() => {}}
                  isGuest={true} 
                  onNameChange={() => {}}
                />
              </div>
              <div className="w-1/2 bg-theme-bgPanel relative z-10 flex shrink-0">
                <TeamPanel 
                  playerKey="playerB" 
                  pesertaProfile={{ nama: selectedHistory.playerB }} 
                  pesertas={[]}
                  glowColor="bg-red-500" 
                  draftState={JSON.parse(selectedHistory.draftData)}
                  settings={{ maxCost: 7, free4StarId: 0 }}
                  calculateCost={() => 0} // visual only
                  onSelectPeserta={() => {}}
                  onSlotClick={() => {}}
                  onRemoveCharacter={() => {}}
                  onToggleWeapon={() => {}}
                  isGuest={true} 
                  onNameChange={() => {}}
                />
              </div>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
