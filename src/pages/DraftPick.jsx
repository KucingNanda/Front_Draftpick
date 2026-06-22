import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Download, Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { useDraftLogic } from '../hooks/useDraftLogic';
import { usePdfExport } from '../hooks/usePdfExport';
import TeamPanel from '../components/organisms/TeamPanel';
import CharacterSelectorModal from '../components/organisms/CharacterSelectorModal';
import ArenaHeader from '../components/organisms/ArenaHeader';

export default function DraftPick() {
  const navigate = useNavigate();
  const { isGuest, isWasit, isPeserta } = useAuth();
  const api = useApi();
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [bgms, setBgms] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    api('http://localhost:3000/api/bgm')
      .then(res => res.json())
      .then(data => setBgms(data || []))
      .catch(err => console.error("Error fetching bgm:", err));
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleNextTrack = () => {
    if (bgms.length > 0) {
      setCurrentTrackIndex((prev) => (prev + 1) % bgms.length);
    }
  };

  const currentBgm = bgms.length > 0 ? bgms[currentTrackIndex] : null;

  const {
    pesertas,
    playerA, playerB,
    draftState,
    settings,
    activeSlot, setActiveSlot,
    searchQuery, setSearchQuery,
    filteredModalCharacters,
    calculateCost,
    handleSelectPeserta,
    handleSlotClick,
    handleSelectCharacter,
    handleRemoveCharacter,
    toggleWeapon,
    handleNameChange
  } = useDraftLogic();

  const checkAllFilled = (playerObj) => {
    if (!playerObj) return false;
    return playerObj.registered.every(c => c !== null) &&
           playerObj.globalBans.every(c => c !== null) &&
           playerObj.firstHalf.picks.every(c => c !== null) &&
           playerObj.firstHalf.bans.every(c => c !== null) &&
           playerObj.secondHalf.picks.every(c => c !== null) &&
           playerObj.secondHalf.bans.every(c => c !== null);
  };
  
  const isDraftComplete = checkAllFilled(draftState.playerA) && checkAllFilled(draftState.playerB);

  const { exportToPDF } = usePdfExport();

  const handleExit = () => {
    Swal.fire({
      title: 'Keluar dari Draft?',
      text: "Proses draft yang sedang berjalan akan hilang!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Lanjut Draft',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0f172a] text-white flex flex-col overflow-hidden font-sans">
      
      {/* TOP HEADER */}
      <ArenaHeader 
        currentBgm={currentBgm}
        bgms={bgms}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        handleNextTrack={handleNextTrack}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        volume={volume}
        setVolume={setVolume}
        draftState={draftState}
        isDraftComplete={isDraftComplete}
        exportToPDF={exportToPDF}
        handleExit={handleExit}
        playerA={playerA}
        playerB={playerB}
      />

      {/* AUDIO BGM (Playlist Mode) */}
      {currentBgm && (
        <audio 
          ref={audioRef}
          src={currentBgm.url} 
          autoPlay 
          loop={bgms.length === 1}
          onEnded={handleNextTrack}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden" 
        />
      )}

      {/* ARENA CONTENT */}
      <div id="capture-arena" className="flex-1 flex overflow-hidden relative">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* LEFT HALF: Player A */}
        <div className="w-1/2 bg-gray-900/40 border-r border-gray-800 relative z-10 flex shrink-0">
          <TeamPanel 
            playerKey="playerA" 
            pesertaProfile={playerA} 
            pesertas={pesertas}
            glowColor="bg-blue-500" 
            draftState={draftState}
            settings={settings}
            calculateCost={calculateCost}
            onSelectPeserta={handleSelectPeserta}
            onSlotClick={handleSlotClick}
            onRemoveCharacter={handleRemoveCharacter}
            onToggleWeapon={toggleWeapon}
            isGuest={isGuest}
            onNameChange={handleNameChange}
          />
        </div>

        {/* RIGHT HALF: Player B */}
        <div className="w-1/2 bg-gray-900/40 relative z-10 flex shrink-0">
          <TeamPanel 
            playerKey="playerB" 
            pesertaProfile={playerB} 
            pesertas={pesertas}
            glowColor="bg-red-500" 
            draftState={draftState}
            settings={settings}
            calculateCost={calculateCost}
            onSelectPeserta={handleSelectPeserta}
            onSlotClick={handleSlotClick}
            onRemoveCharacter={handleRemoveCharacter}
            onToggleWeapon={toggleWeapon}
            isGuest={isGuest}
            onNameChange={handleNameChange}
          />
        </div>
      </div>

      {/* MODAL CHARACTER SELECTOR */}
      <CharacterSelectorModal 
        activeSlot={activeSlot}
        playerA={playerA}
        playerB={playerB}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredModalCharacters={filteredModalCharacters}
        onClose={() => setActiveSlot(null)}
        onSelectCharacter={handleSelectCharacter}
      />

    </div>
  );
}
