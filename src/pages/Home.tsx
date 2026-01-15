import { useNavigate } from 'react-router-dom';
import { usePlayers } from '../hooks/useLocalStorage';
import { INDIVIDUAL_EVENTS, TEAM_EVENTS, EVENT_NAMES } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const { players } = usePlayers();

  const handleEventClick = (eventType: string) => {
    if (players.length === 0) {
      navigate('/players');
    } else {
      navigate(`/select/${eventType}`);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8 pt-4">
          컵쌓기 타이머
        </h1>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">개인 종목</h2>
          <div className="grid gap-3">
            {INDIVIDUAL_EVENTS.map((event) => (
              <button
                key={event}
                onClick={() => handleEventClick(event)}
                className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold rounded-xl shadow-md transition-colors"
              >
                {EVENT_NAMES[event]}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-600 mb-3">단체 종목</h2>
          <div className="grid gap-3">
            {TEAM_EVENTS.map((event) => (
              <button
                key={event}
                onClick={() => handleEventClick(event)}
                className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-xl shadow-md transition-colors"
              >
                {EVENT_NAMES[event]}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            onClick={() => navigate('/ranking')}
            className="py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            순위 보기
          </button>
          <button
            onClick={() => navigate('/players')}
            className="py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            선수 관리
          </button>
        </div>
      </div>
    </div>
  );
}
