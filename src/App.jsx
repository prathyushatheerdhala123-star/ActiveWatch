import { Route, Routes } from 'react-router-dom';
import HomePage    from './pages/HomePage.jsx';
import LearnMode   from './pages/LearnMode.jsx';
import Dashboard   from './pages/Dashboard.jsx';
import CapturePage from './pages/CapturePage.jsx';
import GuardMode   from './pages/GuardMode.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />}    />
      <Route path="/learn"     element={<LearnMode />}   />
      <Route path="/dashboard" element={<Dashboard />}   />
      <Route path="/capture"   element={<CapturePage />} />
      <Route path="/guard"     element={<GuardMode />}   />
    </Routes>
  );
}
