import { X } from 'lucide-react';

export default function BanSlot({ data, player, type, index, onSlotClick, onRemove }) {
  return (
    <div 
      onClick={() => onSlotClick(player, type, 'bans', index)}
      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 2xl:w-20 2xl:h-20 bg-red-900/30 border-2 ${data ? 'border-red-600/50 grayscale-0' : 'border-red-900/50 grayscale'} rounded-lg shadow-inner flex items-center justify-center transition-all cursor-pointer shrink-0 relative overflow-hidden group`}
    >
       {data ? (
          <>
            {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-contain p-1" alt={data.nama} /> : <span className="text-[8px]">{data.nama}</span>}
            <div className="absolute inset-0 bg-red-900/40 flex items-center justify-center pointer-events-none">
              <X size={32} className="text-red-500/70" />
            </div>
            <button onClick={(e) => onRemove(e, player, type, 'bans', index)} className="absolute bottom-1 right-1 bg-gray-100 dark:bg-gray-900/80 p-0.5 rounded text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 z-10">
              <X size={10} />
            </button>
          </>
       ) : (
         <span className="text-red-500/50 font-bold text-[10px] md:text-xs">BAN</span>
       )}
    </div>
  );
}
