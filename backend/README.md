# ⚡ Backend API - Cartas de Amor

API RESTful para gestionar cartas de amor con sincronización entre dispositivos.

## 🛠️ Tecnologías
- **Node.js** - Runtime
- **Express** - Framework web
- **MongoDB** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Upload de archivos

## 📁 Estructura
```
backend/
├── src/
│   ├── controllers/   # Controladores
│   ├── models/       # Modelos de datos
│   ├── routes/       # Rutas de la API
│   ├── middleware/   # Middlewares
│   ├── utils/        # Utilidades
│   └── config/       # Configuración
├── uploads/          # Archivos subidos
└── package.json
```

## 🚀 Comandos
```bash
npm install       # Instalar dependencias
npm run dev       # Servidor de desarrollo
npm run build     # Build para producción
npm start         # Servidor en producción
```

## 📋 Endpoints
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/letters` - Obtener cartas del usuario
- `POST /api/letters` - Crear nueva carta
- `PUT /api/letters/:id` - Actualizar carta
- `DELETE /api/letters/:id` - Eliminar carta
