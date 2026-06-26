import { X } from 'lucide-react';
import { VISIONS, SENJATAS, RARITIES } from '../../utils/constants';

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

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white">
            {formData.id ? 'Edit Karakter' : 'Tambah Karakter'}
          </h2>
          <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors" disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Kolom Kiri: Image Preview */}
            <div className="col-span-1 flex flex-col gap-4">
              <label className="block text-sm font-medium text-gray-400">Foto Karakter</label>
              <div className="aspect-square w-full bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center overflow-hidden relative group transition-colors hover:border-blue-500">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                ) : (
                  <div className="text-gray-500 text-center p-4">
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
                    <span className="bg-black/70 text-white px-3 py-1.5 text-sm font-medium rounded-lg backdrop-blur-sm">Ganti Foto</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Kolom Kanan: Input Data */}
            <div className="col-span-1 md:col-span-2 space-y-5">
              <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nama Karakter</label>
            <input 
              type="text" 
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Vision</label>
            <div className="flex flex-wrap gap-2">
              {VISIONS.map(v => (
                <div 
                  key={v.name}
                  onClick={() => setFormData(prev => ({...prev, vision: v.name}))}
                  className={`w-10 h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all ${formData.vision === v.name ? 'border-blue-500 bg-blue-500/20 scale-110' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}
                  title={v.name}
                >
                  {v.icon ? (
                    <img src={v.icon} alt={v.name} className="w-6 h-6" />
                  ) : (
                    <span className="text-xs font-bold text-gray-500">FLX</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Senjata</label>
            <div className="flex flex-wrap gap-2">
              {SENJATAS.map(s => (
                <div 
                  key={s.name}
                  onClick={() => setFormData(prev => ({...prev, senjata: s.name}))}
                  className={`w-10 h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-all ${formData.senjata === s.name ? 'border-blue-500 bg-blue-500/20 scale-110' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}
                  title={s.name}
                >
                  {s.icon && <img src={s.icon} alt={s.name} className="w-6 h-6 opacity-80" />}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Rarity</label>
            <select 
              name="rarity"
              value={formData.rarity}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
            >
              <option value="" disabled>--- Pilih ---</option>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <p className="text-xs text-gray-500 mt-1">*Cost akan dihitung otomatis oleh server.</p>
          </div>

            </div>
          </div>

          <div className="pt-5 flex justify-end gap-3 border-t border-gray-700">
            <button 
              type="button" 
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
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
