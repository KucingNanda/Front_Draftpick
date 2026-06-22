import { X, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { VISIONS, SENJATAS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

export default function KarakterPreviewModal({ previewKarakter, setPreviewKarakter, handleOpenModal, handleDelete }) {
  const { isWasit } = useAuth();
  if (!previewKarakter) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4" onClick={() => setPreviewKarakter(null)}>
      <div 
        className="bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col sm:flex-row border border-gray-700 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        <button onClick={() => setPreviewKarakter(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white bg-gray-900/50 p-1 rounded-full z-10 transition-colors">
          <X size={20} />
        </button>

        {/* Kiri: Foto Besar */}
        <div className="w-full sm:w-2/5 aspect-square bg-gray-900 relative flex items-center justify-center p-2">
          {previewKarakter.imageUrl ? (
            <img src={previewKarakter.imageUrl} alt={previewKarakter.nama} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <ImageIcon size={64} />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur text-yellow-500 text-xs font-bold px-2 py-1 rounded shadow">
            Cost: {previewKarakter.cost}
          </div>
        </div>

        {/* Kanan: Detail & Aksi */}
        <div className="w-full sm:w-3/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="bg-blue-900/30 text-blue-400 border border-blue-900/50 text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase mb-3 inline-block">
              KARTU IDENTITAS
            </span>
            <h2 className="text-3xl font-bold text-white mb-1">{previewKarakter.nama}</h2>
            <p className="text-yellow-500 font-semibold text-sm mb-6">{previewKarakter.rarity}</p>

            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Vision</span>
                <div className="flex items-center gap-2">
                  {VISIONS.find(v => v.name === previewKarakter.vision)?.icon && (
                    <img src={VISIONS.find(v => v.name === previewKarakter.vision).icon} alt={previewKarakter.vision} className="w-8 h-8" />
                  )}
                  <span className="text-white text-lg font-medium">{previewKarakter.vision || '-'}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Senjata</span>
                <div className="flex items-center gap-2">
                  {SENJATAS.find(s => s.name === previewKarakter.senjata)?.icon && (
                    <img src={SENJATAS.find(s => s.name === previewKarakter.senjata).icon} alt={previewKarakter.senjata} className="w-8 h-8 opacity-80" />
                  )}
                  <span className="text-white text-lg font-medium">{previewKarakter.senjata || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isWasit && (
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700">
              <button 
                onClick={() => handleOpenModal(previewKarakter)}
                className="flex-1 flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg transition-colors font-medium"
              >
                <Edit2 size={18} /> Edit Data
              </button>
              <button 
                onClick={() => handleDelete(previewKarakter.id)}
                className="flex justify-center items-center gap-2 px-4 bg-red-900/40 hover:bg-red-800/60 text-red-400 border border-red-900/50 py-2.5 rounded-lg transition-colors font-medium"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
