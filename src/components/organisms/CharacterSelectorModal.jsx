import { X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Reset page when search query changes or modal opens
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeSlot, isAdmin]);

  if (!activeSlot && !isAdmin) return null;

  const totalPages = Math.ceil(filteredModalCharacters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredModalCharacters.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-theme-bgPanel rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl border border-theme-border">
        <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-bgBase rounded-t-2xl shrink-0">
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
          <button onClick={onClose} className="text-theme-textSub hover:text-theme-textMain p-2 bg-theme-bgHover rounded-xl transition-colors">
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

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 content-start">
              {currentItems.map(k => {
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
                    className="aspect-square bg-theme-bgHover rounded-lg border border-theme-border hover:border-blue-400 hover:scale-105 transition-all cursor-pointer overflow-hidden group relative shadow-md"
                  >
                    {k.imageUrl ? (
                      <img src={k.imageUrl} alt={k.nama} className="w-full h-full object-contain p-1" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-white font-bold text-center p-1">
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
                <div className="col-span-full text-center py-10 text-theme-textSub font-bold">
                  Tidak ada karakter yang cocok.
                </div>
              )}
            </div>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-theme-border shrink-0">
              <span className="text-sm font-bold text-theme-textSub">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredModalCharacters.length)} dari {filteredModalCharacters.length}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-theme-bgBase text-theme-textMain hover:bg-theme-bgHover disabled:opacity-50 disabled:cursor-not-allowed border border-theme-border transition-colors flex items-center justify-center"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center justify-center px-4 font-bold bg-theme-bgBase border border-theme-border rounded-lg text-theme-textMain">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-theme-bgBase text-theme-textMain hover:bg-theme-bgHover disabled:opacity-50 disabled:cursor-not-allowed border border-theme-border transition-colors flex items-center justify-center"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
