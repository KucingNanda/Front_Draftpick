import { User } from 'lucide-react';
import RegSlot from '../atoms/RegSlot';
import PickSlot from '../atoms/PickSlot';
import BanSlot from '../atoms/BanSlot';
import PermaBanSlot from '../atoms/PermaBanSlot';

export default function TeamPanel({ 
  playerKey, 
  pesertaProfile, 
  pesertas,
  glowColor, 
  draftState,
  settings,
  calculateCost,
  onSelectPeserta,
  onSlotClick,
  onRemoveCharacter,
  onToggleWeapon,
  isGuest,
  onNameChange
}) {
  const isRightSide = playerKey === 'playerB';
  const state = draftState[playerKey];
  
  const fhCost = calculateCost(state.firstHalf.picks, pesertaProfile);
  const shCost = calculateCost(state.secondHalf.picks, pesertaProfile);

  return (
    <div className={`flex flex-col h-full w-full px-6 py-4 md:py-6 ${isRightSide ? 'items-end' : 'items-start'}`}>
      
      {/* Dropdown Nama Peserta */}
      <div className={`flex items-center gap-3 shrink-0 ${isRightSide ? 'flex-row-reverse' : ''}`}>
        <div className={`p-2 md:p-3 rounded-full ${glowColor} bg-opacity-20 backdrop-blur-md`}>
          <User size={24} className="text-gray-900 dark:text-white" />
        </div>
        {isGuest ? (
          <input 
            type="text"
            value={pesertaProfile ? pesertaProfile.nama : ''}
            onChange={(e) => onNameChange(playerKey, e.target.value)}
            placeholder={`Nama ${playerKey === 'playerA' ? 'Player A' : 'Player B'}`}
            className={`bg-transparent text-xl md:text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-500 focus:border-white focus:outline-none transition-colors w-full max-w-[250px] ${isRightSide ? 'text-right' : 'text-left'}`}
          />
        ) : (
          <select 
            value={pesertaProfile ? pesertaProfile.id : ''}
            onChange={(e) => onSelectPeserta(playerKey, e.target.value)}
            className={`bg-transparent text-xl md:text-2xl font-bold text-gray-900 dark:text-white border-b-2 border-transparent hover:border-gray-500 focus:border-white focus:outline-none transition-colors w-full max-w-[250px] ${isRightSide ? 'text-right' : 'text-left'}`}
          >
            <option value="" className="text-gray-900">-- Pilih Peserta --</option>
            {pesertas.map(p => (
              <option key={p.id} value={p.id} className="text-gray-900">{p.nama}</option>
            ))}
          </select>
        )}
      </div>

      {/* Kontainer Tim & Registrasi */}
      <div className={`flex flex-col flex-1 w-full justify-evenly mt-2 ${isRightSide ? 'items-end' : 'items-start'}`}>
        
        {/* Row: Registrasi & Perma Ban (Sejajar) */}
        <div className={`flex items-start gap-6 lg:gap-12 w-full ${isRightSide ? 'flex-row-reverse' : 'justify-start'}`}>
          
          {/* Registrasi 5 Star Limited */}
          <div className={`flex flex-col ${isRightSide ? 'items-end' : 'items-start'}`}>
            <h3 className="text-yellow-500/80 font-bold mb-2 tracking-widest uppercase text-xs md:text-sm">Registered Limited</h3>
            <div className={`grid grid-cols-4 gap-2 ${isRightSide ? 'justify-items-end' : 'justify-items-start'}`}>
              {state.registered.map((data, i) => (
                <RegSlot key={`reg-${i}`} index={i} data={data} player={playerKey} onSlotClick={onSlotClick} />
              ))}
            </div>
          </div>

          {/* Permanent Ban */}
          <div className={`flex flex-col ${isRightSide ? 'items-end' : 'items-start'}`}>
            <h3 className="text-red-500/90 font-bold mb-2 tracking-widest uppercase text-xs md:text-sm text-center">Permanent Ban</h3>
            <div className="flex gap-2">
              {state.globalBans.map((data, i) => (
                <PermaBanSlot key={`perma-${i}`} index={i} data={data} player={playerKey} onSlotClick={onSlotClick} onRemove={onRemoveCharacter} />
              ))}
            </div>
          </div>

        </div>

        <div className="w-3/4 h-px bg-gray-200 dark:bg-gray-700/50"></div>

        {/* First Half Team */}
        <div className={`flex flex-col ${isRightSide ? 'items-end' : 'items-start'}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-gray-400 dark:text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-xs md:text-sm">First Half</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${fhCost > settings.maxCost ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>Cost: {fhCost}/{settings.maxCost}</span>
          </div>
          <div className={`flex gap-3 items-center ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <div className="flex gap-2">
              {state.firstHalf.picks.map((data, i) => (
                <PickSlot key={`fh-pick-${i}`} index={i} data={data} player={playerKey} type="firstHalf" onSlotClick={onSlotClick} onRemove={onRemoveCharacter} onToggleWeapon={onToggleWeapon} />
              ))}
            </div>
            <div className="flex gap-2 opacity-90">
              {state.firstHalf.bans.map((data, i) => (
                <BanSlot key={`fh-ban-${i}`} index={i} data={data} player={playerKey} type="firstHalf" onSlotClick={onSlotClick} onRemove={onRemoveCharacter} />
              ))}
            </div>
          </div>
        </div>

        {/* Second Half Team */}
        <div className={`flex flex-col ${isRightSide ? 'items-end' : 'items-start'}`}>
          <div className={`flex items-center gap-3 mb-2 ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-gray-400 dark:text-gray-500 dark:text-gray-400 font-bold tracking-widest uppercase text-xs md:text-sm">Second Half</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${shCost > settings.maxCost ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>Cost: {shCost}/{settings.maxCost}</span>
          </div>
          <div className={`flex gap-3 items-center ${isRightSide ? 'flex-row-reverse' : ''}`}>
            <div className="flex gap-2">
              {state.secondHalf.picks.map((data, i) => (
                <PickSlot key={`sh-pick-${i}`} index={i} data={data} player={playerKey} type="secondHalf" onSlotClick={onSlotClick} onRemove={onRemoveCharacter} onToggleWeapon={onToggleWeapon} />
              ))}
            </div>
            <div className="flex gap-2 opacity-90">
              {state.secondHalf.bans.map((data, i) => (
                <BanSlot key={`sh-ban-${i}`} index={i} data={data} player={playerKey} type="secondHalf" onSlotClick={onSlotClick} onRemove={onRemoveCharacter} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
