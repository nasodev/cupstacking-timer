import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayers } from '../hooks/useLocalStorage';

export default function PlayerManage() {
  const navigate = useNavigate();
  const { players, addPlayer, removePlayer } = usePlayers();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      addPlayer(trimmed);
      setNewName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 mb-4"
        >
          ← 뒤로
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">선수 관리</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="새 선수 이름"
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className={`py-3 px-6 rounded-xl font-bold transition-colors ${
              newName.trim()
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            추가
          </button>
        </div>

        {players.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            등록된 선수가 없습니다
          </p>
        ) : (
          <div className="grid gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-200"
              >
                <span className="font-medium text-gray-800">{player.name}</span>
                <button
                  onClick={() => removePlayer(player.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
