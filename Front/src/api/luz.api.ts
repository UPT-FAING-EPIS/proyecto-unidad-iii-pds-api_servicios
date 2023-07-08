import axios from "axios";
import { Deuda } from "../Types/luzservice";

export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioLuz/deudas/");
};

export const pagarDeuda = (pago: Deuda) => {
  return axios.post("http://127.0.0.1:8000/ServicioLuz/pagos/", pago);
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioLuz/deudas/${cod}/`);
};
export const obtenerPagos = () => {
  return axios.get("http://127.0.0.1:8000/ServicioLuz/pagos/");
};