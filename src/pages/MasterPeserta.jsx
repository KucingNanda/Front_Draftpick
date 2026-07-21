import { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import PesertaFormModal from '../components/organisms/PesertaFormModal';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function MasterPeserta() {
  const navigate = useNavigate();
  const { isWasit, isGuest } = useAuth();
  const api = useApi();
  const [pesertas, setPesertas] = useState([]);
  const [karakters, setKarakters] = useState([]); // Hanya 5-Star Limited
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formNama, setFormNama] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Format state: { "charId": isC1_boolean } -> { "1": true, "5": false }
  const [selectedChars, setSelectedChars] = useState({});

  const fetchData = async () => {
    try {
      const resP = await api(`${import.meta.env.VITE_API_BASE_URL}/api/peserta`);
      const dataP = await resP.json();
      setPesertas(dataP || []);

      const resK = await api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`);
      const dataK = await resK.json();
      // Hanya sediakan karakter Limited (Cost == 1)
      setKarakters((dataK || []).filter(k => k.cost === 1));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api]);
  const handleOpenModal = (peserta = null) => {
    if (peserta) {
      setEditingId(peserta.id);
      setFormNama(peserta.nama);
      let charsMap = {};
      if (peserta.karakters) {
        peserta.karakters.forEach(pk => {
          if (pk.karakter) {
             charsMap[pk.karakter.id] = pk.isC1;
          }
        });
      }
      setSelectedChars(charsMap);
    } else {
      setEditingId(null);
      setFormNama('');
      setSelectedChars({});
    }
    setSearchQuery(''); // Reset search when opening modal
    setIsModalOpen(true);
  };

  const handleToggleChar = (charId) => {
    setSelectedChars(prev => {
      const next = { ...prev };
      if (next[charId] !== undefined) {
        // Unselect
        delete next[charId];
      } else {
        // Select (Max 8)
        if (Object.keys(next).length >= 8) {
          Swal.fire({
            title: 'Batas Tercapai!',
            text: 'Hanya bisa memilih maksimal 8 karakter!',
            icon: 'warning',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#3b82f6'
          });
          return prev;
        }
        next[charId] = false; // Default bukan C1
      }
      return next;
    });
  };

  const handleToggleC1 = (e, charId) => {
    e.stopPropagation();
    setSelectedChars(prev => {
      const next = { ...prev };
      if (next[charId] !== undefined) {
        next[charId] = !next[charId];
      }
      return next;
    });
  };

  const handleClearChars = () => {
    setSelectedChars({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formNama.trim()) {
      Swal.fire('Oops!', 'Nama peserta tidak boleh kosong!', 'warning');
      return;
    }
    if (Object.keys(selectedChars).length !== 8) {
      Swal.fire('Belum Lengkap!', `Anda baru memilih ${Object.keys(selectedChars).length}/8 karakter. Harus pas 8!`, 'warning');
      return;
    }

    const payload = {
      nama: formNama,
      karakters: Object.entries(selectedChars).map(([kId, isC1]) => ({
        karakterId: parseInt(kId),
        isC1: isC1
      }))
    };

    try {
      const url = editingId ? `${import.meta.env.VITE_API_BASE_URL}/api/peserta/${editingId}` : `${import.meta.env.VITE_API_BASE_URL}/api/peserta`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await api(url, {
        method,
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const error = await res.json();
        Swal.fire('Gagal!', error.error || "Gagal menyimpan data", 'error');
        return;
      }
      
      setIsModalOpen(false);
      fetchData();
      Swal.fire({
        title: 'Berhasil!',
        text: 'Data peserta berhasil disimpan.',
        icon: 'success',
        background: '#1e293b',
        color: '#fff',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', 'Terjadi kesalahan jaringan', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Peserta?',
      text: "Semua data profil dan karakternya akan dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#1e293b',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api(`${import.meta.env.VITE_API_BASE_URL}/api/peserta/${id}`, { method: 'DELETE' });
          fetchData();
          Swal.fire({
            title: 'Terhapus!',
            text: 'Peserta berhasil dihapus.',
            icon: 'success',
            background: '#1e293b',
            color: '#fff',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  if (isGuest) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-theme-bgPanel p-8 rounded-2xl shadow-2xl w-full max-w-md border border-theme-border text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Akses Ditolak</h1>
          <p className="text-theme-textSub mb-6">Guest tidak diizinkan untuk melihat data peserta turnamen.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-theme-bgHover hover:bg-theme-border text-theme-textMain font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-theme-textMain mb-2">Data Peserta</h1>
          <p className="text-theme-textSub">Kelola peserta turnamen dan 8 karakter Limited andalan mereka.</p>
        </div>
        {isWasit && (
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
          >
            <UserPlus size={20} />
            Tambah Peserta
          </button>
        )}
      </div>

      {/* Grid Peserta */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {pesertas.map(peserta => (
          <div key={peserta.id} className="bg-theme-bgPanel rounded-xl overflow-hidden border border-theme-border shadow-xl flex flex-col">
            <div className="p-4 border-b border-theme-border bg-theme-bgBase flex justify-between items-center">
              <h2 className="text-xl font-bold text-theme-textMain truncate pr-4">{peserta.nama}</h2>
              {isWasit && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleOpenModal(peserta)} className="p-2 text-blue-400 hover:bg-blue-900/30 rounded transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(peserta.id)} className="p-2 text-red-400 hover:bg-red-900/30 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
            <div className="p-4 grid grid-cols-4 gap-2 bg-theme-bgPanel flex-1">
              {peserta.karakters && peserta.karakters.map((pk, idx) => (
                <div key={idx} className="aspect-square bg-theme-bgBase rounded-lg overflow-hidden relative border border-theme-border group">
                  {pk.karakter && pk.karakter.imageUrl ? (
                    <img src={pk.karakter.imageUrl} alt={pk.karakter.nama} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-theme-textSub text-center p-1">No Image</div>
                  )}
                  {/* Badge C1 */}
                  {pk.isC1 && (
                    <div className="absolute top-1 left-1 bg-yellow-600 text-white text-[9px] font-bold px-1 rounded shadow">
                      C1
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {pesertas.length === 0 && (
          <div className="col-span-full text-center py-12 text-theme-textSub bg-theme-bgPanel rounded-xl border border-dashed border-theme-border">
            Belum ada data peserta yang didaftarkan.
          </div>
        )}
      </div>

      {/* Modal Form Peserta */}
      <PesertaFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingId}
        formNama={formNama}
        setFormNama={setFormNama}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        karakters={karakters}
        selectedChars={selectedChars}
        handleToggleChar={handleToggleChar}
        handleToggleC1={handleToggleC1}
        handleClearChars={handleClearChars}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
