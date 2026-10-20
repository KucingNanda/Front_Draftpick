import { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2, UserCheck, Shield, ArrowUpRight, ArrowDownLeft, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('peserta'); // 'peserta' | 'member'
  const [karakters, setKarakters] = useState([]); // Hanya 5-Star Limited
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formNama, setFormNama] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  // Format state: { "charId": isC1_boolean } -> { "1": true, "5": false }
  const [selectedChars, setSelectedChars] = useState({});

  const fetchData = async () => {
    if (isGuest) return;
    try {
      const resP = await api(`${import.meta.env.VITE_API_BASE_URL}/api/peserta`);
      const dataP = await resP.json();
      setPesertas(dataP || []);

      const resK = await api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`);
      const dataK = await resK.json();
      setKarakters((dataK || []).filter(k => k.cost === 1));

      if (isWasit) {
        const resU = await api(`${import.meta.env.VITE_API_BASE_URL}/api/users?role=member`);
        if (resU.ok) {
          const dataU = await resU.json();
          setMembers(dataU || []);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isGuest) {
      fetchData();
    }
  }, [api, isWasit, isGuest]);


  const handlePromoteToPeserta = (user) => {
    if (!user.peserta || !user.peserta.karakters || user.peserta.karakters.length !== 8) {
      Swal.fire({
        title: 'Formasi Belum Lengkap',
        text: `Member ini baru memilih ${user.peserta?.karakters?.length || 0}/8 karakter. Tunggu sampai lengkap 8 karakter sebelum dipromosikan!`,
        icon: 'warning',
        background: 'var(--theme-bg-panel)',
        color: 'var(--theme-text-main)',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    Swal.fire({
      title: 'Promosikan ke Peserta?',
      text: `Akun "${user.username}" (${user.peserta.nama}) akan resmi menjadi Peserta Turnamen dan masuk ke Arena Draft Pick.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Promosikan!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#475569',
      background: 'var(--theme-bg-panel)',
      color: 'var(--theme-text-main)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/users/${user.id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: 'peserta' })
          });
          if (res.ok) {
            Swal.fire({
              title: 'Berhasil!',
              text: `Akun ${user.username} kini resmi menjadi Peserta Turnamen.`,
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              background: 'var(--theme-bg-panel)',
              color: 'var(--theme-text-main)'
            });
            fetchData();
          } else {
            Swal.fire('Gagal', 'Terjadi kesalahan saat mempromosikan', 'error');
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const handleDemoteToMember = (peserta) => {
    if (!peserta.userId) return;

    Swal.fire({
      title: 'Turunkan ke Member?',
      text: `Peserta "${peserta.nama}" akan diturunkan statusnya menjadi Member dan tidak akan muncul di Arena Turnamen.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Turunkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#475569',
      background: 'var(--theme-bg-panel)',
      color: 'var(--theme-text-main)'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/users/${peserta.userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role: 'member' })
          });
          if (res.ok) {
            Swal.fire({
              title: 'Berhasil',
              text: 'Status peserta berhasil diubah menjadi Member.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              background: 'var(--theme-bg-panel)',
              color: 'var(--theme-text-main)'
            });
            fetchData();
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  };


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
    <div className="max-w-7xl mx-auto pb-4">
      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-theme-border pb-4 pt-8 -mt-8 gap-4 sticky -top-8 z-40 bg-theme-bgBase">
        <div>
          <h1 className="text-3xl font-bold text-theme-textMain mb-2">Data Peserta</h1>
          <p className="text-theme-textSub">Kelola peserta resmi turnamen dan verifikasi pendaftar baru.</p>
        </div>

        <div className="flex items-center gap-3">
          {isWasit && (
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
            >
              <UserPlus size={20} />
              Tambah Manual
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher (Khusus Wasit) */}
      {isWasit && (
        <div className="flex gap-2 mb-6 border-b border-theme-border pb-2">
          <button
            onClick={() => setActiveTab('peserta')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'peserta'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                : 'text-theme-textSub hover:bg-theme-bgHover hover:text-theme-textMain'
            }`}
          >
            <UserCheck size={18} />
            Peserta Turnamen ({pesertas.length})
          </button>

          <button
            onClick={() => setActiveTab('member')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${
              activeTab === 'member'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20'
                : 'text-theme-textSub hover:bg-theme-bgHover hover:text-theme-textMain'
            }`}
          >
            <Shield size={18} />
            Pendaftar Member ({members.length})
            {members.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                {members.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* KONTEN TAB 1: PESERTA RESMI TURNAMEN */}
      {activeTab === 'peserta' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pesertas.map(peserta => (
            <div key={peserta.id} className="bg-theme-bgPanel rounded-xl overflow-hidden border border-theme-border shadow-xl flex flex-col">
              <div className="p-4 border-b border-theme-border bg-theme-bgBase flex justify-between items-center">
                <div className="min-w-0 pr-2">
                  <h2 className="text-xl font-bold text-theme-textMain truncate">{peserta.nama}</h2>
                  {peserta.userId && (
                    <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block mt-0.5">
                      Akun Member Terverifikasi
                    </span>
                  )}
                </div>
                {isWasit && (
                  <div className="flex gap-1.5 shrink-0">
                    {peserta.userId && (
                      <button 
                        onClick={() => handleDemoteToMember(peserta)} 
                        title="Turunkan ke Member (Nonaktifkan dari turnamen)"
                        className="p-2 text-amber-400 hover:bg-amber-900/30 rounded transition-colors"
                      >
                        <ArrowDownLeft size={18} />
                      </button>
                    )}
                    <button onClick={() => handleOpenModal(peserta)} title="Edit Peserta" className="p-2 text-blue-400 hover:bg-blue-900/30 rounded transition-colors">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(peserta.id)} title="Hapus Peserta" className="p-2 text-red-400 hover:bg-red-900/30 rounded transition-colors">
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
              Belum ada data peserta yang terdaftar resmi.
            </div>
          )}
        </div>
      )}

      {/* KONTEN TAB 2: VERIFIKASI PENDAFTAR MEMBER (KHUSUS WASIT) */}
      {activeTab === 'member' && isWasit && (
        <div className="space-y-4">
          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> Verifikasi Calon Peserta
            </h3>
            <p className="text-theme-textSub text-xs mt-1">
              Di bawah ini adalah daftar pengguna yang mendaftar akun dengan role <strong>Member</strong>. Wasit dapat memeriksa formasi 8 karakter mereka dan menekan tombol <strong>Promosikan ke Peserta</strong> agar masuk ke daftar peserta turnamen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map(memberUser => {
              const hasPeserta = !!memberUser.peserta;
              const charCount = memberUser.peserta?.karakters?.length || 0;
              const isReady = hasPeserta && charCount === 8;

              return (
                <div key={memberUser.id} className="bg-theme-bgPanel rounded-xl border border-theme-border p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3 border-b border-theme-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-theme-textMain text-lg">@{memberUser.username}</h3>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            Member
                          </span>
                        </div>
                        <p className="text-xs text-theme-textSub mt-0.5">
                          Nama In-Game: <strong className="text-theme-textMain">{memberUser.peserta?.nama || '(Belum mengisi)'}</strong>
                        </p>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        isReady 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {charCount} / 8 Karakter
                      </span>
                    </div>

                    {/* Preview 8 Karakter */}
                    <div className="grid grid-cols-4 gap-2 bg-theme-bgBase p-3 rounded-lg border border-theme-border mb-4">
                      {[...Array(8)].map((_, i) => {
                        const pk = memberUser.peserta?.karakters?.[i];
                        return (
                          <div key={i} className="aspect-square bg-theme-bgPanel rounded border border-theme-border relative overflow-hidden flex items-center justify-center">
                            {pk && pk.karakter ? (
                              <>
                                <img src={pk.karakter.imageUrl} alt={pk.karakter.nama} className="w-full h-full object-contain p-0.5" />
                                {pk.isC1 && (
                                  <div className="absolute top-0.5 left-0.5 bg-yellow-600 text-white text-[8px] font-bold px-1 rounded">
                                    C1
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-500 text-[10px]">{i + 1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tombol Aksi Promosi */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handlePromoteToPeserta(memberUser)}
                      disabled={!isReady}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        isReady
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 cursor-pointer'
                          : 'bg-gray-700/50 text-gray-400 border border-theme-border cursor-not-allowed opacity-60'
                      }`}
                    >
                      <ArrowUpRight size={16} />
                      {isReady ? 'Promosikan ke Peserta' : 'Formasi Belum Pas 8'}
                    </button>
                  </div>
                </div>
              );
            })}

            {members.length === 0 && (
              <div className="col-span-full text-center py-12 text-theme-textSub bg-theme-bgPanel rounded-xl border border-dashed border-theme-border">
                Tidak ada pendaftar baru dengan role Member saat ini.
              </div>
            )}
          </div>
        </div>
      )}


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
