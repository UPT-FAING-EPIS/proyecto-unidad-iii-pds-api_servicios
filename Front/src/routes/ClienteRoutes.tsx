// EducationRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { InicioCliente } from "../pages/ClienteService/InicioCliente";
import { ListClientes } from "../pages/ClienteService/ListClientes";

export const ClienteRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioCliente/>} />
    <Route path="/Listar" element={<ListClientes/>} />
  </Routes>
);