import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLetters } from '../hooks/useLetters';
import { users } from '../constants/users';
import { LETTER_CATEGORIES, MOODS } from '../constants/letterTypes';
import LetterCard from '../components/LetterCard';
import LetterForm from '../components/LetterForm';

const UserDashboard = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingLetter, setEditingLetter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');

  const {
    letters,
    addLetter,
    updateLetter,
    deleteLetter,
    filteredLetters,
    updateFilters
  } = useLetters(userId);

  // Verificar que el usuario existe
  const currentUser = users.find(user => user.id === userId);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    updateFilters(selectedCategory, selectedMood);
  }, [selectedCategory, selectedMood, updateFilters]);

  if (!currentUser) {
    return null;
  }

  const handleSaveLetter = (letterData) => {
    if (editingLetter) {
      updateLetter(editingLetter.id, letterData);
    } else {
      addLetter(letterData);
    }
    setShowForm(false);
    setEditingLetter(null);
  };

  const handleEditLetter = (letter) => {
    setEditingLetter(letter);
    setShowForm(true);
  };

  const handleDeleteLetter = (letterId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      deleteLetter(letterId);
    }
  };

  const handleChangeUser = () => {
    navigate('/');
  };

  const getFilterButtonClass = (isSelected, userColor) => {
    const baseClass = "px-4 py-2 text-sm font-medium transition-all duration-200 border-2 rounded-xl";
    
    if (isSelected) {
      return `${baseClass} bg-${userColor}-500 text-white border-${userColor}-500 shadow-md`;
    }
    
    if (userColor === 'blue') {
      return `${baseClass} text-blue-700 border-blue-200 bg-blue-50 hover:border-blue-300 hover:bg-blue-100`;
    }
    
    return `${baseClass} text-pink-700 border-pink-200 bg-pink-50 hover:border-pink-300 hover:bg-pink-100`;
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${
        currentUser.color === 'blue' 
          ? 'bg-gradient-to-br from-blue-50 to-sky-100' 
          : 'bg-gradient-to-br from-pink-50 to-rose-100'
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-5xl">{currentUser.emoji}</span>
            <h1 className={`text-4xl font-bold ${
              currentUser.color === 'blue' ? 'text-blue-800' : 'text-rose-800'
            }`}>
              Cartas de {currentUser.name}
            </h1>
          </div>
          <p className={`text-lg ${
            currentUser.color === 'blue' ? 'text-blue-600' : 'text-rose-600'
          }`}>
            {currentUser.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowForm(true)}
            className={`px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
              currentUser.color === 'blue'
                ? 'bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600'
                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
            }`}
          >
            ✍️ Nueva Carta
          </button>
          <button
            onClick={handleChangeUser}
            className="px-6 py-3 bg-white text-gray-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200"
          >
            👥 Cambiar Usuario
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Categoría:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={getFilterButtonClass(selectedCategory === 'all', currentUser.color)}
                >
                  Todas
                </button>
                {LETTER_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={getFilterButtonClass(selectedCategory === category.id, currentUser.color)}
                  >
                    {category.emoji} {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Estado de ánimo:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMood('all')}
                  className={getFilterButtonClass(selectedMood === 'all', currentUser.color)}
                >
                  Todos
                </button>
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={getFilterButtonClass(selectedMood === mood.id, currentUser.color)}
                  >
                    {mood.emoji} {mood.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLetters.map((letter) => (
            <LetterCard
              key={letter.id}
              letter={letter}
              currentUser={currentUser}
              onEdit={handleEditLetter}
              onDelete={handleDeleteLetter}
            />
          ))}
        </div>

        {filteredLetters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💌</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              {letters.length === 0 
                ? '¡Escribe tu primera carta de amor!'
                : 'No hay cartas que coincidan con los filtros'
              }
            </h3>
            <p className="text-gray-500">
              {letters.length === 0 
                ? 'Comienza expresando tus sentimientos más profundos'
                : 'Intenta cambiar los filtros para ver más cartas'
              }
            </p>
          </div>
        )}
      </div>

      {/* Letter Form Modal */}
      {showForm && (
        <LetterForm
          currentUser={currentUser}
          editingLetter={editingLetter}
          onSave={handleSaveLetter}
          onCancel={() => {
            setShowForm(false);
            setEditingLetter(null);
          }}
        />
      )}
    </div>
  );
};

export default UserDashboard;
