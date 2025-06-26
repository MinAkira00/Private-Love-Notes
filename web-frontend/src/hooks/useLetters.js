import { useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

// Hook personalizado para manejar la lógica de las cartas
export const useLetters = (userName) => {
  const [letters, setLetters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('mine'); // 'mine', 'theirs', 'both'

  // Cargar cartas del localStorage al iniciar
  useEffect(() => {
    const savedLetters = localStorage.getItem('loveLetters');
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters));
    }
  }, []);

  // Guardar cartas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('loveLetters', JSON.stringify(letters));
  }, [letters]);

  // Crear nueva carta
  const createLetter = (letterData) => {
    const newLetter = {
      ...letterData,
      id: generateId(),
      author: userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: letterData.tags || []
    };
    setLetters(prev => [newLetter, ...prev]);
  };

  // Actualizar carta existente
  const updateLetter = (id, updatedData) => {
    setLetters(prev => prev.map(letter => 
      letter.id === id 
        ? { ...letter, ...updatedData, updatedAt: new Date().toISOString() }
        : letter
    ));
  };

  // Eliminar carta
  const deleteLetter = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      setLetters(prev => prev.filter(letter => letter.id !== id));
    }
  };

  // Marcar como favorita
  const toggleFavorite = (id) => {
    setLetters(prev => prev.map(letter => 
      letter.id === id 
        ? { ...letter, isFavorite: !letter.isFavorite }
        : letter
    ));
  };

  // Filtrar cartas por búsqueda y vista
  const filteredLetters = letters.filter(letter => {
    // Filtro por búsqueda
    const matchesSearch = letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por vista (mías, de mi pareja, o todas)
    if (viewMode === 'mine') {
      return matchesSearch && letter.author === userName;
    } else if (viewMode === 'theirs') {
      return matchesSearch && letter.author !== userName;
    }
    return matchesSearch; // 'both' - mostrar todas
  });

  return {
    letters,
    filteredLetters,
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    createLetter,
    updateLetter,
    deleteLetter,
    toggleFavorite
  };
};
