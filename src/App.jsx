import { Route, Routes } from 'react-router-dom';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductPage />} />
    </Routes>
  );
}

export default App;