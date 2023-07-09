import { Route, Routes } from "react-router-dom";
import { InicioLuz } from "../pages/LuzService/InicioLuz";
import { DeudasLuz } from "../pages/LuzService/Deudas";
import { PagosLuz } from "../pages/LuzService/PagoLuz";
import { RealizarPago } from "../pages/LuzService/RealizarPago";


export const LuzRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioLuz/>} />
    <Route path="/Deudas" element={<DeudasLuz />} />
    <Route path="/Pagos" element={<PagosLuz />} />
    <Route path="/RealizarPago" element={<RealizarPago />} />

  </Routes>
);
