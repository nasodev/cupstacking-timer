import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlayerSelect from './pages/PlayerSelect';
import Timer from './pages/Timer';
import Result from './pages/Result';
import Ranking from './pages/Ranking';
import PlayerManage from './pages/PlayerManage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select/:eventType" element={<PlayerSelect />} />
        <Route path="/timer/:eventType" element={<Timer />} />
        <Route path="/result/:eventType" element={<Result />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/players" element={<PlayerManage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
