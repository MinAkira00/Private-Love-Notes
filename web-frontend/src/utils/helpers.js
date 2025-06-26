// Utilidades para generar IDs únicos

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Formatear fecha para mostrar
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    year: '2-digit'
  });
};
