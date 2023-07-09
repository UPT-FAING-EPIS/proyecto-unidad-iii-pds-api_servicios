import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/luz.api.ts";
import { Clientes } from "../../Types/luzservice.ts";
import { Regresar } from "../../components/Regresar";

export function DeudasLuz() {
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
        <h2>Lista de deudas</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código deuda
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Cantidad deuda
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Estado
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Fecha de vencimiento
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código del Cliente
              </td>
            </tr>
          </thead>
          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeuda}>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.CodigoDeuda}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.Monto}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.Estado}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.FechaVencimientoPago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.FkCodigoCliente}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
