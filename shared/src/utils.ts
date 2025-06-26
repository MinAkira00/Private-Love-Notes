import { LoveLetter, LetterCategory, LetterMood } from './types';

// Generar un ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Formatear fecha para mostrar
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Obtener nombre amigable de categoría
export const getCategoryName = (category: LetterCategory): string => {
  const names: Record<LetterCategory, string> = {
    [LetterCategory.ANNIVERSARY]: '💕 Aniversario',
    [LetterCategory.BIRTHDAY]: '🎂 Cumpleaños',
    [LetterCategory.APOLOGY]: '🙏 Disculpa',
    [LetterCategory.MISSING_YOU]: '💭 Te extraño',
    [LetterCategory.GOOD_MORNING]: '🌅 Buenos días',
    [LetterCategory.GOOD_NIGHT]: '🌙 Buenas noches',
    [LetterCategory.JUST_BECAUSE]: '💝 Sin razón especial',
    [LetterCategory.SPECIAL_DATE]: '⭐ Fecha especial',
    [LetterCategory.SURPRISE]: '🎁 Sorpresa'
  };
  return names[category];
};

// Obtener nombre amigable de estado de ánimo
export const getMoodName = (mood: LetterMood): string => {
  const names: Record<LetterMood, string> = {
    [LetterMood.ROMANTIC]: '💖 Romántico',
    [LetterMood.PASSIONATE]: '🔥 Apasionado',
    [LetterMood.SWEET]: '🍯 Dulce',
    [LetterMood.PLAYFUL]: '😊 Juguetón',
    [LetterMood.SERIOUS]: '💙 Serio',
    [LetterMood.NOSTALGIC]: '🌸 Nostálgico'
  };
  return names[mood];
};

// Obtener color del tema según el estado de ánimo
export const getMoodColor = (mood: LetterMood): string => {
  const colors: Record<LetterMood, string> = {
    [LetterMood.ROMANTIC]: 'rose',
    [LetterMood.PASSIONATE]: 'red',
    [LetterMood.SWEET]: 'pink',
    [LetterMood.PLAYFUL]: 'orange',
    [LetterMood.SERIOUS]: 'blue',
    [LetterMood.NOSTALGIC]: 'purple'
  };
  return colors[mood];
};

// Validar contenido de carta
export const validateLetter = (title: string, content: string, recipient: string): string[] => {
  const errors: string[] = [];
  
  if (!title.trim()) {
    errors.push('El título es obligatorio');
  }
  
  if (!content.trim()) {
    errors.push('El contenido es obligatorio');
  }
  
  if (!recipient.trim()) {
    errors.push('El destinatario es obligatorio');
  }
  
  if (title.length > 100) {
    errors.push('El título no puede tener más de 100 caracteres');
  }
  
  return errors;
};

// Buscar cartas por texto
export const searchLetters = (letters: LoveLetter[], searchText: string): LoveLetter[] => {
  if (!searchText.trim()) return letters;
  
  const text = searchText.toLowerCase();
  return letters.filter(letter => 
    letter.title.toLowerCase().includes(text) ||
    letter.content.toLowerCase().includes(text) ||
    letter.recipient.toLowerCase().includes(text) ||
    letter.tags.some(tag => tag.toLowerCase().includes(text))
  );
};
