import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Settings, Save, ArrowLeft, Plus, X, Users } from 'lucide-react';
import CharacterSelectorModal from '../components/organisms/CharacterSelectorModal';
import PlaylistManager from '../components/organisms/PlaylistManager';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isWasit, token } = useAuth();
  const api = useApi();

  const [settings, setSettings] = useState({
    maxCost: 7,
    free4StarId: 0,
    free4StarHalf: 'all',
    bgmUrl: ''
  });
  
  const [karakters, setKarakters] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`)
      .then(res => res.json())
      .then(data => setKarakters(data || []))
      .catch(err => console.error("Error fetching karakter:", err));

    if (token) {
      api(`${import.meta.env.VITE_API_BASE_URL}/api/settings`)
        .then(res => res.json())
        .then(data => setSettings({
          maxCost: data.maxCost || 7,
          free4StarId: data.free4StarId || 0,
          free4StarHalf: data.free4StarHalf || 'all',
          bgmUrl: data.bgmUrl || ''
        }))
        .catch(err => console.error("Error fetching settings:", err));

      api(`${import.meta.env.VITE_API_BASE_URL}/api/users`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [token]);

  // Data Bintang 4 Saja
  const fourStarCharacters = karakters.filter(k => k.rarity === '4 Star');
  
  // Mencari Karakter Spesifik Terpilih
  const selectedKarakter = karakters.find(k => k.id === settings.free4StarId);
  
  // Filter Modal
  const filteredModalCharacters = fourStarCharacters.filter(k => 
    k.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi Handle Login dihapus, dipindah ke MainLayout (Navbar)

  const handleSaveSettings = async () => {
    const payload = {
      maxCost: parseInt(settings.maxCost),
      free4StarId: settings.free4StarId,
      free4StarHalf: settings.free4StarHalf,
      bgmUrl: settings.bgmUrl // Kept for legacy compatibility if needed
    };

    try {
      const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          title: 'Tersimpan!',
          text: 'Pengaturan Draft Pick berhasil diperbarui.',
          icon: 'success',
          background: '#1e293b',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan', 'error');
      }
    } catch (error) {
      Swal.fire('Error!', 'Koneksi terputus', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    handleSaveSettings();
  };


  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </button>

        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex items-center gap-3">
            <Settings className="text-yellow-500" size={28} />
            <h1 className="text-2xl font-bold">Pengaturan Turnamen</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            
            {/* Max Cost Setting */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold text-blue-400 mb-2">Max Cost Limit</h2>
              <p className="text-gray-400 text-sm mb-4">Ubah batas maksimal cost yang bisa digunakan setiap pemain dalam satu half.</p>
              <input 
                type="number"
                min="1"
                max="10"
                value={settings.maxCost}
                onChange={(e) => setSettings({...settings, maxCost: parseInt(e.target.value) || 7})}
                className="w-full md:w-32 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-xl text-center focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Free 4-Star Rule */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Special Condition: 1 Karakter Kebal</h2>
              <p className="text-gray-400 text-sm mb-4">
                Pilih SATU karakter Bintang 4 yang akan menjadi Kebal Ban dan Kebal Lock (Boleh Mirror Match). Jika kosong, aturan tidak berlaku.
              </p>
              
              <div className="flex items-center gap-4">
                <div 
                  onClick={() => setIsSelectorOpen(true)}
                  className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all overflow-hidden bg-gray-800 ${
                    selectedKarakter ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:scale-105' : 'border-dashed border-gray-600 hover:border-blue-400 hover:bg-gray-700'
                  }`}
                >
                  {selectedKarakter ? (
                    <img 
                      src={selectedKarakter.imageUrl} 
                      alt={selectedKarakter.nama}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Plus size={32} className="text-gray-500" />
                  )}
                </div>
                
                {selectedKarakter && (
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedKarakter.nama}</h3>
                    <p className="text-yellow-400 text-sm font-bold">Kondisi Spesial Aktif</p>
                    
                    <div className="mt-3">
                      <label className="block text-gray-400 text-xs mb-1">Target Babak:</label>
                      <select 
                        value={settings.free4StarHalf}
                        onChange={(e) => setSettings({...settings, free4StarHalf: e.target.value})}
                        className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2"
                      >
                        <option value="all">Semua Babak (First & Second)</option>
                        <option value="firstHalf">Hanya First Half</option>
                        <option value="secondHalf">Hanya Second Half</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSettings({...settings, free4StarId: 0, free4StarHalf: 'all'})}
                      className="mt-4 text-red-400 text-xs hover:text-red-300 flex items-center gap-1"
                    >
                      <X size={14} /> Hapus Karakter
                    </button>
                  </div>
                )}
              </div>
            </div>

            <PlaylistManager token={token} />

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-gray-700">
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>

          </form>
        </div>

        {/* Akun Peserta Container */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden mt-8">
          <div className="p-6 border-b border-gray-700 bg-gray-800/50 flex items-center gap-3">
            <Users className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold">Daftar Akun Peserta</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-900/50 text-gray-400 border-b border-gray-700">
                    <th className="p-4 font-medium">ID Akun</th>
                    <th className="p-4 font-medium">Username</th>
                    <th className="p-4 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500">Belum ada akun peserta terdaftar</td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700/20 transition-colors">
                        <td className="p-4 text-gray-400">#{u.id}</td>
                        <td className="p-4 font-bold text-white">{u.username}</td>
                        <td className="p-4">
                          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Pemilihan Karakter */}
      {isSelectorOpen && (
        <CharacterSelectorModal
          isAdmin={true}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredModalCharacters={filteredModalCharacters}
          onClose={() => setIsSelectorOpen(false)}
          onSelectCharacter={(char) => {
            setSettings({...settings, free4StarId: char.id});
            setIsSelectorOpen(false);
          }}
        />
      )}
    </div>
  );
}
