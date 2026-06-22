// Fungsi untuk menghitung Cost tim
export const calculateCost = (teamPicks, pesertaProfile) => {
  let cost = 0;
  teamPicks.forEach(p => {
    if (p) {
      if (p.cost) cost += p.cost; // Base cost (biasanya 1 untuk 5 Star Limited)
      if (p.weaponLevel === 1) cost += 2; // Penalti Senjata B5 R1 (+2)
      if (p.weaponLevel === 2) cost += 3; // Penalti Senjata B5 R2 (+3)
      
      // Penalti C1 (+2)
      if (p.cost === 1 && pesertaProfile && pesertaProfile.karakters) {
        const match = pesertaProfile.karakters.find(pk => pk.karakter.id === p.id);
        if (match && match.isC1) cost += 2;
      }
    }
  });
  return cost;
};

// Fungsi untuk mendapatkan ID Karakter yang tidak boleh di-pick (Locked)
export const getLockedIdsForPlayer = (draftState, settings, currentPlayer, currentHalf, playerA, playerB) => {
  let locked = [];
  const opponent = currentPlayer === 'playerA' ? 'playerB' : 'playerA';
  
  const currentPlayerProfile = currentPlayer === 'playerA' ? playerA : playerB;
  const registeredIds = (currentPlayerProfile && currentPlayerProfile.karakters) 
    ? currentPlayerProfile.karakters.map(pk => pk.karakter.id) 
    : [];

  // Pengecekan pada Pick (Tim Sendiri & Tim Lawan)
  ['firstHalf', 'secondHalf'].forEach(half => {
    // Karakter yang sudah di-pick tim sendiri
    draftState[currentPlayer][half].picks.forEach(c => {
      if (c) {
        const isTraveler = c.rarity === '5 Star Khusus' || c.nama.toLowerCase().includes('traveler');
        if (!isTraveler) {
          // Free 4-Star Rule: Boleh double pick karakter spesifik (tergantung babak yang diizinkan)
          const isFree = settings.free4StarId > 0 && c.id === settings.free4StarId && (settings.free4StarHalf === 'all' || settings.free4StarHalf === half);
          if (!isFree) {
            locked.push(c.id);
          }
        }
      }
    });

    // Karakter yang di-pick musuh (Pengecekan Mirror Match)
    draftState[opponent][half].picks.forEach(c => {
      if (c) {
        const isTraveler = c.rarity === '5 Star Khusus' || c.nama.toLowerCase().includes('traveler');
        if (!isTraveler) {
          if (half === currentHalf) {
            const isFree = settings.free4StarId > 0 && c.id === settings.free4StarId && (settings.free4StarHalf === 'all' || settings.free4StarHalf === currentHalf);
            if (c.cost === 1 && registeredIds.includes(c.id)) {
              // Pengecualian C1: Boleh Mirror Match
            } else if (isFree) {
              // Free 4-Star Rule: Boleh Mirror Match
            } else {
              locked.push(c.id);
            }
          }
        }
      }
    });
  });

  // Pengecekan pada Ban (Global Ban & Half Ban)
  // MENGGUNAKAN KONSEP "KUTUKAN YANG DITERIMA"
  // Karakter yang ada di kotak Ban milik Player A adalah karakter yang TIDAK BOLEH dipakai oleh Player A.
  
  // Helper cek kekebalan dari Ban
  const isImmuneToBan = (cId, halfChecking) => {
    if (settings.free4StarId === 0 || cId !== settings.free4StarId) return false;
    
    // Kebal Permanent Ban secara mutlak (sama seperti Traveler)
    if (halfChecking === 'all') return true;
    
    // Untuk Half Ban, cek apakah target sesuai
    return settings.free4StarHalf === 'all' || settings.free4StarHalf === halfChecking;
  };

  // Global Bans (Kutukan Permanen)
  draftState[currentPlayer].globalBans.forEach(c => {
     if(c) {
       const isTraveler = c.rarity === '5 Star Khusus' || c.nama.toLowerCase().includes('traveler');
       if (!isTraveler && !isImmuneToBan(c.id, 'all')) {
          locked.push(c.id);
       }
     }
  });

  // Half Bans (Kutukan Per Babak)
  if (draftState[currentPlayer][currentHalf] && draftState[currentPlayer][currentHalf].bans) {
    draftState[currentPlayer][currentHalf].bans.forEach(c => { 
      if(c) {
        const isTraveler = c.rarity === '5 Star Khusus' || c.nama.toLowerCase().includes('traveler');
        if (!isTraveler && !isImmuneToBan(c.id, currentHalf)) {
           locked.push(c.id);
        }
      } 
    });
  }

  return locked;
};
