// Tipos para cartas de amor
export interface LoveLetter {
  id: string;
  title: string;
  content: string;
  recipient: string; // A quién va dirigida
  author: string;    // Quien la escribe
  category: LetterCategory;
  mood: LetterMood;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  tags: string[];
}

// Categorías de cartas
export enum LetterCategory {
  ANNIVERSARY = "anniversary",        // Aniversario
  BIRTHDAY = "birthday",             // Cumpleaños
  APOLOGY = "apology",               // Disculpa
  MISSING_YOU = "missing_you",       // Te extraño
  GOOD_MORNING = "good_morning",     // Buenos días
  GOOD_NIGHT = "good_night",         // Buenas noches
  JUST_BECAUSE = "just_because",     // Sin razón especial
  SPECIAL_DATE = "special_date",     // Fecha especial
  SURPRISE = "surprise"              // Sorpresa
}

// Estados de ánimo de las cartas
export enum LetterMood {
  ROMANTIC = "romantic",      // Romántico
  PASSIONATE = "passionate",  // Apasionado
  SWEET = "sweet",           // Dulce
  PLAYFUL = "playful",       // Juguetón
  SERIOUS = "serious",       // Serio
  NOSTALGIC = "nostalgic"    // Nostálgico
}

// Para crear una nueva carta
export interface CreateLetterRequest {
  title: string;
  content: string;
  recipient: string;
  author: string;
  category: LetterCategory;
  mood: LetterMood;
  tags?: string[];
}

// Para actualizar una carta
export interface UpdateLetterRequest {
  id: string;
  title?: string;
  content?: string;
  recipient?: string;
  category?: LetterCategory;
  mood?: LetterMood;
  isFavorite?: boolean;
  tags?: string[];
}

// Filtros para buscar cartas
export interface LetterFilters {
  category?: LetterCategory;
  mood?: LetterMood;
  isFavorite?: boolean;
  recipient?: string;
  searchText?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

// Estadísticas de cartas
export interface LetterStats {
  total: number;
  byCategory: Record<LetterCategory, number>;
  byMood: Record<LetterMood, number>;
  favorites: number;
  thisMonth: number;
}
