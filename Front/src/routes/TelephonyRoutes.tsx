import { Route, Routes } from "react-router-dom";
import { IndexService } from "../pages/TelephonyService/IndexService";
import { Facturas } from "../pages/TelephonyService/Facturas";
import { Planes } from "../pages/TelephonyService/Plan";
import { RealizarPago } from "../pages/TelephonyService/RealizarPago";

export const TelephonyRoutes = () => (
  <Routes>
    <Route path="/" element={<IndexService />} />
    <Route path="/Facturas" element={<Facturas />} />
    <Route path="/Planes" element={<Planes />} />
    <Route path="/RealizarPago" element={<RealizarPago />} />
  </Routes>
);
