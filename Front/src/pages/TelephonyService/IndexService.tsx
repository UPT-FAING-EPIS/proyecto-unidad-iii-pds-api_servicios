import { OpcionesInicio } from "../../components/OpcionesInicio";
import { Regresar } from "../../components/Regresar";

export function IndexService() {
  return (
    <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">
        Pagos de Telefonia
      </h1>
      <div className="flex justify-center items-center rounded-md flex-grow gap-5">
        <OpcionesInicio to="/Servicios/Telefonia/Facturas" text="Facturas" />
        <OpcionesInicio to="/Servicios/Telefonia/Planes" text="Recarga" />
      </div>
    </div>
  );
}
