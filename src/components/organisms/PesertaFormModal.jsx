import { X, Search, Star } from 'lucide-react';

export default function PesertaFormModal({
  isOpen,
  onClose,
  editingId,
  formNama,
  setFormNama,
  searchQuery,
  setSearchQuery,
  karakters,
  selectedChars,
  handleToggleChar,
  handleToggleC1,
  handleClearChars,
  handleSubmit
}) {
  if (!isOpen) return null;

  const filteredKarakters = karakters.filter(k => 
    k.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h2 className="text-xl font-bold text-white">
            {editingId ? 'Edit Data Peserta' : 'Pendaftaran Peserta Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Kiri: Input Nama & Ringkasan Slot */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Peserta</label>
                <input 
                  type="text" 
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Masukkan nama pemain..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="bg-gray-900/50 p-5 rounded-xl border border-gray-700 flex-1">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-300">
                    Slot Terisi
                  </label>
                  <span className={`text-sm font-bold ${Object.keys(selectedChars).length === 8 ? "text-green-400" : "text-yellow-400"}`}>
                    {Object.keys(selectedChars).length}/8
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(8)].map((_, i) => {
                    const selectedIds = Object.keys(selectedChars);
                    const charId = selectedIds[i];
                    const char = charId ? karakters.find(k => k.id == charId) : null;
                    const isC1 = charId ? selectedChars[charId] : false;

                    return (
                      <div key={i} className="aspect-square bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden flex items-center justify-center">
                        {char ? (
                          <>
                            {char.imageUrl ? (
                              <img src={char.imageUrl} alt={char.nama} className="w-full h-full object-contain p-0.5" />
                            ) : (
                              <span className="text-[9px] text-gray-500 font-medium text-center truncate px-1">{char.nama}</span>
                            )}
                            {isC1 && (
                              <div className="absolute top-0 right-0 bg-yellow-500 rounded-bl text-white p-0.5 shadow-sm shadow-yellow-500/50">
                                <Star size={10} className="fill-current" />
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-600 text-xs font-semibold">{i+1}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-5 leading-relaxed">
                  Pilih tepat 8 karakter andalan. Gunakan ikon bintang pada daftar karakter di samping untuk menyalakan mode C1 (+1 Cost). Ruang kosong ini juga siap menampung atribut peserta lainnya di masa depan.
                </p>
              </div>
            </div>

            {/* Kolom Kanan: Pencarian & Pemilihan Karakter */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cari & Pilih Karakter</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nama..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-700 content-start flex-1 min-h-[300px]">
                {filteredKarakters.map(k => {
                  const isSelected = selectedChars[k.id] !== undefined;
                  const isC1 = selectedChars[k.id] === true;

                  return (
                    <div 
                      key={k.id} 
                      onClick={() => handleToggleChar(k.id)}
                      className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all group ${isSelected ? 'border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
                    >
                      {k.imageUrl ? (
                        <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium text-center p-1">
                          {k.nama}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[10px] text-center py-1 font-semibold text-white truncate px-1">
                        {k.nama}
                      </div>

                      {isSelected && (
                        <button 
                          onClick={(e) => handleToggleC1(e, k.id)}
                          className={`absolute top-1 right-1 p-1.5 rounded-full shadow-md transition-all z-20 hover:scale-110 ${isC1 ? 'bg-yellow-500 text-white shadow-yellow-500/50' : 'bg-gray-900/90 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-600'}`}
                          title={isC1 ? "Batalkan C1" : "Set sebagai C1 (+1 Cost)"}
                        >
                          <Star size={12} className={isC1 ? "fill-current" : ""} />
                        </button>
                      )}
                    </div>
                  )
                })}
                {filteredKarakters.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    Tidak ada karakter yang cocok dengan "{searchQuery}".
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 flex justify-between gap-3 bg-gray-900/30">
          <button 
            onClick={handleClearChars}
            className="px-5 py-2.5 rounded-lg font-medium text-red-400 border border-red-900/50 hover:bg-red-900/30 transition-colors"
          >
            Bersihkan Karakter
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-900/20"
            >
              Simpan Peserta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
