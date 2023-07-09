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
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código pago
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Monto pago
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Fecha de pago
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código de deuda
              </td>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.CodigoPago}>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.CodigoPago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.Pago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.FechaPago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.CodigoDeuda}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
