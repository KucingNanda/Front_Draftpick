import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Plus, X, Music, UploadCloud, Save } from 'lucide-react';
import { useApi } from '../../hooks/useApi';

export default function PlaylistManager({ token }) {
  const api = useApi();
  const [bgms, setBgms] = useState([]);
  const [isBgmModalOpen, setIsBgmModalOpen] = useState(false);
  const [newBgmName, setNewBgmName] = useState('');
  const [newBgmFile, setNewBgmFile] = useState(null);
  const [isUploadingBgm, setIsUploadingBgm] = useState(false);

  useEffect(() => {
    if (token) {
      api('http://localhost:3000/api/bgm')
        .then(res => res.json())
        .then(data => setBgms(data || []))
        .catch(err => console.error("Error fetching bgms:", err));
    }
  }, [token]);

  const handleUploadBgm = async (e) => {
    e.preventDefault();
    if (!newBgmName || !newBgmFile) {
      Swal.fire('Peringatan', 'Nama lagu dan file audio wajib diisi!', 'warning');
      return;
    }

    setIsUploadingBgm(true);
    const formData = new FormData();
    formData.append('audio', newBgmFile);

    try {
      const uploadRes = await api('http://localhost:3000/api/upload/audio', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload gagal');
      }

      const bgmRes = await api('http://localhost:3000/api/bgm', {
        method: 'POST',
        body: JSON.stringify({ nama: newBgmName, url: uploadData.audioUrl })
      });

      if (bgmRes.ok) {
        const newBgm = await bgmRes.json();
        setBgms([...bgms, newBgm]);
        Swal.fire({ title: 'Berhasil', text: 'Lagu ditambahkan ke Playlist', icon: 'success', background: '#1e293b', color: '#fff' });
        setIsBgmModalOpen(false);
        setNewBgmName('');
        setNewBgmFile(null);
      } else {
        throw new Error('Gagal menyimpan BGM ke database');
      }
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setIsUploadingBgm(false);
    }
  };

  const handleDeleteBgm = (id) => {
    Swal.fire({
      title: 'Hapus Lagu?',
      text: "Lagu ini akan dihapus dari Playlist.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, Hapus!',
      background: '#1e293b',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api(`http://localhost:3000/api/bgm/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setBgms(bgms.filter(b => b.id !== id));
            Swal.fire({ title: 'Terhapus!', icon: 'success', background: '#1e293b', color: '#fff', timer: 1500, showConfirmButton: false });
          }
        } catch (error) {
          Swal.fire('Error!', 'Koneksi terputus', 'error');
        }
      }
    });
  };

  return (
    <>
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-purple-400 mb-1">Playlist Manager (BGM)</h2>
            <p className="text-gray-400 text-sm">Kelola daftar lagu yang akan diputar otomatis di Arena Draft Pick.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsBgmModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-900/20 whitespace-nowrap"
          >
            <Plus size={18} /> Tambah Lagu
          </button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {bgms.length === 0 ? (
            <div className="text-center py-8 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
              <Music size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400">Belum ada lagu di Playlist.</p>
            </div>
          ) : (
            bgms.map((bgm, index) => (
              <div key={bgm.id} className="bg-gray-800 border border-purple-500/30 p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-purple-500/60 transition-colors">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-400 font-bold flex items-center justify-center shrink-0 border border-gray-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate" title={bgm.nama}>{bgm.nama}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <audio controls src={bgm.url} className="h-8 w-full sm:w-[200px]" />
                  <button
                    type="button"
                    onClick={() => handleDeleteBgm(bgm.id)}
                    className="text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-lg transition-colors"
                    title="Hapus Lagu"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Tambah BGM */}
      {isBgmModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Music size={20} className="text-purple-400" /> Tambah Lagu Playlist</h2>
              <button onClick={() => { setIsBgmModalOpen(false); setNewBgmFile(null); setNewBgmName(''); }} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUploadBgm} className="p-6 space-y-5">
              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">Nama Lagu (Judul)</label>
                <input 
                  type="text" 
                  value={newBgmName}
                  onChange={(e) => setNewBgmName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Misal: Epic Battle Phase 1"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2">File Audio</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 hover:border-purple-500 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="mb-2 text-sm text-gray-400 font-semibold">Klik untuk memilih file audio</p>
                      <p className="text-xs text-purple-400 truncate max-w-[250px]">{newBgmFile ? newBgmFile.name : 'Belum ada file'}</p>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewBgmFile(e.target.files[0]);
                          if (!newBgmName) {
                            const nameWithoutExt = e.target.files[0].name.split('.').slice(0, -1).join('.');
                            setNewBgmName(nameWithoutExt);
                          }
                        }
                      }}
                      required
                    />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUploadingBgm}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {isUploadingBgm ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={20} />}
                {isUploadingBgm ? 'Mengunggah...' : 'Simpan ke Playlist'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
