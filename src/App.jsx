import { Route, Routes } from 'react-router-dom';
import HomePage    from './pages/HomePage.jsx';
import GrowMode    from './pages/GrowMode.jsx';
import Dashboard   from './pages/Dashboard.jsx';
import CollectPage from './pages/CollectPage.jsx';
import UnwindMode  from './pages/UnwindMode.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />}    />
      <Route path="/grow"      element={<GrowMode />}    />
      <Route path="/dashboard" element={<Dashboard />}   />
      <Route path="/collect"   element={<CollectPage />} />
      <Route path="/unwind"    element={<UnwindMode />}  />
    </Routes>
  );
}