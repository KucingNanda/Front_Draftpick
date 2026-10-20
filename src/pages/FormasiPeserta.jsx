import { useState, useEffect } from 'react';
import { Shield, Sparkles, CheckCircle, AlertCircle, Edit3, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import PesertaFormModal from '../components/organisms/PesertaFormModal';

export default function FormasiPeserta() {
  const { role, isMember, isPeserta, isGuest, refreshUser } = useAuth();
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [karakters, setKarakters] = useState([]);
  const [formNama, setFormNama] = useState('');
  const [selectedChars, setSelectedChars] = useState({}); // format: { charId: isC1 }
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMyData = async () => {
    if (isGuest) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      await refreshUser();

      // Ambil daftar karakter limited (cost === 1)
      const resK = await api(`${import.meta.env.VITE_API_BASE_URL}/api/karakter`);
      const dataK = await resK.json();
      setKarakters((dataK || []).filter(k => k.cost === 1));

      // Ambil data profil peserta milik akun sendiri
      const resP = await api(`${import.meta.env.VITE_API_BASE_URL}/api/my-peserta`);
      if (resP.ok) {
        const dataP = await resP.json();
        if (dataP) {
          setFormNama(dataP.nama || '');
          let charsMap = {};
          if (dataP.karakters) {
            dataP.karakters.forEach(pk => {
              if (pk.karakter) {
                charsMap[pk.karakter.id] = pk.isC1;
              }
            });
          }
          setSelectedChars(charsMap);
        }
      }
    } catch (error) {
      console.error('Error fetching my peserta data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isGuest) {
      fetchMyData();
    } else {
      setLoading(false);
    }
  }, [api, isGuest]);


  const handleToggleChar = (charId) => {
    setSelectedChars(prev => {
      const next = { ...prev };
      if (next[charId] !== undefined) {
        delete next[charId];
      } else {
        if (Object.keys(next).length >= 8) {
          Swal.fire({
            title: 'Batas Tercapai!',
            text: 'Hanya bisa memilih maksimal 8 karakter!',
            icon: 'warning',
            background: 'var(--theme-bg-panel)',
            color: 'var(--theme-text-main)',
            confirmButtonColor: '#3b82f6'
          });
          return prev;
        }
        next[charId] = false;
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!formNama.trim()) {
      Swal.fire({
        title: 'Nama Kosong!',
        text: 'Masukkan nama pemain / in-game Anda terlebih dahulu!',
        icon: 'warning',
        background: 'var(--theme-bg-panel)',
        color: 'var(--theme-text-main)'
      });
      return;
    }

    if (Object.keys(selectedChars).length !== 8) {
      Swal.fire({
        title: 'Formasi Belum Lengkap!',
        text: `Anda baru memilih ${Object.keys(selectedChars).length}/8 karakter. Harus pas 8 karakter!`,
        icon: 'warning',
        background: 'var(--theme-bg-panel)',
        color: 'var(--theme-text-main)'
      });
      return;
    }

    const payload = {
      nama: formNama.trim(),
      karakters: Object.entries(selectedChars).map(([kId, isC1]) => ({
        karakterId: parseInt(kId),
        isC1: isC1
      }))
    };

    setIsSaving(true);
    try {
      const res = await api(`${import.meta.env.VITE_API_BASE_URL}/api/my-peserta`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) {
        Swal.fire({
          title: 'Gagal!',
          text: resData.error || 'Gagal menyimpan formasi karakter',
          icon: 'error',
          background: 'var(--theme-bg-panel)',
          color: 'var(--theme-text-main)'
        });
        return;
      }

      setIsModalOpen(false);
      await fetchMyData();

      Swal.fire({
        title: 'Berhasil Disimpan!',
        text: isMember 
          ? 'Formasi 8 karakter berhasil disimpan! Data Anda kini siap diverifikasi dan dipromosikan oleh Wasit.' 
          : 'Formasi 8 karakter berhasil diperbarui dan aktif di Arena Turnamen.',
        icon: 'success',
        background: 'var(--theme-bg-panel)',
        color: 'var(--theme-text-main)',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan jaringan',
        icon: 'error',
        background: 'var(--theme-bg-panel)',
        color: 'var(--theme-text-main)'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = Object.keys(selectedChars).length;

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-theme-border pb-4 pt-8 -mt-8 gap-4 sticky -top-8 z-40 bg-theme-bgBase">
        <div>
          <h1 className="text-3xl font-bold text-theme-textMain flex items-center gap-3">
            <Shield className="text-blue-500" size={30} />
            Formasi Karakter Saya
          </h1>
          <p className="text-theme-textSub mt-1 text-sm">
            Kelola identitas dan 8 karakter 5-Star Limited andalan Anda untuk turnamen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isMember && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
              <AlertCircle size={14} /> Calon Peserta (Member)
            </span>
          )}
          {isPeserta && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle size={14} /> Peserta Resmi Turnamen
            </span>
          )}
        </div>
      </div>

      {/* Banner Informasi Status */}
      {isMember && (
        <div className="bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border-l-4 border-yellow-500 p-4 rounded-r-xl mb-6">
          <h3 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
            <Sparkles size={16} /> Menunggu Persetujuan Wasit
          </h3>
          <p className="text-theme-textSub text-xs mt-1 leading-relaxed">
            Akun Anda saat ini berstatus <strong>Member</strong>. Pastikan Anda sudah melengkapi nama in-game dan memilih tepat <strong>8 karakter Limited</strong> di bawah ini. Setelah itu, Wasit dapat memverifikasi dan mempromosikan akun Anda menjadi <strong>Peserta Resmi</strong> agar muncul di arena pertandingan.
          </p>
        </div>
      )}

      {isPeserta && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-transparent border-l-4 border-emerald-500 p-4 rounded-r-xl mb-6">
          <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> Terdaftar di Turnamen
          </h3>
          <p className="text-theme-textSub text-xs mt-1 leading-relaxed">
            Selamat! Akun Anda telah dipromosikan oleh Wasit menjadi <strong>Peserta Resmi</strong>. Formasi 8 karakter di bawah ini dapat dipilih dan digunakan langsung di dalam simulasi Arena Draft Pick.
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-theme-textSub">Memuat formasi karakter...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sisi Kiri: Biodata Nama & Aksi */}
          <div className="bg-theme-bgPanel rounded-xl border border-theme-border p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <h2 className="text-lg font-bold text-theme-textMain mb-4 flex items-center gap-2">
                <Edit3 size={18} className="text-blue-400" /> Profil Pemain
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-theme-textSub mb-2 uppercase tracking-wider">
                    Nama Pemain / In-Game
                  </label>
                  <input
                    type="text"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Contoh: Traveler_Pro"
                    className="w-full bg-theme-bgBase border border-theme-border rounded-lg px-4 py-3 text-theme-textMain font-medium focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="bg-theme-bgBase p-4 rounded-lg border border-theme-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-theme-textSub">Status Formasi:</span>
                    <span className={`font-bold ${selectedCount === 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                      {selectedCount === 8 ? 'Lengkap (8/8)' : `Belum Lengkap (${selectedCount}/8)`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-theme-textSub">Status Akun:</span>
                    <span className="font-bold capitalize text-theme-textMain">{role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-theme-bgHover hover:bg-theme-border text-theme-textMain py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 border border-theme-border transition-colors text-sm"
              >
                <Edit3 size={16} /> Pilih / Ubah 8 Karakter
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all text-sm disabled:opacity-50"
              >
                <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Formasi'}
              </button>
            </div>
          </div>

          {/* Sisi Kanan: Tampilan 8 Karakter Terpilih */}
          <div className="md:col-span-2 bg-theme-bgPanel rounded-xl border border-theme-border p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-theme-textMain">8 Karakter Andalan</h2>
                <p className="text-xs text-theme-textSub">Karakter 5-Star Limited yang didaftarkan ke turnamen</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                selectedCount === 8 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {selectedCount} / 8 Terpilih
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(8)].map((_, idx) => {
                const selectedIds = Object.keys(selectedChars);
                const charId = selectedIds[idx];
                const char = charId ? karakters.find(k => k.id == charId) : null;
                const isC1 = charId ? selectedChars[charId] : false;

                return (
                  <div
                    key={idx}
                    onClick={() => setIsModalOpen(true)}
                    className="aspect-square bg-theme-bgBase rounded-xl border border-theme-border relative overflow-hidden flex flex-col items-center justify-center cursor-pointer group hover:border-blue-500 transition-all shadow-inner"
                  >
                    {char ? (
                      <>
                        {char.imageUrl ? (
                          <img
                            src={char.imageUrl}
                            alt={char.nama}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <span className="text-xs font-bold text-center px-2">{char.nama}</span>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs text-[11px] text-white font-medium text-center py-1 truncate px-1">
                          {char.nama}
                        </div>
                        {isC1 && (
                          <div className="absolute top-1.5 left-1.5 bg-yellow-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                            C1
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-3">
                        <span className="text-2xl font-bold text-theme-textSub/30 block mb-1">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] text-theme-textSub block">
                          Slot Kosong
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-theme-textSub mt-4 leading-relaxed">
              * Klik pada kartu slot atau tombol "Pilih / Ubah 8 Karakter" untuk membuka daftar pilihan. Pastikan menekan <strong>Simpan Formasi</strong> setelah selesai mengubah pilihan.
            </p>
          </div>
        </div>
      )}

      {/* Modal Pemilih Karakter */}
      <PesertaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={null}
        formNama={formNama}
        setFormNama={setFormNama}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        karakters={karakters}
        selectedChars={selectedChars}
        handleToggleChar={handleToggleChar}
        handleToggleC1={handleToggleC1}
        handleClearChars={handleClearChars}
        handleSubmit={(e) => {
          setIsModalOpen(false);
          handleSave(e);
        }}
      />
    </div>
  );
}
