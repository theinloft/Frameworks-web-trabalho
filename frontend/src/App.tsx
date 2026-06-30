import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './Pages/Layout';
import LayoutPainel from './Pages/LayoutPainel';

const Login = lazy(() => import('./Pages/Login/Login'));
const Home = lazy(() => import('./Pages/Home'));
const CadastroCliente = lazy(
  () => import('./Pages/CadastroCliente/Cadastro-Cliente'),
);
const FaleConosco = lazy(() => import('./Pages/FaleConosco/FaleConosco'));
const Painel = lazy(() => import('./Pages/Painel/Painel'));
const Produtos = lazy(() => import('./Pages/Produtos/Produtos'));
const Clientes = lazy(() => import('./Pages/Clientes/Clientes'));
const Pedidos = lazy(() => import('./Pages/Pedidos/Pedidos'));
const NovoPedido = lazy(() => import('./Pages/Pedidos/NovoPedido'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/cadastro-cliente" element={<CadastroCliente />} />
            <Route path="/fale-conosco" element={<FaleConosco />} />

            <Route element={<LayoutPainel />}>
              <Route path="/painel" element={<Painel />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/pedidos/novo" element={<NovoPedido />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
