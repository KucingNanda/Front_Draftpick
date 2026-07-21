import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useDraftData } from './useDraftData';
import { calculateCost, getLockedIdsForPlayer } from '../utils/draftRules';
import { useAuth } from '../context/AuthContext';

export function useDraftLogic() {
  const { isGuest } = useAuth();
  const { karakters, pesertas, settings } = useDraftData();
  
  const [playerA, setPlayerA] = useState(isGuest ? { id: 'guestA', nama: 'Player A' } : null);
  const [playerB, setPlayerB] = useState(isGuest ? { id: 'guestB', nama: 'Player B' } : null);

  const [draftState, setDraftState] = useState({
    phase: 'REGISTRATION',
    playerA: {
      globalBans: Array(1).fill(null),
      registered: Array(8).fill(null),
      firstHalf: { picks: Array(4).fill(null), bans: Array(2).fill(null) },
      secondHalf: { picks: Array(4).fill(null), bans: Array(2).fill(null) }
    },
    playerB: {
      globalBans: Array(1).fill(null),
      registered: Array(8).fill(null),
      firstHalf: { picks: Array(4).fill(null), bans: Array(2).fill(null) },
      secondHalf: { picks: Array(4).fill(null), bans: Array(2).fill(null) }
    }
  });

  const [activeSlot, setActiveSlot] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (draftState.phase === 'REGISTRATION') {
      const aFull = draftState.playerA.registered.every(c => c !== null);
      const bFull = draftState.playerB.registered.every(c => c !== null);
      if (aFull && bFull) {
        setDraftState(prev => ({ ...prev, phase: 'DRAFTING' }));
      }
    }
  }, [draftState.playerA.registered, draftState.playerB.registered, draftState.phase]);

  const handleNameChange = (playerKey, newName) => {
    if (playerKey === 'playerA') {
      setPlayerA(prev => ({ ...prev, nama: newName }));
    } else {
      setPlayerB(prev => ({ ...prev, nama: newName }));
    }
  };

  const handleSelectPeserta = (playerKey, pesertaIdStr) => {
    const peserta = pesertas.find(p => p.id.toString() === pesertaIdStr) || null;
    
    if (playerKey === 'playerA') setPlayerA(peserta);
    if (playerKey === 'playerB') setPlayerB(peserta);

    if (peserta && peserta.karakters) {
      setDraftState(prev => {
        const newState = structuredClone(prev);
        const regSlots = Array(8).fill(null);
        peserta.karakters.forEach((pk, idx) => {
          if (idx < 8 && pk.karakter) {
            regSlots[idx] = pk.karakter;
          }
        });
        newState[playerKey].registered = regSlots;
        return newState;
      });
    } else {
      setDraftState(prev => {
        const newState = structuredClone(prev);
        newState[playerKey].registered = Array(8).fill(null);
        return newState;
      });
    }
  };

  const handleSlotClick = (player, type, action, index) => {
    const selectedProfile = player === 'playerA' ? playerA : playerB;
    if (!selectedProfile && !isGuest) {
      Swal.fire({
        title: 'Perhatian',
        text: 'Pilih Peserta terlebih dahulu dari dropdown!',
        icon: 'warning',
        background: '#1e293b',
        color: '#fff'
      });
      return;
    }

    if (action === 'picks' && draftState[player][type].picks[index]) {
       return; 
    }
    
    if (action === 'globalBans' && draftState[player].globalBans[index]) {
       return;
    }
    
    setActiveSlot({ player, type, action, index });
    setSearchQuery('');
  };

  const handleSelectCharacter = (karakter) => {
    if (!activeSlot) return;
    
    const { player, type, action, index } = activeSlot;
    const selectedProfile = player === 'playerA' ? playerA : playerB;
    
    const checkIsC1 = (charId, profile) => {
      if (!profile || !profile.karakters) return false;
      const match = profile.karakters.find(pk => pk.karakter.id === charId);
      return match ? match.isC1 : false;
    };
    const charWithC1 = { ...karakter, isC1: checkIsC1(karakter.id, selectedProfile) };

    if (action === 'picks') {
      const currentTeamPicks = [...draftState[player][type].picks];
      currentTeamPicks[index] = { ...charWithC1, weaponLevel: 0 };
      
      if (calculateCost(currentTeamPicks, selectedProfile) > settings.maxCost) {
        Swal.fire({
          title: 'Cost Tim Penuh',
          text: `Batas maksimal tim adalah ${settings.maxCost} Cost!`,
          icon: 'error',
          background: '#1e293b',
          color: '#fff'
        });
        return;
      }
    }

    setDraftState(prev => {
      const newState = structuredClone(prev);
      if (action === 'reg') {
        newState[player].registered[index] = charWithC1;
      } else if (action === 'globalBans') {
        newState[player].globalBans[index] = charWithC1;
      } else {
        newState[player][type][action][index] = (action === 'picks') 
          ? { ...charWithC1, weaponLevel: 0 } 
          : charWithC1;
      }
      return newState;
    });

    setActiveSlot(null);
  };

  const handleRemoveCharacter = (e, player, type, action, index) => {
    e.stopPropagation(); 
    setDraftState(prev => {
      const newState = structuredClone(prev);
      if (action === 'reg') {
        newState[player].registered[index] = null;
      } else if (action === 'globalBans') {
        newState[player].globalBans[index] = null;
      } else {
        newState[player][type][action][index] = null;
      }
      return newState;
    });
  };

  const toggleWeapon = (e, player, type, index) => {
    e.stopPropagation();
    setDraftState(prev => {
      const newState = structuredClone(prev);
      const char = newState[player][type].picks[index];
      const selectedProfile = player === 'playerA' ? playerA : playerB;
      
      if (char) {
        let currentLevel = char.weaponLevel || 0;
        let nextLevel = currentLevel + 1;
        if (nextLevel > 2) nextLevel = 0;
        
        // Buat copy dari array picks untuk simulasi perhitungan
        const simulatedPicks = [...newState[player][type].picks];
        simulatedPicks[index] = { ...char, weaponLevel: nextLevel };
        
        // Cegah kenaikan level jika cost melebihi batas (Kecuali jika kembali ke 0)
        if (nextLevel > 0 && calculateCost(simulatedPicks, selectedProfile) > settings.maxCost) {
          Swal.fire({
            title: 'Cost Penuh',
            text: `Batas maksimal tim adalah ${settings.maxCost} Cost! Tidak bisa menambah Level Senjata B5.`,
            icon: 'error',
            background: '#1e293b',
            color: '#fff'
          });
          return prev; // Batalkan perubahan
        }
        
        // Simpan langsung state objek baru di index
        newState[player][type].picks[index] = { ...char, weaponLevel: nextLevel };
      }
      return newState;
    });
  };

  const toggleConstellation = (e, player, type, index) => {
    e.stopPropagation();
    setDraftState(prev => {
      const newState = structuredClone(prev);
      const char = newState[player][type].picks[index];
      const selectedProfile = player === 'playerA' ? playerA : playerB;
      
      if (char) {
        let currentC1 = char.isC1 || false;
        let nextC1 = !currentC1;
        
        const simulatedPicks = [...newState[player][type].picks];
        simulatedPicks[index] = { ...char, isC1: nextC1 };
        
        if (nextC1 && calculateCost(simulatedPicks, selectedProfile) > settings.maxCost) {
          Swal.fire({
            title: 'Cost Penuh',
            text: `Batas maksimal tim adalah ${settings.maxCost} Cost! Tidak bisa mengaktifkan C1.`,
            icon: 'error',
            background: '#1e293b',
            color: '#fff'
          });
          return prev;
        }
        
        newState[player][type].picks[index] = { ...char, isC1: nextC1 };
      }
      return newState;
    });
  };

  const filteredModalCharacters = useMemo(() => {
    if (!activeSlot) return [];
    
    const { player, action } = activeSlot;
    const selectedProfile = player === 'playerA' ? playerA : playerB;
    
    let chars = karakters.filter(k => k.nama.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (action === 'reg') {
      const currentRegIds = draftState[player].registered.map(c => c ? c.id : null);
      return chars.filter(k => k.cost === 1 && !currentRegIds.includes(k.id));
    } else {
      // Jika aturan Free4Star aktif, karakter disembunyikan dari daftar saat fase BAN (hanya jika ia kebal)
      if ((action === 'bans' || action === 'globalBans') && settings.free4StarId > 0) {
        let isImmune = false;
        if (settings.free4StarHalf === 'all') {
          isImmune = true;
        } else if (action === 'globalBans') {
          // Aturan: Karakter Special 4-Star mutlak tidak bisa di Global Ban (seperti Traveler)
          isImmune = true;
        } else if (action === 'bans' && settings.free4StarHalf === activeSlot.type) {
          isImmune = true;
        }

        if (isImmune) {
          chars = chars.filter(k => k.id !== settings.free4StarId);
        }
      }

      let lockedIds = getLockedIdsForPlayer(draftState, settings, player, activeSlot.type, playerA, playerB);

      let availableChars = chars.filter(k => !lockedIds.includes(k.id));

      if (!isGuest && selectedProfile && selectedProfile.karakters) {
        const registeredIds = selectedProfile.karakters.map(pk => pk.karakter.id);
        availableChars = availableChars.filter(k => {
          if (k.cost === 1) {
            return registeredIds.includes(k.id);
          }
          return true;
        });
      }

      return availableChars;
    }
  }, [karakters, activeSlot, searchQuery, draftState, playerA, playerB, settings]);

  return {
    karakters, pesertas,
    playerA, playerB,
    draftState,
    settings,
    activeSlot, setActiveSlot,
    searchQuery, setSearchQuery,
    filteredModalCharacters,
    calculateCost,
    handleSelectPeserta,
    handleNameChange,
    handleSlotClick,
    handleSelectCharacter,
    handleRemoveCharacter,
    toggleWeapon,
    toggleConstellation
  };
}
