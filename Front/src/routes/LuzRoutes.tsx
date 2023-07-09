import { Route, Routes } from "react-router-dom";
import { InicioLuz } from "../pages/LuzService/InicioLuz";
import { DeudasLuz } from "../pages/LuzService/Deudas";
import { PagosLuz } from "../pages/LuzService/PagoLuz";
import { Busqueda } from "../pages/LuzService/Busqueda";
//import { RealizarPago } from "../pages/LuzService/RealizarPago";
// <Route path="/RealizarPago" element={<RealizarPago />} />

export const LuzRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioLuz/>} />
    <Route path="/Deudas" element={<DeudasLuz />} />
    <Route path="/Pagos" element={<PagosLuz />} />
    <Route path="/Busqueda" element={<Busqueda/>} />
  </Routes>
);
