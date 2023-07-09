import axios from "axios";
import { Deuda } from "../Types/educationservice";

export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioEducacion/deudas/");
};

export const pagarDeuda = (pago: Deuda) => {
  return axios.post("http://127.0.0.1:8000/ServicioEducacion/pagarDebito/", pago);
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioEducacion/listardeudores/${cod}/`);
};
export const obtenerPagos = () => {
  return axios.get("http://127.0.0.1:8000/ServicioEducacion/pagos/");
};
