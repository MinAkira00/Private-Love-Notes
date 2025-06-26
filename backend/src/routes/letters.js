import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../database/db.js';

const router = express.Router();

// Preparar statements para mejor rendimiento
const statements = {
  getAllLetters: db.prepare('SELECT * FROM letters ORDER BY createdAt DESC'),
  getLetterById: db.prepare('SELECT * FROM letters WHERE id = ?'),
  insertLetter: db.prepare(`
    INSERT INTO letters (id, title, content, recipient, author, category, mood, tags, isFavorite, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  updateLetter: db.prepare(`
    UPDATE letters 
    SET title = ?, content = ?, recipient = ?, author = ?, category = ?, mood = ?, tags = ?, updatedAt = ?
    WHERE id = ?
  `),
  toggleFavorite: db.prepare(`
    UPDATE letters 
    SET isFavorite = ?, updatedAt = ?
    WHERE id = ?
  `),
  deleteLetter: db.prepare('DELETE FROM letters WHERE id = ?'),
  getFilteredLetters: {
    byCategory: db.prepare('SELECT * FROM letters WHERE category = ? ORDER BY createdAt DESC'),
    byMood: db.prepare('SELECT * FROM letters WHERE mood = ? ORDER BY createdAt DESC'),
    byFavorite: db.prepare('SELECT * FROM letters WHERE isFavorite = ? ORDER BY createdAt DESC'),
    byRecipient: db.prepare('SELECT * FROM letters WHERE recipient LIKE ? ORDER BY createdAt DESC')
  }
};

// Función para convertir row de SQLite a objeto JavaScript
const formatLetter = (row) => {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    isFavorite: Boolean(row.isFavorite)
  };
};

// Función para filtrar cartas con búsqueda de texto
const searchLetters = (searchTerm) => {
  const searchPattern = `%${searchTerm.toLowerCase()}%`;
  const searchQuery = `
    SELECT * FROM letters 
    WHERE LOWER(title) LIKE ? 
       OR LOWER(content) LIKE ? 
       OR LOWER(recipient) LIKE ?
       OR LOWER(tags) LIKE ?
    ORDER BY createdAt DESC
  `;
  return db.prepare(searchQuery).all(searchPattern, searchPattern, searchPattern, searchPattern);
};

// Generar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Validaciones
const letterValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('El contenido es obligatorio'),
  body('recipient')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El destinatario debe tener entre 1 y 50 caracteres'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El autor debe tener entre 1 y 50 caracteres'),
  body('category')
    .isIn(['anniversary', 'birthday', 'apology', 'missing_you', 'good_morning', 'good_night', 'just_because', 'special_date', 'surprise'])
    .withMessage('Categoría no válida'),
  body('mood')
    .isIn(['romantic', 'passionate', 'sweet', 'playful', 'serious', 'nostalgic'])
    .withMessage('Estado de ánimo no válido'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Las etiquetas deben ser un array')
];

// GET /api/letters - Obtener todas las cartas
router.get('/', (req, res) => {
  try {
    const { category, mood, isFavorite, recipient, search } = req.query;
    let letters;
    
    // Si hay búsqueda de texto, usar función especializada
    if (search) {
      letters = searchLetters(search);
    }
    // Filtros específicos
    else if (category) {
      letters = statements.getFilteredLetters.byCategory.all(category);
    }
    else if (mood) {
      letters = statements.getFilteredLetters.byMood.all(mood);
    }
    else if (isFavorite !== undefined) {
      const favoriteValue = isFavorite === 'true' ? 1 : 0;
      letters = statements.getFilteredLetters.byFavorite.all(favoriteValue);
    }
    else if (recipient) {
      letters = statements.getFilteredLetters.byRecipient.all(`%${recipient.toLowerCase()}%`);
    }
    else {
      letters = statements.getAllLetters.all();
    }
    
    // Formatear las cartas y aplicar filtros adicionales si es necesario
    let filteredLetters = letters.map(formatLetter);
    
    // Aplicar filtros adicionales si hay múltiples parámetros
    if (category && (mood || isFavorite !== undefined || recipient)) {
      filteredLetters = filteredLetters.filter(letter => letter.category === category);
    }
    if (mood && (isFavorite !== undefined || recipient)) {
      filteredLetters = filteredLetters.filter(letter => letter.mood === mood);
    }
    if (isFavorite !== undefined && recipient) {
      filteredLetters = filteredLetters.filter(letter => letter.isFavorite === (isFavorite === 'true'));
    }
    if (recipient && !search) {
      filteredLetters = filteredLetters.filter(letter => 
        letter.recipient.toLowerCase().includes(recipient.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      count: filteredLetters.length,
      data: filteredLetters
    });
  } catch (error) {
    console.error('Error obteniendo cartas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo cartas',
      message: error.message
    });
  }
});

// GET /api/letters/:id - Obtener una carta específica
router.get('/:id', (req, res) => {
  try {
    const row = statements.getLetterById.get(req.params.id);
    const letter = formatLetter(row);
    
    if (!letter) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: letter
    });
  } catch (error) {
    console.error('Error obteniendo carta:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo carta',
      message: error.message
    });
  }
});

// POST /api/letters - Crear nueva carta
router.post('/', letterValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array()
      });
    }
    
    const newLetter = {
      id: generateId(),
      title: req.body.title,
      content: req.body.content,
      recipient: req.body.recipient,
      author: req.body.author,
      category: req.body.category,
      mood: req.body.mood,
      tags: JSON.stringify(req.body.tags || []),
      isFavorite: 0, // SQLite boolean como integer
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = statements.insertLetter.run(
      newLetter.id,
      newLetter.title,
      newLetter.content,
      newLetter.recipient,
      newLetter.author,
      newLetter.category,
      newLetter.mood,
      newLetter.tags,
      newLetter.isFavorite,
      newLetter.createdAt,
      newLetter.updatedAt
    );
    
    if (result.changes > 0) {
      // Obtener la carta recién insertada con formato correcto
      const insertedLetter = formatLetter(statements.getLetterById.get(newLetter.id));
      
      res.status(201).json({
        success: true,
        message: 'Carta creada exitosamente',
        data: insertedLetter
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error insertando carta en la base de datos'
      });
    }
  } catch (error) {
    console.error('Error creando carta:', error);
    res.status(500).json({
      success: false,
      error: 'Error creando carta',
      message: error.message
    });
  }
});

// PUT /api/letters/:id - Actualizar carta existente
router.put('/:id', letterValidation, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos de entrada inválidos',
        details: errors.array()
      });
    }
    
    // Verificar que la carta existe
    const existingLetter = statements.getLetterById.get(req.params.id);
    if (!existingLetter) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    const updatedAt = new Date().toISOString();
    const result = statements.updateLetter.run(
      req.body.title,
      req.body.content,
      req.body.recipient,
      req.body.author,
      req.body.category,
      req.body.mood,
      JSON.stringify(req.body.tags || []),
      updatedAt,
      req.params.id
    );
    
    if (result.changes > 0) {
      // Obtener la carta actualizada
      const updatedLetter = formatLetter(statements.getLetterById.get(req.params.id));
      
      res.json({
        success: true,
        message: 'Carta actualizada exitosamente',
        data: updatedLetter
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error actualizando carta'
      });
    }
  } catch (error) {
    console.error('Error actualizando carta:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando carta',
      message: error.message
    });
  }
});

// PATCH /api/letters/:id/favorite - Toggle favorita
router.patch('/:id/favorite', (req, res) => {
  try {
    // Verificar que la carta existe
    const existingLetter = formatLetter(statements.getLetterById.get(req.params.id));
    if (!existingLetter) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    const newFavoriteValue = existingLetter.isFavorite ? 0 : 1;
    const updatedAt = new Date().toISOString();
    
    const result = statements.toggleFavorite.run(
      newFavoriteValue,
      updatedAt,
      req.params.id
    );
    
    if (result.changes > 0) {
      // Obtener la carta actualizada
      const updatedLetter = formatLetter(statements.getLetterById.get(req.params.id));
      
      res.json({
        success: true,
        message: `Carta ${updatedLetter.isFavorite ? 'marcada como' : 'removida de'} favorita`,
        data: updatedLetter
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error actualizando carta'
      });
    }
  } catch (error) {
    console.error('Error actualizando favorita:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando favorita',
      message: error.message
    });
  }
});

// DELETE /api/letters/:id - Eliminar carta
router.delete('/:id', (req, res) => {
  try {
    // Obtener la carta antes de eliminarla para devolver sus datos
    const letterToDelete = formatLetter(statements.getLetterById.get(req.params.id));
    
    if (!letterToDelete) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    const result = statements.deleteLetter.run(req.params.id);
    
    if (result.changes > 0) {
      res.json({
        success: true,
        message: 'Carta eliminada exitosamente',
        data: letterToDelete
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error eliminando carta'
      });
    }
  } catch (error) {
    console.error('Error eliminando carta:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando carta',
      message: error.message
    });
  }
});

// GET /api/letters/stats - Obtener estadísticas
router.get('/stats/summary', (req, res) => {
  try {
    // Obtener todas las cartas para calcular estadísticas
    const letters = statements.getAllLetters.all().map(formatLetter);
    
    const stats = {
      total: letters.length,
      favorites: letters.filter(l => l.isFavorite).length,
      thisMonth: letters.filter(l => {
        const letterDate = new Date(l.createdAt);
        const now = new Date();
        return letterDate.getMonth() === now.getMonth() && 
               letterDate.getFullYear() === now.getFullYear();
      }).length,
      byCategory: {},
      byMood: {},
      byRecipient: {}
    };
    
    // Estadísticas por categoría, estado de ánimo y destinatario
    letters.forEach(letter => {
      stats.byCategory[letter.category] = (stats.byCategory[letter.category] || 0) + 1;
      stats.byMood[letter.mood] = (stats.byMood[letter.mood] || 0) + 1;
      stats.byRecipient[letter.recipient] = (stats.byRecipient[letter.recipient] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas',
      message: error.message
    });
  }
});

export default router;
