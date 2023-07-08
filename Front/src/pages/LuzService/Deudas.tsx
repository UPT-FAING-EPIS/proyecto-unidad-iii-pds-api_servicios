import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/luz.api.ts";
import { Clientes } from "../../Types/luzservice.ts";
import { Regresar } from "../../components/Regresar";

export function DeudasLuz() {
  const [deudas, setDeudas] = useState<Clientes[]>([]); // Especifica el tipo de estado como un array de Deudor

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data); // Actualiza el estado con los datos de deudas
    }
    cargarDeudas();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="flex flex-col gap-4">
        <h2>Lista de deudas</h2>
        <table>
          <thead>
            <tr>
              <th>Código deuda</th>
              <th>Cantidad deuda</th>
              <th>Estado</th>
              <th>Fecha de vencimiento</th>
              <th>Código del alumno</th>
            </tr>
          </thead>
          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeuda}>
                <td>{deuda.CodigoDeuda}</td>
                <td>{deuda.Monto}</td>
                <td>{deuda.Estado }</td>
                <td>{deuda.FechaVencimientoPago}</td>
                <td>{deuda.FkCodigoCliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
