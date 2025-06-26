# 🖥️ Desktop App - Cartas de Amor

Aplicación de escritorio para Windows, macOS y Linux.

## 🛠️ Tecnologías
- **Electron** - Framework de aplicaciones de escritorio
- **React** - UI (compartido con web)
- **TypeScript** - Tipado estático
- **Electron Builder** - Empaquetado
- **SQLite** - Base de datos local

## 📁 Estructura
```
desktop-app/
├── src/
│   ├── main/         # Proceso principal de Electron
│   ├── renderer/     # Proceso renderer (React)
│   ├── shared/       # Código compartido
│   └── preload/      # Scripts de preload
├── build/            # Configuración de build
└── package.json
```

## 🚀 Comandos
```bash
npm install          # Instalar dependencias
npm run dev          # Desarrollo
npm run build        # Build de la aplicación
npm run dist         # Crear instaladores
```

## 📋 Funcionalidades
- [ ] Interfaz nativa de escritorio
- [ ] Menús y atajos de teclado
- [ ] Almacenamiento local con SQLite
- [ ] Exportar cartas a archivos
- [ ] Modo offline completo
- [ ] Actualizaciones automáticas
