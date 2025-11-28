// src/context/UserContext.tsx
import { createContext, useEffect, useState, useRef, useCallback, type ReactNode } from "react";

// Estructura del usuario
export interface User {
  id: string;
  email: string;
  username: string;
  profileImage?: string;
  privacy: "public" | "private" | "followers" | "followed" | "mutuals";
  following:number;
  followers:number
}

// Qué datos y funciones compartirá el contexto
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Creamos el contexto
export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Tiempo de inactividad en milisegundos (60 minutos)
const INACTIVITY_TIMEOUT = 60 * 60 * 1000;

// Provider del usuario
export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Función de logout
  const handleInactivityLogout = useCallback(async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error en logout por inactividad:', err);
    }
    // Limpiar cookie y redirigir
    document.cookie = 'token_vibra=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = 'https://vibra-front-vercel.vercel.app';
  }, []);

  // Actualizar última actividad
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Verificar inactividad
  useEffect(() => {
    if (!currentUser) return;

    // Eventos de actividad del usuario
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Verificar cada minuto si hay inactividad
    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        console.log('⏰ Sesión cerrada por inactividad (60 min)');
        handleInactivityLogout();
      }
    }, 60 * 1000); // Verificar cada minuto

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [currentUser, updateActivity, handleInactivityLogout]);

  useEffect(() => {
    const controller = new AbortController();

    // Leer token de la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      // Guardar token en cookie
      document.cookie = `token_vibra=${tokenFromUrl}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      // Limpiar la URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    const loadUser = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000';
        const resp = await fetch(`${backendUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`HTTP ${resp.status}: ${text}`);
        }

        const data = await resp.json();
        console.log("Current user data:", JSON.stringify(data, null, 2));
        setCurrentUser(data);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        console.error(err);
      }
    };

    loadUser();
    return () => controller.abort();
  }, []);

  return (
    <UserContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
