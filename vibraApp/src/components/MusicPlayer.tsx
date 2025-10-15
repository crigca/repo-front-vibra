import { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";
import { useMusicContext } from '../context';

const API_BASE_URL = 'http://localhost:3000';

function formatTime(totalSeconds: number) {
  const sec = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function MusicPlayer() {
  // Conectar con el MusicContext
  const { currentSong, playlist } = useMusicContext();

  /** Audio element ref */
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** Estado de reproducción y metadatos */
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  /** Info visual (título / canal / miniatura) */
  const [trackTitle, setTrackTitle] = useState("Selecciona una canción");
  const [trackAuthor, setTrackAuthor] = useState("");
  const [trackThumb, setTrackThumb] = useState<string>("");

  /** useEffect que escucha cambios en currentSong del Context */
  useEffect(() => {
    if (!currentSong || !currentSong.youtubeId || !audioRef.current) {
      console.log('⚠️ MusicPlayer: No se puede reproducir', currentSong);
      return;
    }

    console.log('🎵 MusicPlayer reproduciendo:', currentSong.title);
    console.log('   YouTube ID:', currentSong.youtubeId);
    console.log('   Audio Path:', currentSong.audioPath);

    // Actualizar la info visual
    setTrackTitle(currentSong.title);
    setTrackAuthor(currentSong.artist);

    // Obtener thumbnail de YouTube
    const thumbUrl = `https://img.youtube.com/vi/${currentSong.youtubeId}/hqdefault.jpg`;
    setTrackThumb(thumbUrl);

    // Cargar audio desde el servidor
    const audioUrl = currentSong.audioPath
      ? `${API_BASE_URL}/${currentSong.audioPath}`
      : `${API_BASE_URL}/audio/${currentSong.youtubeId}.mp3`;

    audioRef.current.src = audioUrl;
    audioRef.current.load();

    // Reproducir automáticamente
    audioRef.current.play().catch((error) => {
      console.error('❌ Error al reproducir:', error);
    });

  }, [currentSong]);

  /** Event handlers para el audio element */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log('✅ Audio loaded, duration:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('✅ Audio playing');
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('⏸️ Audio paused');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      console.log('⏹️ Audio ended');
      // Aquí podrías llamar a nextTrack() si quieres auto-avance
    };

    const handleError = (e: Event) => {
      console.error('❌ Audio error:', e);
      const target = e.target as HTMLAudioElement;
      if (target.error) {
        console.error('   Error code:', target.error.code);
        console.error('   Error message:', target.error.message);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error('❌ Error al reproducir:', error);
      });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    const newTime = pct * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Audio element (oculto, controlado por JS) */}
      <audio
        ref={audioRef}
        preload="auto"
        style={{ display: 'none' }}
      />

      {/* UI del reproductor */}
      <div className="MusicPlayer__MainContainer">
        <nav className="MusicPlayer__LeftNav">
          <div className="MusicPlayer__albumArtContainer">
            {trackThumb && (
              <img
                src={trackThumb}
                alt={trackTitle ? `Cover: ${trackTitle}` : "Cover"}
                className="MusicPlayer__albumArtImage"
                loading="eager"
                decoding="async"
              />
            )}
          </div>
          <div className="MusicPlayer__trackInfoContainer">
            <div className="MusicPlayer__trackTitle">{trackTitle}</div>
            <div className="MusicPlayer__artistName">{trackAuthor}</div>
          </div>
        </nav>

        <nav className="MusicPlayer__CenterNav">
          <div className="MusicPlayer__musicControlsContainer">
            <div
              className="MusicPlayer__button_backTrack"
              id="MusicPlayer__button_backTrack"
              onClick={() => console.log('TODO: Previous track')}
              role="button"
              title="Anterior"
              aria-label="Anterior"
            >
              ⏮
            </div>

            <div
              className="MusicPlayer__button_playStop"
              id="MusicPlayer__button_playStop"
              onClick={togglePlayPause}
              role="button"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? "⏸" : "▶"}
            </div>

            <div
              className="MusicPlayer__button_nextTrack"
              id="MusicPlayer__button_nextTrack"
              onClick={() => console.log('TODO: Next track')}
              role="button"
              title="Siguiente"
              aria-label="Siguiente"
            >
              ⏭
            </div>
          </div>

          {/* Barra de progreso + tiempos */}
          <div className="MusicPlayer__progressBarContainer">
            <div className="MusicPlayer__time MusicPlayer__currentTime">{formatTime(currentTime)}</div>

            <div
              className="MusicPlayer__progressTrack"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
              onClick={handleSeek}
              title="Click para buscar en la pista"
            >
              <div className="MusicPlayer__progressFill" style={{ width: `${progress}%` }} />
            </div>

            <div className="MusicPlayer__time MusicPlayer__totalTime">{formatTime(duration)}</div>
          </div>
        </nav>

        <nav className="MusicPlayer__RightNav">
          <div className="MusicPlayer__volumeControl">🔊</div>
          <div className="MusicPlayer__playlistControl">📃</div>
          <div className="MusicPlayer__iaImagesControl">🖼️</div>
        </nav>
      </div>
    </>
  );
}
