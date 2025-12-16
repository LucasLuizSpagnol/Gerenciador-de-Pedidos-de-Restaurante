import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Cadastro from './Pages/Cadastro';
import Principal from './Pages/Principal';
import GerenciamentoPedidos from './Pages/GerenciamentoPedidos';
import GerenciarMenu from './Pages/GerenciarMenu';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/gerenciamentoPedidos" element={<GerenciamentoPedidos />} />
        <Route path="/gerenciamento" element={<GerenciarMenu />} />
      </Routes>
    </Router>
  );
}

export default App;