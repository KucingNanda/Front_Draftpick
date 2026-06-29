import { X, Search } from 'lucide-react';

export default function CharacterSelectorModal({ 
  activeSlot, 
  playerA, 
  playerB, 
  searchQuery, 
  setSearchQuery, 
  filteredModalCharacters, 
  onClose, 
  onSelectCharacter,
  isAdmin 
}) {
  if (!activeSlot && !isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-100 dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-slate-300 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-slate-300 dark:border-gray-700 flex justify-between items-center bg-slate-300 dark:bg-gray-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              {isAdmin ? 'Pilih Karakter Spesial (Bintang 4)' : `Pilih Karakter ${activeSlot?.action === 'reg' ? '(5-Star Limited)' : activeSlot?.action === 'bans' ? '(Untuk di-BAN)' : ''}`}
            </h2>
            {!isAdmin && (
              <p className="text-gray-400 dark:text-slate-500 dark:text-gray-400 text-sm">
                {activeSlot?.player === 'playerA' ? (playerA?.nama || 'Player A') : (playerB?.nama || 'Player B')} - {activeSlot?.type.replace('Half', ' Half')}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 dark:text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 dark:text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama karakter..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-300 dark:bg-gray-900 border border-slate-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-3 text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex-1 overflow-y-scroll custom-scrollbar pr-2">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 content-start">
              {filteredModalCharacters.map(k => {
                let hasC1 = false;
                if (!isAdmin) {
                  const selectedProfile = activeSlot?.player === 'playerA' ? playerA : playerB;
                  if (k.cost === 1 && selectedProfile && selectedProfile.karakters) {
                     const match = selectedProfile.karakters.find(pk => pk.karakter.id === k.id);
                     if (match && match.isC1) hasC1 = true;
                  }
                }
                return (
                  <div 
                    key={k.id} 
                    onClick={() => onSelectCharacter(k)}
                    className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:scale-105 transition-all cursor-pointer overflow-hidden group relative"
                  >
                    {k.imageUrl ? (
                      <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 dark:text-slate-500 dark:text-gray-400 font-medium text-center p-1">
                        {k.nama}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[10px] text-center py-1 font-semibold">
                      {k.nama}
                    </div>
                    <div className="absolute top-1 left-1 bg-slate-300 dark:bg-gray-900/80 text-yellow-500 text-[9px] font-bold px-1.5 rounded shadow">
                      C:{k.cost}
                    </div>
                    {hasC1 && (
                      <div className="absolute top-1 right-1 bg-yellow-600 text-white text-[9px] font-bold px-1 rounded shadow">
                        C1
                      </div>
                    )}
                  </div>
                )
              })}
              {filteredModalCharacters.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-400 dark:text-gray-500">
                  Tidak ada karakter yang cocok atau tersedia untuk profil peserta ini.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
