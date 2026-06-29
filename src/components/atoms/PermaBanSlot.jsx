import { X } from 'lucide-react';

export default function PermaBanSlot({ data, player, index, onSlotClick, onRemove }) {
  return (
    <div 
      onClick={() => onSlotClick(player, 'globalBans', 'globalBans', index)}
      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 2xl:w-32 2xl:h-32 bg-red-900/40 border-2 ${data ? 'border-red-500 grayscale-0 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-red-900/60 grayscale border-dashed hover:border-red-500 hover:bg-red-900/60'} rounded-xl shadow-inner flex items-center justify-center transition-all cursor-pointer shrink-0 relative overflow-hidden group`}
    >
       {data ? (
          <>
            {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-contain p-1" alt={data.nama} /> : <span className="text-xs md:text-sm font-bold text-center p-1">{data.nama}</span>}
            <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center pointer-events-none">
              <X size={48} className="text-red-500/80 drop-shadow-md" />
            </div>
            <button onClick={(e) => onRemove(e, player, 'globalBans', 'globalBans', index)} className="absolute bottom-2 right-2 bg-gray-100 dark:bg-gray-900/90 p-1 rounded md:rounded-md text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-red-400">
              <X size={16} />
            </button>
          </>
       ) : (
         <span className="text-red-500/50 font-bold tracking-widest text-xs md:text-sm opacity-50 group-hover:opacity-100">BAN</span>
       )}
    </div>
  );
}
