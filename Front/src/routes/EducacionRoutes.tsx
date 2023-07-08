// EducationRoutes.tsx
import { Route, Routes } from "react-router-dom";
import { InicioEducation } from "../pages/EducationService/InicioEducacion";
import { Deudas } from "../pages/EducationService/Deudas";
import { Pagos } from "../pages/EducationService/Pagos";
import { BusquedaPago } from "../pages/EducationService/BusquedaPago";
import { PagarDeudas } from "../pages/EducationService/PagarDeudas";
import { RealizarPago } from "../pages/EducationService/RealizarPago";

export const EducacionRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioEducation />} />
    <Route path="/Deudas" element={<Deudas />} />
    <Route path="/Pagos" element={<Pagos />} />
    <Route path="/Pagar" element={<PagarDeudas />} />
    <Route path="/RealizarPago" element={<RealizarPago />} />
    <Route path="/BusquedaPago" element={<BusquedaPago />} />
  </Routes>
);
