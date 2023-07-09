import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/luz.api.ts";
import { Clientes} from "../../Types/luzservice.ts";
import { Regresar } from "../../components/Regresar";

export function Busqueda() {
  const [deudas, setDeudas] = useState<Clientes[]>([]); 

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data); 
    }
    cargarDeudas();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Lista de deudores</h2>

        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Código</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Monto Deuda</th>
              <th className="border px-4 py-2">Fecha de vencimiento</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeuda}>
                <td className="border px-4 py-2">{deuda.CodigoDeuda}</td>
                <td className="border px-4 py-2">{deuda.FkCodigoCliente}</td>
                <td className="border px-4 py-2">{deuda.Monto}</td>
                <td className="border px-4 py-2">{deuda.FechaVencimientoPago}</td>
                <td className="border px-4 py-2">{deuda.Estado ? "Pagado" : "deuda"}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
