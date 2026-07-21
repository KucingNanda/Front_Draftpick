import { X, Sword } from 'lucide-react';

export default function PickSlot({ data, player, type, index, onSlotClick, onRemove, onToggleWeapon, onToggleConstellation, isGuest }) {
  return (
    <div 
      onClick={() => onSlotClick(player, type, 'picks', index)}
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 2xl:w-32 2xl:h-32 bg-theme-bgPanel border-2 ${data ? 'border-blue-500/50' : 'border-theme-border'} rounded-xl shadow-inner flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer shrink-0 relative overflow-hidden group`}
    >
      {data ? (
        <>
          {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-contain p-1" alt={data.nama} /> : <span className="text-xs">{data.nama}</span>}
          
          {/* Ikon Senjata B5 Toggle (Kanan Bawah) */}
          <button 
            onClick={(e) => onToggleWeapon(e, player, type, index)}
            className={`absolute bottom-1 right-1 p-1 md:p-1.5 rounded-md backdrop-blur shadow-md transition-all z-10 
              ${!data.weaponLevel ? 'bg-theme-bgBase text-theme-textSub hover:bg-theme-bgHover' : ''}
              ${data.weaponLevel === 1 ? 'bg-yellow-500/80 text-white border border-yellow-400' : ''}
              ${data.weaponLevel === 2 ? 'bg-orange-600/90 text-theme-textMain border border-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.6)]' : ''}
            `}
            title="Klik untuk Toggle Senjata B5 (0 -> R1 -> R2)"
          >
            {data.weaponLevel > 0 ? (
              <span className="text-[9px] md:text-[10px] font-black tracking-tighter">R{data.weaponLevel}</span>
            ) : (
              <Sword size={12} className="md:w-3.5 md:h-3.5" />
            )}
          </button>

          {/* Konstelasi C1 (Kiri Bawah) */}
          {isGuest ? (
            <button 
              onClick={(e) => onToggleConstellation(e, player, type, index)}
              className={`absolute bottom-1 left-1 px-1 py-0.5 md:px-1.5 md:py-1 rounded-sm shadow-md transition-all z-10 text-[9px] md:text-[10px] font-black
                ${data.isC1 
                  ? 'bg-yellow-500 text-white border border-yellow-300 shadow-[0_0_8px_rgba(234,179,8,0.8)]' 
                  : 'bg-theme-bgBase text-theme-textSub border border-transparent hover:bg-theme-bgHover'}
              `}
              title="Klik untuk Toggle C1"
            >
              {data.isC1 ? 'C1' : 'C0'}
            </button>
          ) : (
            data.isC1 && (
              <div 
                className="absolute bottom-1 left-1 px-1 py-0.5 md:px-1.5 md:py-1 rounded-sm transition-all z-10 text-[9px] md:text-[10px] font-black bg-yellow-500 text-white border border-yellow-300 shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                title="Karakter ini terdaftar sebagai C1"
              >
                C1
              </div>
            )
          )}

          {/* Tombol Hapus X (Kanan Atas) */}
          <button onClick={(e) => onRemove(e, player, type, 'picks', index)} className="absolute top-1 right-1 bg-red-600/80 p-0.5 rounded text-white opacity-0 group-hover:opacity-100 z-20">
            <X size={12} />
          </button>
        </>
      ) : ''}
    </div>
  );
}
