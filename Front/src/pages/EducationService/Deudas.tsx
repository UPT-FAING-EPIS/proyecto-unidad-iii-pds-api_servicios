import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/education.api.ts";
import { Deudor } from "../../Types/educationservice.ts";
import { Regresar } from "../../components/Regresar";

export function Deudas() {
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
  <Regresar to="/Servicios/Educacion" />
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-bold">Lista de deudas</h2>
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Código deuda</th>
            <th className="border px-4 py-2">Cantidad deuda</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Fecha de vencimiento</th>
            <th className="border px-4 py-2">Código del alumno</th>
          </tr>
        </thead>
        <tbody>
          {deudas.map((deuda) => (
            <tr key={deuda.CodigoDeuda}>
              <td className="border text-center px-4 py-2">{deuda.CodigoDeuda}</td>
              <td className="border text-center px-4 py-2">{deuda.CantidadDeuda}</td>
              <td className={`border font-bold text-center px-4 py-2 ${deuda.Estado ? 'text-green-600' : 'text-orange-500'}`}>
                {deuda.Estado ? "Pagado" : "Pendiente"}
              </td>              
              <td className="border text-center px-4 py-2">{deuda.FechaVencimiento}</td>
              <td className="border text-center px-4 py-2">{deuda.fkCodigoAlumno}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</>

  );
}
