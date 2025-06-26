import express from 'express';
import { body, validationResult } from 'express-validator';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = join(__dirname, '..', 'data', 'letters.json');

// Función para leer cartas desde archivo
const readLetters = () => {
  try {
    if (!existsSync(dataFile)) {
      return [];
    }
    const data = readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo cartas:', error);
    return [];
  }
};

// Función para guardar cartas en archivo
const saveLetters = (letters) => {
  try {
    // Crear directorio si no existe
    const dataDir = dirname(dataFile);
    if (!existsSync(dataDir)) {
      import('fs').then(fs => fs.mkdirSync(dataDir, { recursive: true }));
    }
    
    writeFileSync(dataFile, JSON.stringify(letters, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error guardando cartas:', error);
    return false;
  }
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
    const letters = readLetters();
    const { category, mood, isFavorite, recipient, search } = req.query;
    
    let filteredLetters = letters;
    
    // Filtrar por categoría
    if (category) {
      filteredLetters = filteredLetters.filter(letter => letter.category === category);
    }
    
    // Filtrar por estado de ánimo
    if (mood) {
      filteredLetters = filteredLetters.filter(letter => letter.mood === mood);
    }
    
    // Filtrar por favoritas
    if (isFavorite !== undefined) {
      filteredLetters = filteredLetters.filter(letter => letter.isFavorite === (isFavorite === 'true'));
    }
    
    // Filtrar por destinatario
    if (recipient) {
      filteredLetters = filteredLetters.filter(letter => 
        letter.recipient.toLowerCase().includes(recipient.toLowerCase())
      );
    }
    
    // Búsqueda de texto
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredLetters = filteredLetters.filter(letter => 
        letter.title.toLowerCase().includes(searchTerm) ||
        letter.content.toLowerCase().includes(searchTerm) ||
        letter.recipient.toLowerCase().includes(searchTerm) ||
        letter.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Ordenar por fecha de creación (más recientes primero)
    filteredLetters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      count: filteredLetters.length,
      data: filteredLetters
    });
  } catch (error) {
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
    const letters = readLetters();
    const letter = letters.find(l => l.id === req.params.id);
    
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
    
    const letters = readLetters();
    const newLetter = {
      id: generateId(),
      ...req.body,
      tags: req.body.tags || [],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    letters.unshift(newLetter); // Agregar al inicio
    
    if (saveLetters(letters)) {
      res.status(201).json({
        success: true,
        message: 'Carta creada exitosamente',
        data: newLetter
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error guardando carta'
      });
    }
  } catch (error) {
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
    
    const letters = readLetters();
    const letterIndex = letters.findIndex(l => l.id === req.params.id);
    
    if (letterIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    const updatedLetter = {
      ...letters[letterIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    letters[letterIndex] = updatedLetter;
    
    if (saveLetters(letters)) {
      res.json({
        success: true,
        message: 'Carta actualizada exitosamente',
        data: updatedLetter
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error guardando carta'
      });
    }
  } catch (error) {
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
    const letters = readLetters();
    const letterIndex = letters.findIndex(l => l.id === req.params.id);
    
    if (letterIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    letters[letterIndex].isFavorite = !letters[letterIndex].isFavorite;
    letters[letterIndex].updatedAt = new Date().toISOString();
    
    if (saveLetters(letters)) {
      res.json({
        success: true,
        message: `Carta ${letters[letterIndex].isFavorite ? 'marcada como' : 'removida de'} favorita`,
        data: letters[letterIndex]
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error actualizando carta'
      });
    }
  } catch (error) {
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
    const letters = readLetters();
    const letterIndex = letters.findIndex(l => l.id === req.params.id);
    
    if (letterIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Carta no encontrada'
      });
    }
    
    const deletedLetter = letters.splice(letterIndex, 1)[0];
    
    if (saveLetters(letters)) {
      res.json({
        success: true,
        message: 'Carta eliminada exitosamente',
        data: deletedLetter
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error eliminando carta'
      });
    }
  } catch (error) {
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
    const letters = readLetters();
    
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
    
    // Estadísticas por categoría
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
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas',
      message: error.message
    });
  }
});

export default router;
