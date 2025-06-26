// Constantes para categorías y estados de ánimo de las cartas

export const LetterCategory = {
  ANNIVERSARY: "anniversary",
  BIRTHDAY: "birthday",
  APOLOGY: "apology",
  MISSING_YOU: "missing_you",
  GOOD_MORNING: "good_morning",
  GOOD_NIGHT: "good_night",
  JUST_BECAUSE: "just_because",
  SPECIAL_DATE: "special_date",
  SURPRISE: "surprise"
};

export const LetterMood = {
  ROMANTIC: "romantic",
  PASSIONATE: "passionate",
  SWEET: "sweet",
  PLAYFUL: "playful",
  SERIOUS: "serious",
  NOSTALGIC: "nostalgic"
};

// Función para obtener el nombre de categoría con emoji
export const getCategoryName = (category) => {
  const names = {
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
  return names[category] || category;
};
