import { Route, Routes } from "react-router-dom";

import { InicioInternet } from "../pages/InternetService/InicioInternet";
import { DeudoresInternet } from "../pages/InternetService/DeudoresInternet";
import { BusquedaPagoInternet } from "../pages/InternetService/PagosInternet";
import { RealizarPagoInternet } from "../pages/InternetService/RealizarPago";


export const InternetRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioInternet />} />
    <Route path="/Deudores" element={<DeudoresInternet />} />
    <Route path="/Pagar" element={<BusquedaPagoInternet />} />
    <Route path="/RealizarPago" element={<RealizarPagoInternet />} />
  </Routes>
);
