import axios from "axios";
import { Deuda } from "../Types/internetservice";

export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioInternet/Deudores/");
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioInternet/Deudores/${cod}/`);
};

export const pagarDeuda = (cod:number,pago: Deuda) => {
  return axios.patch(`http://127.0.0.1:8000/ServicioInternet/pagoInter/${cod}/`, pago);
};
