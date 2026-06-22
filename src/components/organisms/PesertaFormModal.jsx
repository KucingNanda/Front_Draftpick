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
      <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {editingId ? 'Edit Data Peserta' : 'Pendaftaran Peserta Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          {/* Form Nama & Cari Karakter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cari Karakter</label>
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
          </div>

          {/* Pilihan 8 Karakter */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="block text-sm font-medium text-gray-300">
                Pilih 8 Karakter Andalan (Terpilih: <span className={Object.keys(selectedChars).length === 8 ? "text-green-400" : "text-yellow-400"}>{Object.keys(selectedChars).length}/8</span>)
              </label>
              <span className="text-xs text-gray-500">Klik ikon Bintang untuk set C1</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 bg-gray-900/50 p-4 rounded-xl border border-gray-700 content-start">
              {filteredKarakters.map(k => {
                const isSelected = selectedChars[k.id] !== undefined;
                const isC1 = selectedChars[k.id] === true;

                return (
                  <div 
                    key={k.id} 
                    onClick={() => handleToggleChar(k.id)}
                    className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all ${isSelected ? 'border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
                  >
                    {k.imageUrl ? (
                      <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium text-center p-1">
                        {k.nama}
                      </div>
                    )}
                    
                    {/* Overlay Nama */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[10px] text-center py-1 font-semibold text-white truncate px-1">
                      {k.nama}
                    </div>

                    {/* Tombol Toggle C1 (Muncul jika karakter dipilih) */}
                    {isSelected && (
                      <button 
                        onClick={(e) => handleToggleC1(e, k.id)}
                        className={`absolute top-1 right-1 p-1 rounded-full shadow-md transition-all ${isC1 ? 'bg-yellow-500 text-white shadow-yellow-500/50' : 'bg-gray-900/80 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        title="Set sebagai C1 (+1 Cost)"
                      >
                        <Star size={12} className={isC1 ? "fill-current" : ""} />
                      </button>
                    )}
                  </div>
                )
              })}
              {filteredKarakters.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Tidak ada karakter yang cocok dengan "{searchQuery}".
                </div>
              )}
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
