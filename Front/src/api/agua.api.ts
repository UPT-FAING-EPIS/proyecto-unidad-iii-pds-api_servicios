import axios from "axios";
import { DeudaAgua } from "../Types/aguaService";
export const obtenerDeuda = (codigo_cliente:DeudaAgua) => {
    return axios.post("http://127.0.0.1:8000/ServicioAgua/deuda/", codigo_cliente);
};