import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home";
import CadastroCliente from "./Pages/CadastroCliente/Cadastro-Cliente";
import Painel from "./Pages/Painel/Painel";
import Layout from "./Pages/Layout";
import LayoutPainel from "./Pages/LayoutPainel";
import Produtos from "./Pages/Produtos/Produtos";
import Clientes from "./Pages/Clientes/Clientes";
import Pedidos from "./Pages/Pedidos/Pedidos";
import FaleConosco from "./Pages/FaleConosco/FaleConosco";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path='/fale-conosco' element={<FaleConosco />} />

          <Route element={<LayoutPainel />}>
            <Route path="/painel" element={<Painel />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
