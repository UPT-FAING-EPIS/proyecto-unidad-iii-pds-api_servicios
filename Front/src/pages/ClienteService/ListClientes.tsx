import { Regresar } from "../../components/Regresar";
import { useEffect, useState } from "react";
import { listarclientes } from "../../api/cliente.api.ts";
import { Clientes } from "../../Types/ClienteService.ts";

export function ListClientes() {
  const [cliente, setclientes] = useState<Clientes[]>([]);

  useEffect(() => {
    async function cargarClientes() {
      const res = await listarclientes();
      setclientes(res.data);
      console.log(res);
    }
    cargarClientes();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Educacion" />
      <div className="flex flex-col gap-4">
        <h2>Lista de pagos</h2>
        <table>
          <thead>
            <tr>
              <th>nombreCliente</th>
              <th>direccion</th>
              <th>pais</th>
              <th>codigoPostal</th>
              <th>numeroTelefono</th>
              <th>correoElectronico</th>
              <th>estadoCuenta</th>
            </tr>
          </thead>
          <tbody>
            {cliente.map((clientes) => (
              <tr key={clientes.nombreCliente}>
                <td>{clientes.nombreCliente}</td>
                <td>{clientes.direccion}</td>
                <td>{clientes.pais}</td>
                <td>{clientes.codigoPostal}</td>
                <td>{clientes.numeroTelefono}</td>
                <td>{clientes.correoElectronico}</td>
                <td>{clientes.estadoCuenta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
