import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, Edit3, Trash2, Calendar, Tag, User } from 'lucide-react';

// Mock de tipos (en producción vendría del shared)
const LetterCategory = {
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

const LetterMood = {
  ROMANTIC: "romantic",
  PASSIONATE: "passionate",
  SWEET: "sweet",
  PLAYFUL: "playful",
  SERIOUS: "serious",
  NOSTALGIC: "nostalgic"
};

function App() {
  const [letters, setLetters] = useState([]);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserSelect, setShowUserSelect] = useState(true);
  const [viewMode, setViewMode] = useState('mine'); // 'mine', 'theirs', 'both'

  // Cargar cartas del localStorage al iniciar
  useEffect(() => {
    const savedLetters = localStorage.getItem('loveLetters');
    const savedUser = localStorage.getItem('currentUser');
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters));
    }
    if (savedUser) {
      setCurrentUser(savedUser);
      setShowUserSelect(false);
    }
  }, []);

  // Guardar cartas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('loveLetters', JSON.stringify(letters));
  }, [letters]);

  // Guardar usuario actual
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
    }
  }, [currentUser]);

  // Generar ID único
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Crear nueva carta
  const createLetter = (letterData) => {
    const newLetter = {
      ...letterData,
      id: generateId(),
      author: currentUser, // Usar el usuario actual como autor
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: letterData.tags || []
    };
    setLetters(prev => [newLetter, ...prev]);
    setShowForm(false);
  };

  // Actualizar carta existente
  const updateLetter = (id, updatedData) => {
    setLetters(prev => prev.map(letter => 
      letter.id === id 
        ? { ...letter, ...updatedData, updatedAt: new Date().toISOString() }
        : letter
    ));
    setIsEditing(false);
    setCurrentLetter(null);
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

  // Filtrar cartas por búsqueda
  const filteredLetters = letters.filter(letter => {
    // Filtro por búsqueda
    const matchesSearch = letter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por vista (mías, de mi pareja, o todas)
    if (viewMode === 'mine') {
      return matchesSearch && letter.author === currentUser;
    } else if (viewMode === 'theirs') {
      return matchesSearch && letter.author !== currentUser;
    }
    return matchesSearch; // 'both' - mostrar todas
  });

  // Función para cambiar de usuario (logout)
  const switchUser = () => {
    setCurrentUser(null);
    setShowUserSelect(true);
    setViewMode('mine');
  };

  // Función para seleccionar usuario
  const selectUser = (userName) => {
    setCurrentUser(userName);
    setShowUserSelect(false);
  };

  // Obtener nombre de categoría
  const getCategoryName = (category) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      {/* Pantalla de selección de usuario */}
      {showUserSelect && (
        <UserSelectScreen onSelectUser={selectUser} />
      )}

      {/* Aplicación principal */}
      {!showUserSelect && (
        <>
          {/* Header */}
          <header className="bg-white backdrop-blur-sm shadow-lg border-b border-pink-200">
            <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <h1 className="text-3xl font-romantic font-bold text-gray-800">
                      Cartas de Amor
                    </h1>
                    <p className="text-sm text-gray-600">
                      ¡Hola {currentUser}! 💕
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Filtros de vista */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('mine')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        viewMode === 'mine' 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                      }`}
                    >
                      Mis cartas
                    </button>
                    <button
                      onClick={() => setViewMode('theirs')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        viewMode === 'theirs' 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                      }`}
                    >
                      {currentUser === 'Pollito' ? 'De Princesita' : 'De Pollito'}
                    </button>
                    <button
                      onClick={() => setViewMode('both')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        viewMode === 'both' 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                      }`}
                    >
                      Todas
                    </button>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-romantic flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nueva Carta</span>
                  </button>
                  <button
                    onClick={switchUser}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cambiar usuario
                  </button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Barra de búsqueda */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar cartas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-romantic pl-10"
                />
              </div>
            </div>

            {/* Lista de cartas */}
            {filteredLetters.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-24 h-24 text-pink-300 mx-auto mb-4" />
                <h3 className="text-2xl font-romantic text-gray-600 mb-2">
                  {viewMode === 'mine' && letters.filter(l => l.author === currentUser).length === 0 ? 
                    `¡${currentUser}, escribe tu primera carta de amor!` : 
                   viewMode === 'theirs' && letters.filter(l => l.author !== currentUser).length === 0 ? 
                    `Aún no hay cartas de ${currentUser === 'Pollito' ? 'Princesita' : 'Pollito'}` :
                   letters.length === 0 ? '¡Pollito y Princesita, escriban su primera carta juntos!' : 'No se encontraron cartas'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {viewMode === 'mine' && letters.filter(l => l.author === currentUser).length === 0 ? 
                    'Comienza expresando tus sentimientos más profundos' :
                   viewMode === 'theirs' && letters.filter(l => l.author !== currentUser).length === 0 ? 
                    'Tal vez sea hora de escribir la primera carta juntos' :
                   letters.length === 0 ? 'El amor se expresa mejor por escrito 💕' : 'Intenta con otros términos de búsqueda'
                  }
                </p>
                {((viewMode === 'mine' && letters.filter(l => l.author === currentUser).length === 0) || letters.length === 0) && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-romantic"
                  >
                    Crear mi primera carta
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLetters.map((letter) => (
                  <div key={letter.id} className="card-romantic group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-romantic font-bold text-gray-800 mb-1">
                          {letter.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          De: <span className="font-medium">{letter.author}</span> → Para: <span className="font-medium">{letter.recipient}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(letter.id)}
                        className={`p-1 rounded-full transition-colors ${
                          letter.isFavorite 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-300 hover:text-red-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${letter.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="mb-4">
                      <span className="inline-block text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                        {getCategoryName(letter.category)}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {letter.content}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(letter.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Solo mostrar botones de edición si es del usuario actual */}
                    {letter.author === currentUser && (
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setCurrentLetter(letter);
                            setIsEditing(true);
                          }}
                          className="btn-outline-romantic text-sm py-2 px-4 flex items-center space-x-1"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => deleteLetter(letter.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal para crear/editar carta */}
          {(showForm || isEditing) && (
            <LetterForm
              letter={currentLetter}
              currentUser={currentUser}
              onSave={isEditing ? updateLetter : createLetter}
              onCancel={() => {
                setShowForm(false);
                setIsEditing(false);
                setCurrentLetter(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

// Componente de selección de usuario
function UserSelectScreen({ onSelectUser }) {
  const presetUsers = [
    { name: 'Pollito', emoji: '�', color: 'yellow' },
    { name: 'Princesita', emoji: '👸', color: 'pink' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card-romantic max-w-md w-full">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-romantic font-bold text-gray-800 mb-2">
            ¡Bienvenido a Cartas de Amor!
          </h1>
          <p className="text-gray-600">
            ¿Quién eres? Selecciona tu identidad romántica
          </p>
        </div>

        <div className="space-y-4">
          {presetUsers.map((user) => (
            <button
              key={user.name}
              onClick={() => onSelectUser(user.name)}
              className="w-full p-6 rounded-lg border-2 border-pink-200 hover:border-pink-400 transition-colors bg-white hover:bg-pink-50 flex items-center justify-center space-x-4"
            >
              <span className="text-4xl">{user.emoji}</span>
              <span className="text-2xl font-romantic font-bold text-gray-800">{user.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          � Pollito y Princesita, sus cartas de amor esperan
        </div>
      </div>
    </div>
  );
}

// Componente del formulario
function LetterForm({ letter, currentUser, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: letter?.title || '',
    content: letter?.content || '',
    recipient: letter?.recipient || '',
    category: letter?.category || LetterCategory.JUST_BECAUSE,
    mood: letter?.mood || LetterMood.ROMANTIC,
    tags: letter?.tags?.join(', ') || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const letterData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (letter) {
      onSave(letter.id, letterData);
    } else {
      onSave(letterData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-romantic font-bold text-gray-800">
                {letter ? 'Editar Carta' : 'Nueva Carta de Amor'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Escribiendo como: <span className="font-medium text-pink-600">{currentUser}</span>
              </p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la carta
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="input-romantic"
              placeholder="Un título romántico..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Para quien es
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({...formData, recipient: e.target.value})}
              className="input-romantic"
              placeholder="Nombre de tu ser amado..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="input-romantic"
              >
                <option value={LetterCategory.JUST_BECAUSE}>💝 Sin razón especial</option>
                <option value={LetterCategory.ANNIVERSARY}>💕 Aniversario</option>
                <option value={LetterCategory.BIRTHDAY}>🎂 Cumpleaños</option>
                <option value={LetterCategory.APOLOGY}>🙏 Disculpa</option>
                <option value={LetterCategory.MISSING_YOU}>💭 Te extraño</option>
                <option value={LetterCategory.GOOD_MORNING}>🌅 Buenos días</option>
                <option value={LetterCategory.GOOD_NIGHT}>🌙 Buenas noches</option>
                <option value={LetterCategory.SPECIAL_DATE}>⭐ Fecha especial</option>
                <option value={LetterCategory.SURPRISE}>🎁 Sorpresa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de ánimo
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({...formData, mood: e.target.value})}
                className="input-romantic"
              >
                <option value={LetterMood.ROMANTIC}>💖 Romántico</option>
                <option value={LetterMood.PASSIONATE}>🔥 Apasionado</option>
                <option value={LetterMood.SWEET}>🍯 Dulce</option>
                <option value={LetterMood.PLAYFUL}>😊 Juguetón</option>
                <option value={LetterMood.SERIOUS}>💙 Serio</option>
                <option value={LetterMood.NOSTALGIC}>🌸 Nostálgico</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido de la carta
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="textarea-romantic h-64"
              placeholder="Expresa todos tus sentimientos aquí..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="input-romantic"
              placeholder="amor, especial, recuerdo..."
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline-romantic"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-romantic"
            >
              {letter ? 'Actualizar' : 'Guardar'} Carta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
