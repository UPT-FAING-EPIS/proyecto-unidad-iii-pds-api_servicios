import axios from "axios";
import { Plan } from "../Types/telephonyservice";

export const obtenerplan = () => {
  return axios.get("http://127.0.0.1:8000/ServicioTelefonia/planes/");
};

export const elegirplan = (cliente_id: number, plan_id: number, monto_pago: number) => {
  console.log("Datos enviados:", cliente_id, plan_id, monto_pago);
  return axios.post("http://127.0.0.1:8000/ServicioTelefonia/facturas/activar_plan/", {
    cliente_id: cliente_id,
    plan_id: plan_id,
    monto_pago: monto_pago
  });
};

export const pagarDeuda = (plan: Plan) => {
    return axios.post("http://127.0.0.1:8000/ServicioTelefonia/planes/", plan);
};
  
export const buscarcliente = (id: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioTelefonia/clientes/${id}/`);
};

export const actualizarsaldo = (id: number,nombre: string, direccion: string, telefono: string, cuenta_bancaria: number, servicio_activo: number) => {
  return axios.put(`http://127.0.0.1:8000/ServicioTelefonia/clientes/${id}/`,{
    nombre: nombre,
    direccion: direccion,
    telefono: telefono,
    cuenta_bancaria: cuenta_bancaria,
    servicio_activo: servicio_activo
  });
};

export const obtenerfactura = () => {
  return axios.get("http://127.0.0.1:8000/ServicioTelefonia/facturas/");
};

export const obtenercliente = () => {
    return axios.get("http://127.0.0.1:8000/ServicioTelefonia/clientes/");
  };