import { useState, useEffect } from 'react';
import { LETTER_CATEGORIES, MOODS } from '../constants/letterTypes';
import { generateId, formatDate } from '../utils/helpers';

const LetterForm = ({ currentUser, editingLetter, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    category: LETTER_CATEGORIES[0].id,
    mood: MOODS[0].id,
    content: '',
    title: ''
  });

  useEffect(() => {
    if (editingLetter) {
      setFormData({
        recipient: editingLetter.recipient,
        category: editingLetter.category,
        mood: editingLetter.mood,
        content: editingLetter.content,
        title: editingLetter.title || ''
      });
    }
  }, [editingLetter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const letterData = {
      ...formData,
      author: currentUser.id,
      date: editingLetter ? editingLetter.date : new Date().toISOString(),
      id: editingLetter ? editingLetter.id : generateId()
    };

    onSave(letterData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className={`p-6 border-b border-gray-200 ${
          currentUser.color === 'blue' 
            ? 'bg-gradient-to-r from-blue-500 to-sky-500' 
            : 'bg-gradient-to-r from-rose-500 to-pink-500'
        }`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {editingLetter ? '✏️ Editar Carta' : '✍️ Nueva Carta'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Dale un título especial a tu carta..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            {/* Destinatario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para:
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => handleChange('recipient', e.target.value)}
                placeholder="¿Para quién es esta carta?"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría:
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                {LETTER_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado de ánimo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado de ánimo:
              </label>
              <select
                value={formData.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                {MOODS.map((mood) => (
                  <option key={mood.id} value={mood.id}>
                    {mood.emoji} {mood.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu carta:
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Expresa aquí todos tus sentimientos..."
                required
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
              />
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-colors duration-200 ${
              currentUser.color === 'blue'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-rose-500 hover:bg-rose-600'
            }`}
          >
            {editingLetter ? 'Actualizar' : 'Guardar'} Carta
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterForm;
