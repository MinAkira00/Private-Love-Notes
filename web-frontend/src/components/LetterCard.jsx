import React from 'react';
import { Heart, Edit3, Trash2, Calendar, Tag } from 'lucide-react';
import { getCategoryName } from '../constants/letterTypes';
import { formatDate } from '../utils/helpers';

const LetterCard = ({ 
  letter, 
  currentUser, 
  onToggleFavorite, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className={`
      ${letter.author === 'Pollito' ? 'card-cinnamoroll' : 'card-spiderman'} 
      letter-card group relative overflow-hidden
    `}>
      {/* Partículas temáticas en la tarjeta */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {letter.author === 'Pollito' ? (
          <>
            <div className="absolute top-2 right-2 text-sm cinnamoroll-icon">☁️</div>
            <div className="absolute bottom-2 left-2 text-xs cinnamoroll-icon" style={{animationDelay: '3s'}}>⭐</div>
          </>
        ) : (
          <>
            <div className="absolute top-2 right-2 text-sm spiderman-icon">🕸️</div>
            <div className="absolute bottom-2 left-2 text-xs spiderman-icon" style={{animationDelay: '5s'}}>🕷️</div>
          </>
        )}
      </div>

      {/* Header de la carta */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-xl font-romantic font-bold text-white leading-tight">
              {letter.title}
            </h3>
            <span className="text-lg">
              {letter.author === 'Pollito' ? '☁️' : '🕷️'}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`
              px-3 py-1 rounded-full text-white/90 backdrop-blur-sm border
              ${letter.author === 'Pollito' 
                ? 'bg-blue-300/30 border-blue-200/30' 
                : 'bg-red-500/30 border-red-400/30'
              }
            `}>
              {letter.author === currentUser ? 
                `Para ${letter.recipient} ${letter.author === 'Pollito' ? '👸' : '🐥'}` : 
                `De ${letter.author} ${letter.author === 'Pollito' ? '☁️' : '🕷️'}`
              }
            </span>
          </div>
        </div>
        <button
          onClick={() => onToggleFavorite(letter.id)}
          className={`p-2 rounded-full transition-all duration-300 ${
            letter.isFavorite 
              ? 'text-red-400 bg-red-400/20 scale-110' 
              : 'text-white/40 hover:text-red-400 hover:bg-red-400/10'
          }`}
        >
          <Heart className={`w-5 h-5 ${letter.isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Categoría y estado de ánimo */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="inline-flex items-center text-xs bg-gradient-to-r from-pink-400/30 to-purple-400/30 text-white px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
          {getCategoryName(letter.category)}
        </span>
        <span className="text-xs text-white/60 capitalize">
          {letter.mood}
        </span>
      </div>

      {/* Contenido de la carta */}
      <div className="mb-4 relative">
        <p className="text-white/90 leading-relaxed line-clamp-4 text-sm">
          {letter.content}
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Información de fecha */}
      <div className="flex items-center justify-between text-xs text-white/60 mb-4">
        <span className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(letter.createdAt)}</span>
        </span>
        {letter.tags && letter.tags.length > 0 && (
          <div className="flex items-center space-x-1">
            <Tag className="w-3 h-3" />
            <span>{letter.tags.slice(0, 2).join(', ')}</span>
          </div>
        )}
      </div>

      {/* Botones de acción (solo para el autor) */}
      {letter.author === currentUser && (
        <div className="flex items-center space-x-2 pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => onEdit(letter)}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={() => onDelete(letter.id)}
            className="bg-red-400/20 hover:bg-red-400/30 text-red-300 hover:text-red-200 p-2 rounded-xl backdrop-blur-sm transition-all duration-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Indicador visual para cartas de la pareja */}
      {letter.author !== currentUser && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default LetterCard;
