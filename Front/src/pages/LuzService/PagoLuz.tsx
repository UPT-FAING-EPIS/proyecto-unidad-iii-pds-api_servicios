import { Regresar } from "../../components/Regresar";
import { useEffect, useState } from "react";
import { obtenerPagos } from "../../api/luz.api.ts";
import { Pagos } from "../../Types/luzservice.ts";

export function PagosLuz() {
  const [pagos, setPagos] = useState<Pagos[]>([]);

  useEffect(() => {
    async function cargarPagos() {
      const res = await obtenerPagos();
      setPagos(res.data);
      console.log(res);
    }
    cargarPagos();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="flex flex-col gap-4">
        <h2>Lista de pagos</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-100">Código pago</th>
              <th className="py-2 px-4 bg-gray-100">Monto pago</th>
              <th className="py-2 px-4 bg-gray-100">Fecha de pago</th>
              <th className="py-2 px-4 bg-gray-100">Código de deuda</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.CodigoPago}>
                <td className="py-2 px-4">{pago.CodigoPago}</td>
                <td className="py-2 px-4">{pago.Pago}</td>
                <td className="py-2 px-4">{pago.FechaPago}</td>
                <td className="py-2 px-4">{pago.CodigoDeuda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
