import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear directorio de base de datos si no existe
const dbDir = join(__dirname, '..', 'data');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'letters.db');

// Crear conexión a la base de datos
const db = new Database(dbPath);

// Configurar WAL mode para mejor concurrencia
db.pragma('journal_mode = WAL');

// Crear tabla de cartas si no existe
const createLettersTable = `
  CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    recipient TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
      'anniversary', 'birthday', 'apology', 'missing_you', 
      'good_morning', 'good_night', 'just_because', 'special_date', 'surprise'
    )),
    mood TEXT NOT NULL CHECK (mood IN (
      'romantic', 'passionate', 'sweet', 'playful', 'serious', 'nostalgic'
    )),
    tags TEXT NOT NULL DEFAULT '[]', -- JSON array as string
    isFavorite INTEGER NOT NULL DEFAULT 0, -- SQLite boolean as integer
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`;

// Ejecutar la creación de la tabla
db.exec(createLettersTable);

// Crear índices para mejorar el rendimiento de consultas
const createIndexes = `
  CREATE INDEX IF NOT EXISTS idx_letters_category ON letters(category);
  CREATE INDEX IF NOT EXISTS idx_letters_mood ON letters(mood);
  CREATE INDEX IF NOT EXISTS idx_letters_recipient ON letters(recipient);
  CREATE INDEX IF NOT EXISTS idx_letters_isFavorite ON letters(isFavorite);
  CREATE INDEX IF NOT EXISTS idx_letters_createdAt ON letters(createdAt);
`;

db.exec(createIndexes);

console.log('✅ Base de datos SQLite inicializada correctamente');

export default db;
