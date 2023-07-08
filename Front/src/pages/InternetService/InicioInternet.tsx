import { OpcionesInicio } from "../../components/OpcionesInicio";
import { Regresar } from "../../components/Regresar";

export function InicioInternet() {
  return (
    <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">
        Pagos de Internet
      </h1>
      <div className="flex justify-center items-center flex-grow gap-5">
        <OpcionesInicio to="/Servicios/Internet/Pagar" text="Pagar Deuda" />
        <OpcionesInicio to="/Servicios/Internet/Deudores" text="Deudores" />
      </div>
    </div>
  );
}
