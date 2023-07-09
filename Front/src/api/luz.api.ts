import axios from "axios";
import { Pagos } from "../../Types/luzservice";


export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioLuz/deudas/");
};

export const pagarDeuda = (pagoData: Pagos) => {
  return axios.post("http://127.0.0.1:8000/ServicioLuz/pagos/", pagoData);
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioLuz/deudas/${cod}/`);
};
export const obtenerPagos = () => {
  return axios.get("http://127.0.0.1:8000/ServicioLuz/pagos/");
};