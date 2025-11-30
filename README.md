# VIBRA - Frontend

Plataforma de música con descubrimiento inteligente, gestión de playlists y reproductor integrado.
Este repositorio cuenta con una wiki donde se detalla toda su documentacion en: https://deepwiki.com/crigca/repo-front-vibra
Asimismo, este proyecto cuenta con un informe tecnico: https://docs.google.com/document/d/1__hA0XD2aFfMkWAgLew-wv83zOdFjg64Gf1wZH8nOQQ/edit?usp=drive_link

** Link al proyecto en producción:** https://vibra-kohl.vercel.app

---

## Estructura del Proyecto

```
front/
├── vibraFront/    # Landing Page + Login (Puerto 5173)
│   ├── Landing page estática con presentación
│   ├── LoginModal (Google OAuth + Email/Password)
│   ├── RegisterModal con verificación de email
│   └── ResetPassword (recuperación de contraseña)
│
└── vibraApp/      # Aplicación Principal (Puerto 5174)
    ├── Descubrimiento de música por 65 géneros
    ├── Búsqueda inteligente (BD + YouTube)
    ├── Gestión de playlists personalizadas
    └── Reproductor de música integrado
```

---

## Stack Tecnológico

### **vibraApp (Aplicación Principal)**
- **React 19** + **TypeScript 5**
- **Vite 5** - Build tool ultrarrápido
- **Axios** - HTTP client con interceptors
- **React Router 6** - Navegación SPA
- **Font Awesome 6** - Iconografía
- **CSS Modules** - Estilos aislados por componente
- **Context API** - State management global

### **vibraFront (Landing Page)**
- **React 19** + **TypeScript 5**
- **Vite 5** - Build tool
- **@react-oauth/google** - Autenticación OAuth 2.0
- **React Router 6** - Navegación
- **Vercel** - Deploy

---

## Instalación y Setup

### **Prerequisitos**
- Node.js 18+
- npm o yarn
- Backend corriendo en `http://localhost:3000`

### **1. Instalar dependencias**

```bash
# Landing Page
cd front/vibraFront
npm install

# Aplicación Principal
cd ../vibraApp
npm install
```

### **2. Configurar variables de entorno**

**`vibraApp/.env`:**
```env
VITE_API_URL=http://localhost:3000
```

**`vibraFront/.env`:**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_URL=https://vibra-app-ten.vercel.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### **3. Iniciar servidores de desarrollo**

```bash
# Terminal 1 - Landing Page (Puerto 5173)
cd vibraFront
npm run dev

# Terminal 2 - App Principal (Puerto 5174)
cd vibraApp
npm run dev
```

### **URLs de desarrollo**
- Landing Page: **http://localhost:5173**
- App Principal: **http://localhost:5174**
- Backend API: **http://localhost:3000**

---

## Flujo de Autenticación

VIBRA soporta **dos métodos de autenticación**:

### **Google OAuth 2.0**
1. Usuario hace click en "Sign in with Google"
2. Google abre popup de autenticación
3. Frontend envía `id_token` al backend
4. Backend verifica y genera JWT
5. Frontend redirige a vibraApp

### **Email + Contraseña**

#### Registro
1. Usuario completa formulario (username, email, password)
2. Backend envía código de verificación de 6 dígitos
3. Usuario ingresa el código
4. Email verificado → redirige a vibraApp

#### Login
1. Usuario ingresa email y password
2. Si email no verificado → muestra paso de verificación
3. Si credenciales válidas → redirige a vibraApp

#### Recuperar Contraseña
1. Click en "¿Olvidaste tu contraseña?"
2. Ingresa email → recibe link de recuperación
3. Click en link → página `/reset-password`
4. Ingresa nueva contraseña → redirige a login

---

## Funcionalidades Principales

### **1. Descubrimiento de Música por Géneros**

65 géneros disponibles organizados en familias:

- **Metal:** Heavy Metal, Death Metal, Thrash Metal, Black Metal
- **Rock:** Rock, Rock Argentino, Alternative Rock, Indie Rock
- **Latino:** Cumbia, Reggaeton, Salsa, Bachata, Merengue
- **Electrónica:** Techno, House, Trance, Dubstep, EDM
- **Otros:** Hip Hop, Rap, Trap, Jazz, Blues, Country, K-pop, J-pop

### **2. Búsqueda Inteligente**

Sistema híbrido:
1. Busca primero en BD local (rápido)
2. Luego busca en YouTube (completo)
3. Permite agregar canciones de YouTube a BD

### **3. Gestión de Playlists**

- Máximo 15 playlists por usuario
- Máximo 30 canciones por playlist
- Nombres únicos por usuario
- Mosaico automático con primeras 4 canciones
- Playlists públicas y privadas

### **4. Reproductor de Música**

- Reproducción continua
- Controles: Play/Pause, Next, Previous
- Barra de progreso interactiva
- Cola de reproducción
- Volumen ajustable

---

## Integración con Backend

### **Endpoints Utilizados**

**Música (públicos):**
```
GET  /music/search-smart?query=...&maxResults=20
GET  /music/random?genre=rock&limit=10
GET  /music/songs
```

**Playlists (requieren autenticación):**
```
GET    /playlists
POST   /playlists
PUT    /playlists/:id
DELETE /playlists/:id
```

**Autenticación:**
```
POST /auth/google
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/me
```

---

## Build para Producción

```bash
# Landing Page
cd vibraFront
npm run build
# Output: vibraFront/dist/

# App Principal
cd vibraApp
npm run build
# Output: vibraApp/dist/
```

Deploy automático en **Vercel** al hacer push a main.

---

## Autores

- Sergio Peckerle
- Diego Ortino
- Cristian Calvo
- Sebastián Allende

---

**Última actualización**: 2025-11-30
**Versión**: 3.1
**Proyecto**: VIBRA Frontend
