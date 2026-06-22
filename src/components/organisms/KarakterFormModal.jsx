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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white">
            {formData.id ? 'Edit Karakter' : 'Tambah Karakter'}
          </h2>
          <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors" disabled={isSubmitting}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Foto Karakter</label>
            {formData.imageUrl && !imageFile && (
              <div className="mb-2 text-sm text-green-400">Gambar saat ini sudah tersimpan. Pilih file baru untuk mengganti.</div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              required={!formData.imageUrl} 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-700 mt-6">
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
