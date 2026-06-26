import { useState, useEffect, useMemo } from 'react';
import { Plus, Image as ImageIcon, Search, Filter, LayoutGrid, List, Eye, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

import { RARITIES } from '../utils/constants';
import KarakterFormModal from '../components/organisms/KarakterFormModal';
import KarakterPreviewModal from '../components/organisms/KarakterPreviewModal';

export default function MasterKarakter() {
  const { isWasit } = useAuth();
  const api = useApi();
  const [karakters, setKarakters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Preview State (Modal KTP)
  const [previewKarakter, setPreviewKarakter] = useState(null);

  // File state
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    nama: '',
    vision: '',
    senjata: '',
    rarity: '',
    imageUrl: '',
    konstelasi: '',
    ulangTahun: '',
    region: 'Tidak Ada',
    sinergi: 'Tidak Ada'
  });

  const fetchKarakters = () => {
    setLoading(true);
    api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`)
      .then((res) => res.json())
      .then((data) => {
        setKarakters(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKarakters();
  }, []);

  const handleOpenModal = (karakter = null) => {
    if (karakter) {
      setFormData(karakter);
    } else {
      setFormData({
        id: null,
        nama: '',
        vision: '',
        senjata: '',
        rarity: '',
        imageUrl: '',
        konstelasi: '',
        ulangTahun: '',
        region: 'Tidak Ada',
        sinergi: 'Tidak Ada'
      });
    }
    setImageFile(null); // Reset file input
    setIsModalOpen(true);
    setPreviewKarakter(null); // Tutup modal preview jika sedang buka
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const saveKarakterData = (finalImageUrl) => {
    const payload = {
      nama: formData.nama,
      vision: formData.vision,
      senjata: formData.senjata,
      rarity: formData.rarity,
      imageUrl: finalImageUrl || formData.imageUrl,
      konstelasi: formData.konstelasi,
      ulangTahun: formData.ulangTahun,
      region: formData.region,
      sinergi: formData.sinergi
    };

    const url = formData.id 
      ? `${import.meta.env.VITE_API_BASE_URL}/api/karakter/${formData.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/api/karakter`;
    
    const method = formData.id ? 'PUT' : 'POST';

    api(url, {
      method: method,
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        fetchKarakters();
        handleCloseModal();
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error("Error saving data:", err);
        setIsSubmitting(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);

      try {
        const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: uploadData
        });
        const result = await res.json();
        
        if (res.ok) {
          saveKarakterData(result.imageUrl);
        } else {
          Swal.fire('Gagal!', "Gagal mengunggah gambar: " + result.error, 'error');
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Swal.fire('Gagal!', "Terjadi kesalahan saat mengunggah gambar.", 'error');
        setIsSubmitting(false);
      }
    } else {
      saveKarakterData(formData.imageUrl);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Karakter?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter/${id}`, { method: 'DELETE' })
          .then(() => {
            fetchKarakters();
            setPreviewKarakter(null);
            Swal.fire({
              title: 'Terhapus!',
              text: 'Karakter berhasil dihapus.',
              icon: 'success',
              background: '#1e293b',
              color: '#fff',
              timer: 1500,
              showConfirmButton: false
            });
          })
          .catch((err) => console.error("Error deleting data:", err));
      }
    });
  };

  // Logika Filter Data
  const filteredKarakters = useMemo(() => {
    return karakters.filter(k => {
      const matchSearch = k.nama.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRarity = filterRarity === '' || k.rarity === filterRarity;
      return matchSearch && matchRarity;
    });
  }, [karakters, searchQuery, filterRarity]);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-gray-700 pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Master Karakter</h1>
          <p className="text-gray-400">Daftar {karakters.length} karakter yang tersedia dalam database.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Kolom Pencarian */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari karakter..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            />
          </div>
          
          {/* Dropdown Filter Rarity */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="appearance-none bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm cursor-pointer"
            >
              <option value="">Semua Rarity</option>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
              title="Table View"
            >
              <List size={18} />
            </button>
          </div>

          {isWasit && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg hover:shadow-blue-500/30 text-sm"
            >
              <Plus size={18} />
              Tambah Karakter
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 animate-pulse text-lg">Memuat data dari server...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
          {filteredKarakters.map((karakter) => (
            <div
              key={karakter.id}
              onClick={() => setPreviewKarakter(karakter)}
              className={`aspect-square rounded-xl border-2 shadow-md hover:scale-105 cursor-pointer overflow-hidden transition-all flex flex-col relative group ${
                karakter.rarity.includes('5 Star') 
                  ? 'bg-gradient-to-b from-gray-800 to-yellow-900/40 border-yellow-600/50 hover:border-yellow-400' 
                  : 'bg-gradient-to-b from-gray-800 to-purple-900/40 border-purple-600/50 hover:border-purple-400'
              }`}
            >
              {karakter.imageUrl ? (
                <img 
                  src={karakter.imageUrl} 
                  alt={karakter.nama} 
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="flex flex-1 items-center justify-center w-full h-full text-gray-500 bg-gray-700">
                  <ImageIcon size={32} />
                </div>
              )}
              
              {/* Overlay Gradient Name */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-6 pb-2 px-2">
                <h2 className="text-xs font-bold text-white text-center truncate drop-shadow-md">
                  {karakter.nama}
                </h2>
              </div>
            </div>
          ))}

          {filteredKarakters.length === 0 && (
            <div className="col-span-full text-center py-16 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-400 text-lg mb-2">Tidak ada karakter yang ditemukan.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 border-b border-gray-700 text-sm">
                  <th className="p-4 font-medium w-16 text-center">ID</th>
                  <th className="p-4 font-medium w-24 text-center">Gambar</th>
                  <th className="p-4 font-medium">Nama Karakter</th>
                  <th className="p-4 font-medium">Vision</th>
                  <th className="p-4 font-medium">Senjata</th>
                  <th className="p-4 font-medium">Rarity</th>
                  <th className="p-4 font-medium text-center">Cost</th>
                  <th className="p-4 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredKarakters.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500 bg-gray-800/50 border border-dashed border-gray-700">
                      Tidak ada karakter yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredKarakters.map((karakter) => (
                    <tr key={karakter.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                      <td className="p-4 text-gray-400 text-center">#{karakter.id}</td>
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-900 border border-gray-700 overflow-hidden mx-auto flex items-center justify-center">
                          {karakter.imageUrl ? (
                            <img src={karakter.imageUrl} alt={karakter.nama} className="w-full h-full object-contain p-0.5" />
                          ) : (
                            <ImageIcon size={16} className="text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white">{karakter.nama}</td>
                      <td className="p-4 text-gray-300">{karakter.vision}</td>
                      <td className="p-4 text-gray-300">{karakter.senjata}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${karakter.rarity.includes('5 Star') ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                          {karakter.rarity}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-blue-400">{karakter.cost}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setPreviewKarakter(karakter)} className="p-1.5 text-blue-400 hover:bg-blue-900/30 rounded transition-colors" title="Lihat KTP">
                            <Eye size={16} />
                          </button>
                          {isWasit && (
                            <>
                              <button onClick={() => handleOpenModal(karakter)} className="p-1.5 text-yellow-400 hover:bg-yellow-900/30 rounded transition-colors" title="Edit">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => handleDelete(karakter.id)} className="p-1.5 text-red-400 hover:bg-red-900/30 rounded transition-colors" title="Hapus">
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW KTP */}
      <KarakterPreviewModal 
        previewKarakter={previewKarakter}
        setPreviewKarakter={setPreviewKarakter}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDelete}
      />

      {/* Modal Form Tambah/Edit */}
      <KarakterFormModal 
        isOpen={isModalOpen}
        formData={formData}
        setFormData={setFormData}
        imageFile={imageFile}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        handleCloseModal={handleCloseModal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
