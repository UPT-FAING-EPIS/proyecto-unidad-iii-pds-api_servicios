import { Regresar } from "../../components/Regresar";
import { useEffect, useState } from "react";
import { obtenerPagos } from "../../api/education.api.ts";
import { Pago } from "../../Types/educationservice.ts";

export function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);

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
      <Regresar to="/Servicios/Educacion" />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Lista de pagos</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Código pago</th>
                <th className="border px-4 py-2">Monto pago</th>
                <th className="border px-4 py-2">Fecha de pago</th>
                <th className="border px-4 py-2">Código de deuda</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.CodigoPago}>
                  <td className="border text-center px-4 py-2">
                    {pago.CodigoPago}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {pago.MontoPago}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {pago.FechaPago}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {pago.FKCodigoDeuda}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
