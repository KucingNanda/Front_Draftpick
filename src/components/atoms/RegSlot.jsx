export default function RegSlot({ data, player, index, onSlotClick }) {
  return (
    <div 
      onClick={() => onSlotClick(player, 'registered', 'reg', index)}
      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 2xl:w-20 2xl:h-20 bg-theme-bgPanel border-2 ${data ? 'border-yellow-400 opacity-100' : 'border-yellow-600/50 opacity-70'} rounded-lg shadow-inner flex items-center justify-center hover:opacity-100 hover:border-yellow-400 transition-all cursor-pointer shrink-0 relative overflow-hidden group`}
    >
      {data ? (
        <>
          {data.imageUrl ? <img src={data.imageUrl} className="w-full h-full object-contain p-1" alt={data.nama} /> : <span className="text-[8px]">{data.nama}</span>}
          
          {/* Konstelasi C1 Badge */}
          {data.isC1 && (
            <div 
              className="absolute bottom-1 left-1 px-1 py-0.5 md:px-1.5 md:py-1 rounded-sm transition-all z-10 text-[8px] md:text-[9px] font-black bg-yellow-500 text-white border border-yellow-300 shadow-[0_0_8px_rgba(234,179,8,0.8)]"
              title="Karakter ini terdaftar sebagai C1"
            >
              C1
            </div>
          )}
        </>
      ) : ''}
    </div>
  );
}
