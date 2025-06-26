# 🔗 Shared - Código Compartido

Código compartido entre todas las plataformas.

## 🛠️ Contenido
- **Tipos TypeScript** - Interfaces y tipos comunes
- **Utilidades** - Funciones helpers
- **Validaciones** - Esquemas de validación
- **Constantes** - Valores constantes
- **API Client** - Cliente HTTP compartido

## 📁 Estructura
```
shared/
├── types/           # Tipos TypeScript
├── utils/           # Funciones utilitarias
├── validators/      # Validaciones
├── constants/       # Constantes
├── api/            # Cliente API
└── package.json
```

## 📋 Tipos Principales
```typescript
interface LoveLetter {
  id: string;
  title: string;
  content: string;
  category: LetterCategory;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

enum LetterCategory {
  ANNIVERSARY = 'anniversary',
  BIRTHDAY = 'birthday',
  APOLOGY = 'apology',
  RANDOM = 'random',
  SPECIAL = 'special'
}
```
