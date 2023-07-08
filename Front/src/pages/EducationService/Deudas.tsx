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
                <td>{deuda.CantidadDeuda}</td>
                <td>{deuda.Estado ? "Pagado" : "Pendiente"}</td>
                <td>{deuda.FechaVencimiento}</td>
                <td>{deuda.fkCodigoAlumno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
