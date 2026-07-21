import { X } from 'lucide-react';
import { ELEMENS, SENJATAS, RARITIES, REGIONS, SINERGIS } from '../../utils/constants';

export default function KarakterFormModal({
  isOpen,
  formData,
  setFormData,
  imageFile,
  handleFileChange,
  handleSubmit,
  handleCloseModal,
  isSubmitting
}) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    if (!dateVal) return;
    const dateObj = new Date(dateVal);
    // Pastikan locale bahasa indonesia ("27 September")
    const text = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
    setFormData((prev) => ({ ...prev, ulangTahun: text }));
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-theme-bgPanel border border-theme-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-theme-border bg-theme-bgPanel">
          <h2 className="text-xl font-bold text-theme-textMain">
            {formData.id ? 'Edit Karakter' : 'Tambah Karakter'}
          </h2>
          <button onClick={handleCloseModal} className="text-theme-textSub hover:text-theme-textMain transition-colors" disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Kolom Kiri: Image Preview */}
            <div className="col-span-1 flex flex-col gap-4">
              <label className="block text-sm font-medium text-theme-textSub">Foto Karakter</label>
              <div className="aspect-square w-full bg-theme-bgBase border-2 border-dashed border-theme-border rounded-xl flex items-center justify-center overflow-hidden relative group transition-colors hover:border-blue-500">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="text-theme-textSub text-center p-4">
                    <span className="block text-4xl mb-2">📸</span>
                    <span className="text-sm">Klik untuk memilih foto</span>
                  </div>
                )}
                {/* Input File Overlay (Invisible but clickable) */}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!formData.imageUrl} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Klik untuk memilih foto"
                />
                {previewUrl && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/70 text-theme-textMain px-3 py-1.5 text-sm font-medium rounded-lg backdrop-blur-sm">Ganti Foto</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Kolom Kanan: Input Data */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-6 overflow-y-auto custom-scrollbar max-h-[70vh] pr-2">
              
              {/* KATEGORI 1: Informasi Turnamen */}
              <div className="bg-theme-bgBase p-5 rounded-xl border border-theme-border space-y-4">
                <h3 className="text-xs font-bold text-blue-400 border-b border-theme-border pb-2 uppercase tracking-wider">Informasi Turnamen</h3>
                
                <div>
                  <label className="block text-sm font-medium text-theme-textSub mb-1">Nama Karakter</label>
                  <input 
                    type="text" 
                    name="nama"
                    value={formData.nama || ''}
                    onChange={handleChange}
                    required
                    className="w-full bg-theme-bgBase border border-theme-border rounded-lg px-4 py-2.5 text-theme-textMain focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-textSub mb-1">Rarity</label>
                  <select 
                    name="rarity"
                    value={formData.rarity || ''}
                    onChange={handleChange}
                    required
                    className="w-full bg-theme-bgBase border border-theme-border rounded-lg px-4 py-2.5 text-theme-textMain focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="" disabled>--- Pilih ---</option>
                    {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <p className="text-xs text-theme-textSub mt-1">*Cost akan dihitung otomatis oleh server berdasarkan Rarity.</p>
                </div>
              
                <div>
                  <label className="block text-sm font-medium text-theme-textSub mb-2">Elemen</label>
                  <div className="flex flex-wrap gap-2">
                    {ELEMENS.map(v => (
                      <div 
                        key={v.name}
                        onClick={() => setFormData(prev => ({...prev, elemen: v.name}))}
                        className={`w-10 h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all ${formData.elemen === v.name ? 'border-blue-500 bg-blue-500/20 scale-110' : 'border-theme-border bg-theme-bgBase hover:border-gray-500'}`}
                        title={v.name}
                      >
                        {v.icon ? (
                          <img src={v.icon} alt={v.name} className="w-6 h-6" />
                        ) : (
                          <span className="text-xs font-bold text-theme-textSub">FLX</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-textSub mb-2">Senjata</label>
                  <div className="flex flex-wrap gap-2">
                    {SENJATAS.map(s => (
                      <div 
                        key={s.name}
                        onClick={() => setFormData(prev => ({...prev, senjata: s.name}))}
                        className={`w-10 h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all ${formData.senjata === s.name ? 'border-blue-500 bg-blue-500/20 scale-110' : 'border-theme-border bg-theme-bgBase hover:border-gray-500'}`}
                        title={s.name}
                      >
                        {s.icon && <img src={s.icon} alt={s.name} className="w-6 h-6 opacity-80" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-textSub mb-1">Sinergi / Buff Khusus</label>
                  <select 
                    name="sinergi"
                    value={formData.sinergi || 'Tidak Ada'}
                    onChange={handleChange}
                    className="w-full bg-theme-bgBase border border-theme-border rounded-lg px-4 py-2.5 text-theme-textMain focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    {SINERGIS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* KATEGORI 2: Biodata Karakter */}
              <div className="bg-theme-bgBase p-5 rounded-xl border border-theme-border space-y-4">
                <h3 className="text-xs font-bold text-purple-400 border-b border-theme-border pb-2 uppercase tracking-wider">Biodata Karakter (Lore)</h3>
                
                <div>
                  <label className="block text-sm font-medium text-theme-textSub mb-1">Konstelasi</label>
                  <input 
                    type="text" 
                    name="konstelasi"
                    value={formData.konstelasi || ''}
                    onChange={handleChange}
                    placeholder="Contoh: Viator"
                    className="w-full bg-theme-bgBase border border-theme-border rounded-lg px-4 py-2.5 text-theme-textMain focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-textSub mb-1">Region Asal</label>
                    <select 
                      name="region"
                      value={formData.region || 'Tidak Ada'}
                      onChange={handleChange}
                      className="w-full bg-theme-bgBase border border-theme-border rounded-lg px-4 py-2.5 text-theme-textMain focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-textSub mb-1">Ulang Tahun</label>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input 
                          type="date" 
                          onChange={handleDateChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          title="Buka Kalender"
                        />
                        <div className="bg-theme-bgBase border border-theme-border rounded-lg p-2.5 flex items-center justify-center hover:border-purple-500 transition-colors">
                          📅
                        </div>
                      </div>
                      <input 
                        type="text"
                        name="ulangTahun"
                        value={formData.ulangTahun || ''}
                        onChange={handleChange}
                        placeholder="Misal: 27 September"
                        className="flex-1 w-full bg-theme-bgBase border border-theme-border rounded-lg px-3 py-2.5 text-theme-textMain focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-theme-border">
            <button 
              type="button" 
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-medium text-theme-textSub hover:bg-theme-bgHover transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                'Simpan Karakter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
