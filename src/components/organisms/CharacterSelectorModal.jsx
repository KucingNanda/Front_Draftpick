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
      <div className="bg-theme-bgPanel rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl border border-theme-border">
        <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-bgBase rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-theme-textMain uppercase tracking-wider">
              {isAdmin ? 'Pilih Karakter Spesial (Bintang 4)' : `Pilih Karakter ${activeSlot?.action === 'reg' ? '(5-Star Limited)' : activeSlot?.action === 'bans' ? '(Untuk di-BAN)' : ''}`}
            </h2>
            {!isAdmin && activeSlot && (
              <p className="text-theme-textSub text-sm mt-1">
                {activeSlot.player === 'playerA' ? (playerA?.nama || 'Player A') : (playerB?.nama || 'Player B')} 
                <span className="opacity-70 ml-1">
                  &bull; {
                    activeSlot.type === 'registered' ? 'Registered Character' :
                    activeSlot.type === 'globalBans' ? 'Permanent Ban' :
                    activeSlot.type === 'firstHalf' ? (activeSlot.action === 'bans' ? 'Ban Phase (First Half)' : 'Pick Phase (First Half)') :
                    activeSlot.type === 'secondHalf' ? (activeSlot.action === 'bans' ? 'Ban Phase (Second Half)' : 'Pick Phase (Second Half)') :
                    activeSlot.type
                  }
                </span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-theme-textSub hover:text-theme-textMain p-2">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 flex flex-col flex-1 overflow-hidden">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-textSub" size={20} />
            <input 
              type="text" 
              placeholder="Cari nama karakter..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-theme-bgBase border border-theme-border rounded-lg pl-10 pr-4 py-3 text-theme-textMain focus:border-blue-500 focus:outline-none transition-colors"
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
                    className="aspect-square bg-theme-bgHover rounded-lg border border-theme-border hover:border-blue-400 hover:scale-105 transition-all cursor-pointer overflow-hidden group relative"
                  >
                    {k.imageUrl ? (
                      <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold text-center p-1">
                        {k.nama}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-[10px] text-center py-1 font-bold text-white px-1 truncate">
                      {k.nama}
                    </div>
                    <div className="absolute top-1 left-1 bg-theme-bgBase text-yellow-500 text-[9px] font-bold px-1.5 rounded shadow">
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
                <div className="col-span-full text-center py-10 text-theme-textSub">
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
