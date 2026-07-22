import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';

export default function GuestRegisteredModal({ isOpen, onClose, playerKey, karakters, draftState, onSave }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChars, setSelectedChars] = useState([]);

  useEffect(() => {
    if (isOpen && playerKey) {
      const currentRegs = draftState[playerKey].registered.filter(c => c !== null);
      setSelectedChars(currentRegs);
      setSearchQuery('');
    }
  }, [isOpen, playerKey]);

  if (!isOpen) return null;

  const b5Karakters = karakters.filter(k => k.cost === 1);
  const filtered = b5Karakters.filter(k => k.nama.toLowerCase().includes(searchQuery.toLowerCase()));

  const toggleChar = (char) => {
    const exists = selectedChars.find(c => c.id === char.id);
    if (exists) {
      setSelectedChars(prev => prev.filter(c => c.id !== char.id));
    } else {
      if (selectedChars.length >= 8) return;
      setSelectedChars(prev => [...prev, { ...char, isC1: false }]);
    }
  };

  const handleSave = () => {
    onSave(playerKey, selectedChars);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-theme-bgPanel rounded-xl w-full max-w-4xl flex flex-col shadow-2xl border border-theme-border overflow-hidden max-h-[85vh]">
        <div className="p-4 border-b border-theme-border flex justify-between items-center bg-theme-bgBase">
          <h2 className="text-lg font-bold text-theme-textMain">
            Pilih 8 Karakter (Player {playerKey === 'playerA' ? 'A' : 'B'})
          </h2>
          <button onClick={onClose} className="text-theme-textSub hover:text-white transition-colors bg-theme-bgHover p-1.5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-theme-bgPanel flex flex-col sm:flex-row justify-between items-center border-b border-theme-border gap-4">
           <div className="relative w-full sm:flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-textSub" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Bintang 5..."
                className="w-full bg-theme-bgBase border border-theme-border rounded-lg pl-10 pr-4 py-2.5 text-theme-textMain focus:border-blue-500 focus:outline-none transition-colors"
              />
           </div>
           <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className={`text-sm font-bold bg-theme-bgBase px-3 py-1.5 rounded-lg ${selectedChars.length === 8 ? 'text-green-400' : 'text-yellow-400'}`}>
                Terpilih: {selectedChars.length}/8
              </span>
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2"
              >
                <Check size={18} /> Simpan
              </button>
           </div>
        </div>

        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-theme-bgBase">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 content-start">
            {filtered.map(k => {
               const isSelected = selectedChars.find(c => c.id === k.id);
               return (
                 <div 
                   key={k.id}
                   onClick={() => toggleChar(k)}
                   className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden transition-all group ${isSelected ? 'border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)] z-10' : 'border-theme-border bg-theme-bgPanel hover:border-gray-500'}`}
                 >
                    {k.imageUrl ? (
                      <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold text-center p-1">{k.nama}</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[10px] text-center py-1 font-bold text-white truncate px-1">
                      {k.nama}
                    </div>
                 </div>
               )
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-theme-textSub font-bold">
                Tidak ada karakter Bintang 5 yang cocok.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
