import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { buscarcliente, actualizarsaldo } from "../../api/Telephony.ts";
import { Regresar } from "../../components/Regresar";

export function RealizarPago() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_cliente = searchParams.get("id_cliente");
  const monto = searchParams.get("monto");

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (id_cliente && monto) {
      buscarClienteYActualizarSaldo(Number(id_cliente), Number(monto));
    }
  }, [id_cliente, monto]);

  const buscarClienteYActualizarSaldo = async (clienteId: number, monto: number) => {
    try {
      // Obtener los datos del cliente
      const res = await buscarcliente(clienteId);
      const cliente = res.data;

      // Restar el monto a la cuenta bancaria
      if (cliente.cuenta_bancaria >= monto) {
        // Restar el monto a la cuenta bancaria
        const nuevoSaldo = cliente.cuenta_bancaria - monto;
  
        // Actualizar los datos del cliente con el nuevo saldo
        await actualizarsaldo(clienteId, cliente.nombre, cliente.direccion, cliente.telefono, nuevoSaldo, cliente.servicio_activo);
  
        setMensaje("Su recarga se realizó exitosamente.");
      } else {
        setMensaje("Saldo insuficiente para realizar la recarga.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Hubo algun error en su recarga.");
    }
  };

  return (
    <>
    <div>
      <Regresar to="/Servicios/Telefonia" />
    </div>
    <div className="container mx-auto mt-8">
    <div className="flex w-100 shadow-lg rounded-lg">
      <div className="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
      </div>
      <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
        <div><h1 className="text-4xl font-bold mb-4">{mensaje}</h1></div>
      </div>
    </div><br></br>
      <p className="text-lg font-semibold">ID Cliente: {id_cliente}</p>
      <p className="text-lg font-semibold">Monto: {monto}</p>
    </div>
  
    </>
  );
}