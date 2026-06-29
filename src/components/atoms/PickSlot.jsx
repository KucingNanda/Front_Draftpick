import { X, Sword } from 'lucide-react';

export default function PickSlot({ data, player, type, index, onSlotClick, onRemove, onToggleWeapon }) {
  return (
    <div 
      onClick={() => onSlotClick(player, type, 'picks', index)}
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 2xl:w-32 2xl:h-32 bg-slate-100 dark:bg-gray-800 border-2 ${data ? 'border-blue-500/50' : 'border-slate-300 dark:border-gray-700'} rounded-xl shadow-inner flex flex-col items-center justify-center hover:border-blue-400 transition-all cursor-pointer shrink-0 relative overflow-hidden group`}
    >
      {data ? (
        <>
          {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-contain p-1" alt={data.nama} /> : <span className="text-xs">{data.nama}</span>}
          {/* Ikon Senjata B5 Toggle */}
          <button 
            onClick={(e) => onToggleWeapon(e, player, type, index)}
            className={`absolute top-1 right-1 p-1.5 rounded-md backdrop-blur shadow-md transition-all z-10 
              ${!data.weaponLevel ? 'bg-slate-300 dark:bg-gray-900/60 text-gray-400 dark:text-slate-500 dark:text-gray-400 hover:bg-gray-200 dark:bg-gray-700/80' : ''}
              ${data.weaponLevel === 1 ? 'bg-yellow-500/80 text-white border border-yellow-400' : ''}
              ${data.weaponLevel === 2 ? 'bg-orange-600/90 text-slate-800 dark:text-white border border-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.6)]' : ''}
            `}
            title="Klik untuk Toggle Senjata B5 (0 -> R1 -> R2)"
          >
            {data.weaponLevel > 0 ? (
              <span className="text-[10px] font-black tracking-tighter">R{data.weaponLevel}</span>
            ) : (
              <Sword size={14} />
            )}
          </button>
          {/* Tombol Hapus X */}
          <button onClick={(e) => onRemove(e, player, type, 'picks', index)} className="absolute bottom-1 right-1 bg-red-600/80 p-0.5 rounded text-white opacity-0 group-hover:opacity-100">
            <X size={12} />
          </button>
        </>
      ) : ''}
    </div>
  );
}
