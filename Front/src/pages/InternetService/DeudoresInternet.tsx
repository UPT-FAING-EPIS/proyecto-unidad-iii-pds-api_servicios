import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/internet.api.ts";
import { Deudor } from "../../Types/internetservice.ts";
import { Regresar } from "../../components/Regresar";

export function DeudoresInternet() {
  const [deudas, setDeudas] = useState<Deudor[]>([]); // Especifica el tipo de estado como un array de Deudor

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data); // Actualiza el estado con los datos de deudas
    }
    cargarDeudas();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Internet" />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Lista de deudores</h2>

        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Código</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Apellido</th>
              <th className="border px-4 py-2">Monto Deuda</th>
              <th className="border px-4 py-2">Fecha de vencimiento</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeudInter}>
                <td className="border px-4 py-2">{deuda.CodigoDeudInter}</td>
                <td className="border px-4 py-2">{deuda.Nombre}</td>
                <td className="border px-4 py-2">{deuda.Apellido}</td>
                <td className="border px-4 py-2">{deuda.MonDeuda}</td>
                <td className="border px-4 py-2">{deuda.FechVenc}</td>
                <td className="border px-4 py-2">{deuda.Estado ? "Pagado" : "Pendiente"}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
