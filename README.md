# 💕 Private Love Notes

Una aplicación multiplataforma para escribir, gestionar y compartir cartas de amor entre parejas.

## 🎯 Características Actuales

### ✅ **Backend Completo con SQLite**
- **API REST** completa con Express.js
- **Base de datos SQLite** con better-sqlite3
- **Validaciones** robustas con express-validator
- **Seguridad** con helmet, rate limiting y CORS
- **Filtros avanzados** por categoría, estado de ánimo, favoritas
- **Búsqueda** en título, contenido y etiquetas

### ✅ **Frontend Web Funcional**
- **React + Vite + Tailwind CSS**
- **Sistema de usuarios** (Pollito y Princesita)
- **Diseño romántico** y responsive
- **Almacenamiento híbrido** (local + backend)
- **Categorías** y estados de ánimo
- **Filtros dinámicos** y búsqueda en tiempo real

### 📊 **Estado de la Base de Datos**
- 🗄️ **SQLite**: `backend/src/database/letters.db` (se crea automáticamente)
- 📝 **Estructura**: ID, título, contenido, autor, destinatario, categoría, estado de ánimo, etiquetas, favorita, fechas
- 🔄 **Migración**: Completada de archivos JSON a SQLite

## 🚀 Instalación y Desarrollo

### ✅ Web Frontend (LISTO)
```bash
cd web-frontend
npm install
npm run dev
```
La aplicación web estará disponible en http://localhost:5173

### ✅ Backend API (LISTO)
```bash
cd backend
npm install
npm run dev
```
API disponible en http://localhost:3001

### 📱 Mobile App (Próximamente)
```bash
cd mobile-app
npm install
npm start
```

### 🖥️ Desktop App (Próximamente)
```bash
cd desktop-app
npm install
npm start
```

## 🎯 Roadmap

- [x] Estructura del proyecto
- [x] **Fase 1**: Web Frontend básico ✅
- [x] **Fase 2**: Backend API ✅
- [x] **Fase 3**: Tipos compartidos ✅
- [ ] **Fase 4**: Aplicación móvil
- [ ] **Fase 5**: Aplicación de escritorio
- [ ] **Fase 6**: Sincronización y características avanzadas

## 💝 ¡Ya puedes empezar a escribir cartas de amor!

La aplicación web ya está lista para usar. Incluye:
- ✍️ Editor de cartas romántico
- 📂 Categorización (aniversarios, cumpleaños, etc.)
- 💾 Almacenamiento local
- 🔍 Búsqueda de cartas
- ⭐ Marcar favoritas
- 🎨 Diseño romántico y responsivepara escribir, editar y gestionar cartas de amor en múltiples plataformas.

## 🏗️ Estructura del Proyecto

```
Amor/
├── backend/           # API Backend (Node.js/Express)
├── web-frontend/      # Aplicación Web (React/Vite)
├── mobile-app/        # Aplicación Móvil (React Native)
├── desktop-app/       # Aplicación Escritorio (Electron)
├── shared/           # Código compartido entre plataformas
└── docs/             # Documentación
```

## 🌹 Características Principales

- ✍️ **Escribir cartas de amor** con editor rico
- ✏️ **Editar cartas existentes**
- 📂 **Organizar por categorías** (aniversarios, cumpleaños, etc.)
- 💾 **Sincronización entre dispositivos**
- 🎨 **Temas románticos personalizables**
- 📱 **Multiplataforma** (Web, Móvil, Escritorio)

## 🚀 Tecnologías

### Backend
- Node.js + Express
- MongoDB/SQLite
- JWT Authentication
- RESTful API

### Web Frontend
- React 18
- Vite
- Tailwind CSS
- Local Storage / IndexedDB

### Mobile App
- React Native
- Expo (para desarrollo rápido)
- AsyncStorage

### Desktop App
- Electron
- React (compartido con web)

### Shared
- TypeScript interfaces
- Utilidades comunes
- Validaciones

## 📦 Instalación y Desarrollo

### Por ahora - Empezar con Web Frontend
```bash
cd web-frontend
npm install
npm run dev
```

## 🎯 Roadmap

- [x] Estructura del proyecto
- [ ] **Fase 1**: Web Frontend básico
- [ ] **Fase 2**: Backend API
- [ ] **Fase 3**: Aplicación móvil
- [ ] **Fase 4**: Aplicación de escritorio
- [ ] **Fase 5**: Sincronización y características avanzadas

---
*"El amor no se ve con los ojos, sino con el corazón"* ❤️
