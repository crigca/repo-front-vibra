import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faHeart, faPlay } from '@fortawesome/free-solid-svg-icons';
import './Favorites.css';
import { useEffect } from 'react';
import { FavoriteSkeleton } from './FavoriteSkeleton';
import { useMusic } from '../../hooks';
import { useMusicContext } from '../../context';
import type { Song } from '../../types';

export function Favorites() {
  // Hook para obtener canciones del backend
  const { songs, loading, error, fetchSongs } = useMusic();

  // Context para reproducir canciones
  const { playSong } = useMusicContext();

  // Cargar canciones cuando el componente se monta
  useEffect(() => {
    // Simple: pedir 24 canciones. El backend las devuelve aleatorias automáticamente
    fetchSongs(24, 0);
  }, []);

  // Log detallado de canciones cargadas para debug
  useEffect(() => {
    if (songs.length > 0) {
      console.log('🎵 ===== CANCIONES CARGADAS =====');
      console.log(`Total: ${songs.length} canciones\n`);

      songs.forEach((song, index) => {
        console.log(`${index + 1}. "${song.title}" - ${song.artist}`);
        console.log(`   YouTube ID: ${song.youtubeId}`);
        console.log(`   Duración: ${song.duration}s (${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')})`);
        console.log(`   Género: ${song.genre || 'Sin género'}`);
        console.log(`   URL: https://www.youtube.com/watch?v=${song.youtubeId}`);
        console.log('');
      });

      console.log('================================\n');
    }
  }, [songs]);

  // Manejar estados de carga y error
  if (loading) {
    return (
      <div className="suggestionsContainer">
        <FavoriteSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="suggestionsContainer">
        <div className="error-message">
          <h3>Error al cargar canciones</h3>
          <p>{error}</p>
          <button onClick={() => fetchSongs(20, 0)}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="suggestionsContainer">
      <div>
        {/* Playlists */}
        <div className="section">
          <h3 className="sectionTitle">Playlists</h3>
          <div className="itemsGrid">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="item">
                <div className="itemCover">Portada</div>
                <p className="itemName">Nombre</p>
              </div>
            ))}
          </div>
        </div>

        <div className="suggestionsHeader">
          <h2 className="suggestionsTitle">Descubre Nueva Música</h2>
        </div>

        <div className="suggestionsGrid">
          {songs.map((song: Song) => (
            <div
              key={song.id}
              className="suggestionCard"
              onClick={() => playSong(song, songs)}
              style={{ cursor: 'pointer' }}
            >
              <div className="cardCover">
                <div className="songCover">
                  <FontAwesomeIcon icon={faMusic} className="coverIcon" />
                  <div className="playOverlay">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
              </div>

              <div className="cardContent">
                <h4 className="cardTitle">{song.title}</h4>
                <p className="cardSubtitle">{song.artist}</p>
                <div className="cardFooter">
                  <span className="cardStats">
                    {song.genre || 'Sin género'} • {Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}
                  </span>
                  <button
                    className="likeButton"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('❤️ Favorito:', song.title);
                    }}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {songs.length === 0 && !loading && (
          <div className="no-songs-message">
            <p>No hay canciones disponibles. Asegúrate de que el backend esté corriendo.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;