import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Agrega aquí más rutas según tus páginas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;