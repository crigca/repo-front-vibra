import { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    _ytApiLoadingPromise?: Promise<void>;
  }
}

/** ===================== CONFIG ===================== */
const API_URL = "http://localhost:3000/music/songs?limit=25"; // <- ajustá el limit o pasalo por props/env
const API_IMAGENES_URL = "http://localhost:3000/images?limit=25";

/** Utilidad para construir miniatura sin depender de oEmbed */
const ytThumb = (id?: string) => (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");

/** Precarga de la API de YouTube */
function cargarAPIYouTube(): Promise<void> {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (!window._ytApiLoadingPromise) {
    window._ytApiLoadingPromise = new Promise<void>((resolver) => {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = () => resolver();
    });
  }
  return window._ytApiLoadingPromise!;
}

function formatearTiempo(segundosTotales: number) {
  const seg = Math.max(0, Math.floor(segundosTotales || 0));
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = seg % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

/** Tipo de canción que devuelve tu API */
export type Cancion = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  duration?: number; // en segundos (opcional)
  genre?: string;
  viewCount?: string;
  publishedAt?: string;
  audioPath?: string;
  createdAt?: string;
  updatedAt?: string;
};

export function MusicPlayer() {
  /** ======= refs & estado del player ======= */
  const playerMainRef = useRef<any>(null);
  const playerPreNextRef = useRef<any>(null);
  const playerPrePrevRef = useRef<any>(null);

  const hostMainRef = useRef<HTMLDivElement | null>(null);
  const hostPreNextRef = useRef<HTMLDivElement | null>(null);
  const hostPrePrevRef = useRef<HTMLDivElement | null>(null);

  const idIntervaloProgresoRef = useRef<number | null>(null);

  const [lista, setLista] = useState<Cancion[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);

  const [estaReproduciendo, setEstaReproduciendo] = useState(false);
  const [duracion, setDuracion] = useState(0);
  const [tiempoActual, setTiempoActual] = useState(0);

  const cancionActual = lista[indiceActual];

  /** ======= metadatos visibles ======= */
  const tituloPista = cancionActual?.title || "Cargando...";
  const autorPista = cancionActual?.artist || "";
  const miniaturaPista = ytThumb(cancionActual?.youtubeId);

  /** ============== VISUALIZADOR (carga desde API) ============== */
  const [mostrarVisualizador, setMostrarVisualizador] = useState(false);
  const abrirVisualizador = () => setMostrarVisualizador(true);
  const cerrarVisualizador = () => setMostrarVisualizador(false);

  // Imágenes provenientes de la API de /images (usamos imageUrl)
  const [imagenesVisualizador, setImagenesVisualizador] = useState<string[]>([]);

  // Carga inicial de imágenes del visualizador
  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const res = await fetch(API_IMAGENES_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const urls: string[] = Array.isArray(json?.data)
          ? json.data
              .map((item: any) => item?.imageUrl)
              .filter((u: unknown) => typeof u === "string" && !!u)
          : [];
        if (!cancelado) setImagenesVisualizador(urls);
      } catch (err) {
        console.error("Error cargando imágenes visualizador:", err);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // Precarga de imágenes en memoria para transiciones más suaves
  const cacheImagenesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  useEffect(() => {
    imagenesVisualizador.forEach((url) => {
      if (!url) return;
      if (cacheImagenesRef.current.has(url)) return;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = url;
      cacheImagenesRef.current.set(url, img);
    });
  }, [imagenesVisualizador]);

  // Índices y animación del slide
  const [indiceImagen, setIndiceImagen] = useState(0);
  const indicePrevioRef = useRef(0);
  const [animandoSlide, setAnimandoSlide] = useState(false);

  // Avance automático cada 5s sólo cuando el visualizador está abierto y hay reproducción
  useEffect(() => {
    if (!mostrarVisualizador) return;
    if (!estaReproduciendo) return;
    if (imagenesVisualizador.length < 2) return;

    const id = window.setInterval(() => {
      setAnimandoSlide(true);
      setIndiceImagen((idxAnterior) => {
        indicePrevioRef.current = idxAnterior;
        return (idxAnterior + 1) % imagenesVisualizador.length;
      });
      window.setTimeout(() => setAnimandoSlide(false), 450);
    }, 5000);

    return () => clearInterval(id);
  }, [mostrarVisualizador, estaReproduciendo, imagenesVisualizador.length]);

  // Reiniciar índice de imagen al cambiar de pista
  useEffect(() => {
    setIndiceImagen(0);
    indicePrevioRef.current = 0;
  }, [indiceActual]);

  // ESC para cerrar overlay
  useEffect(() => {
    if (!mostrarVisualizador) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMostrarVisualizador(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mostrarVisualizador]);

  /** ================== ciclo de vida ================== */
  useEffect(() => {
    let desmontado = false;

    (async () => {
      // 1) Levantamos lista desde tu API
      const listaDesdeAPI = await cargarListaDesdeAPI();
      if (desmontado) return;
      setLista(listaDesdeAPI);

      // 2) Cargamos API de YouTube y creamos players (main + preloads)
      await cargarAPIYouTube();
      if (desmontado) return;

      // MAIN
      playerMainRef.current = new window.YT.Player(hostMainRef.current!, {
        width: 0,
        height: 0,
        videoId: listaDesdeAPI[0]?.youtubeId,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, fs: 0, enablejsapi: 1 },
        events: {
          onReady: (e: any) => {
            const d = e.target.getDuration?.() || listaDesdeAPI[0]?.duration || 0;
            if (d) setDuracion(d);
          },
          onStateChange: (e: any) => {
            const ESTADO = window.YT.PlayerState;
            if (e.data === ESTADO.PLAYING) setEstaReproduciendo(true);
            if (e.data === ESTADO.PAUSED || e.data === ESTADO.ENDED) setEstaReproduciendo(false);
            if (e.data === ESTADO.ENDED) pistaSiguiente(true);
          },
        },
      });

      // PRELOAD NEXT
      playerPreNextRef.current = new window.YT.Player(hostPreNextRef.current!, {
        width: 0,
        height: 0,
        videoId: listaDesdeAPI[1]?.youtubeId || undefined,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, fs: 0, enablejsapi: 1 },
        events: {
          onReady: () => {
            // cue para cargar metadata sin reproducir
            const nextId = listaDesdeAPI[1]?.youtubeId;
            if (nextId) playerPreNextRef.current?.cueVideoById?.(nextId);
          },
        },
      });

      // PRELOAD PREV
      playerPrePrevRef.current = new window.YT.Player(hostPrePrevRef.current!, {
        width: 0,
        height: 0,
        videoId: listaDesdeAPI[listaDesdeAPI.length - 1]?.youtubeId || undefined,
        playerVars: { controls: 0, modestbranding: 1, rel: 0, fs: 0, enablejsapi: 1 },
        events: {
          onReady: () => {
            const prevId = listaDesdeAPI[listaDesdeAPI.length - 1]?.youtubeId;
            if (prevId) playerPrePrevRef.current?.cueVideoById?.(prevId);
          },
        },
      });

      iniciarPollingProgreso();
      // Inicializa los preloads en base al índice actual (0)
      refrescarPreloads(0, listaDesdeAPI);
    })();

    return () => {
      desmontado = true;
      detenerPollingProgreso();
      try {
        playerMainRef.current?.destroy?.();
        playerPreNextRef.current?.destroy?.();
        playerPrePrevRef.current?.destroy?.();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cargarListaDesdeAPI(): Promise<Cancion[]> {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const parsed: Cancion[] = Array.isArray(json) ? json : [];
      return parsed.filter((x) => !!x.youtubeId);
    } catch (err) {
      console.error("Error cargando canciones:", err);
      return [];
    }
  }

  /** ============== progreso & controles ============== */
  const iniciarPollingProgreso = () => {
    if (idIntervaloProgresoRef.current != null) return;
    idIntervaloProgresoRef.current = window.setInterval(() => {
      const p = playerMainRef.current;
      if (!p) return;
      const t = p.getCurrentTime?.() || 0;
      const d = p.getDuration?.() || duracion;
      setTiempoActual(t);
      if (d && d !== duracion) setDuracion(d);
    }, 250) as unknown as number;
  };

  const detenerPollingProgreso = () => {
    if (idIntervaloProgresoRef.current != null) {
      clearInterval(idIntervaloProgresoRef.current);
      idIntervaloProgresoRef.current = null;
    }
  };

  function normalizarIndice(n: number, total: number) {
    return ((n % total) + total) % total;
  }

  function refrescarPreloads(nuevoIndice: number, arr = lista) {
    if (!arr.length) return;
    const total = arr.length;
    const idx = normalizarIndice(nuevoIndice, total);
    const idxNext = normalizarIndice(idx + 1, total);
    const idxPrev = normalizarIndice(idx - 1, total);

    const nextId = arr[idxNext]?.youtubeId;
    const prevId = arr[idxPrev]?.youtubeId;

    // Cue en players ocultos. Nota: políticas de autoplay pueden limitar buffering real,
    // pero la metadata y parte de la caché quedan preparadas, reduciendo la latencia perceptible.
    if (playerPreNextRef.current && nextId) {
      try { playerPreNextRef.current.cueVideoById(nextId); } catch {}
    }
    if (playerPrePrevRef.current && prevId) {
      try { playerPrePrevRef.current.cueVideoById(prevId); } catch {}
    }
  }

  function cambiarPista(nuevoIndice: number, autoplay = true) {
    if (!lista.length) return;
    const total = lista.length;
    const idx = normalizarIndice(nuevoIndice, total);
    setIndiceActual(idx);
    setTiempoActual(0);

    const nextId = lista[idx].youtubeId;
    // Intento: si está cued en preNext/prePrev, igual cargamos en el main (no se puede transferir buffer entre instancias)
    if (autoplay) playerMainRef.current?.loadVideoById?.(nextId);
    else {
      // Cargamos metadata sin reproducir
      if (playerMainRef.current?.cueVideoById) playerMainRef.current.cueVideoById(nextId);
      else playerMainRef.current?.loadVideoById?.(nextId);
      playerMainRef.current?.pauseVideo?.();
    }

    if (lista[idx]?.duration) setDuracion(lista[idx].duration!);

    // Actualizamos preloads con el nuevo índice
    refrescarPreloads(idx);
  }

  const pistaSiguiente = (autoplay = true) => cambiarPista(indiceActual + 1, autoplay);
  const pistaAnterior = (autoplay = true) => cambiarPista(indiceActual - 1, autoplay);

  const alternarPlayPause = () => {
    const p = playerMainRef.current;
    if (!p) return;
    const ESTADO = window.YT.PlayerState;
    const estado = p.getPlayerState?.();
    if (estado === ESTADO.PLAYING) p.pauseVideo?.();
    else p.playVideo?.();
  };

  const onCambiarProgreso = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) || 0;
    const nuevo = Math.min(1, Math.max(0, v));
    const segundos = (duracion || 0) * nuevo;
    playerMainRef.current?.seekTo?.(segundos, true);
    setTiempoActual(segundos);
  };

  const progreso = duracion ? Math.min(1, Math.max(0, tiempoActual / duracion)) : 0;

  /** ====================== UI ====================== */
  return (
    <>
      {/* Hosts ocultos para players */}
      <div
        ref={hostMainRef}
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0 }}
        aria-hidden="true"
      />
      <div
        ref={hostPreNextRef}
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0 }}
        aria-hidden="true"
      />
      <div
        ref={hostPrePrevRef}
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", opacity: 0 }}
        aria-hidden="true"
      />

      {mostrarVisualizador && (
        <div className="Reproductor__VisualizadorOverlay" onClick={cerrarVisualizador} role="dialog" aria-modal="true">
          <div className="Reproductor__VisualizadorContenido" onClick={(e) => e.stopPropagation()}>
            <div className={`Reproductor__VisualizadorSlider ${animandoSlide ? "is-animating" : ""}`}>
              {animandoSlide && imagenesVisualizador.length > 1 && (
                <img
                  key={`prev-${indicePrevioRef.current}-${imagenesVisualizador[indicePrevioRef.current] || "ph"}`}
                  src={imagenesVisualizador[indicePrevioRef.current] || undefined}
                  alt=""
                  className="Reproductor__Slide Reproductor__Slide--out"
                  draggable={false}
                />
              )}
              <img
                key={`cur-${indiceImagen}-${imagenesVisualizador[indiceImagen] || "ph"}`}
                src={imagenesVisualizador[indiceImagen] || undefined}
                alt=""
                className="Reproductor__Slide Reproductor__Slide--in"
                draggable={false}
              />
              {/* Fallback simple si no hay imágenes */}
              {imagenesVisualizador.length === 0 && (
                <div className="Reproductor__SlideFallback">Sin imágenes disponibles</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="Reproductor__ContenedorPrincipal">
        <nav className="Reproductor__ZonaIzquierda">
          <div className="Reproductor__ContenedorMiniatura" onClick={abrirVisualizador} title="Abrir visualizador de imágenes">
            {miniaturaPista && (
              <img
                src={miniaturaPista}
                alt={tituloPista ? `Portada: ${tituloPista}` : "Portada"}
                className="Reproductor__ImagenMiniatura"
                loading="eager"
                decoding="async"
                draggable={false}
              />
            )}
          </div>
          <div className="Reproductor__ContenedorInfoPista">
            <div className="Reproductor__TituloPista">{tituloPista}</div>
            <div className="Reproductor__AutorPista">{autorPista}</div>
          </div>
        </nav>

        <nav className="Reproductor__ZonaCentral">
          <div className="Reproductor__ContenedorControles">
            <button className="Reproductor__BotonControl" onClick={() => pistaAnterior(true)}> ⏮</button>
            <button className="Reproductor__BotonControl" onClick={alternarPlayPause} disabled={!lista.length}>
              {estaReproduciendo ? "⏸" : "▶"}
            </button>
            <button className="Reproductor__BotonControl" onClick={() => pistaSiguiente(true)}> ⏭</button>
          </div>
          <div className="Reproductor__ContenedorProgreso">
            <div className="Reproductor__Tiempo Reproductor__TiempoActual">{formatearTiempo(tiempoActual)}</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progreso}
              onChange={onCambiarProgreso}
              className="Reproductor__BarraProgreso"
              disabled={!lista.length}
            />
            <div className="Reproductor__Tiempo Reproductor__TiempoTotal">{formatearTiempo(duracion)}</div>
          </div>
        </nav>

        <nav className="Reproductor__ZonaDerecha">
          <div className="Reproductor__ControlVolumen">🔊</div>
          <div className="Reproductor__ControlLista">📃</div>
          <div className="Reproductor__ControlImagenesIA" onClick={abrirVisualizador}>🖼️</div>
        </nav>
      </div>
    </>
  );
}
