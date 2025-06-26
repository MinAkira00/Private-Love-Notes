import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../constants/users';

const WelcomePage = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (selectedUser) {
      navigate(`/${selectedUser}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-rose-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-rose-800 mb-4">
            💌 Love Letters Manager
          </h1>
          <p className="text-lg text-gray-600">
            ¡Bienvenido al lugar donde tus sentimientos cobran vida!
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            ¿Quién eres hoy?
          </h2>
          <div className="space-y-3">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                  selectedUser === user.id
                    ? `border-${user.color}-500 bg-${user.color}-50 text-${user.color}-700 shadow-md`
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{user.emoji}</div>
                <div className="font-medium">{user.name}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={!selectedUser}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
            selectedUser
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Comenzar a escribir ✨
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
