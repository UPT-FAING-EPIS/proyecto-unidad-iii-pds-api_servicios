import mantenimientoGif from "../../assets/images/mantenimiento.gif";
import { Regresar } from "../../components/Regresar";

export function InicioAgua() {
  return (
    <>
      <Regresar to="/Servicios" />
      <div className="bg-white py-8 flex justify-center items-center">
        <div className="container mx-auto text-center">
          <img
            src={mantenimientoGif}
            alt="Mantenimiento"
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold mb-4">Servicio en mantenimiento</h2>
          <p className="text-lg text-gray-700">
            El servicio se encuentra caido. Vuelve pronto.
          </p>
        </div>
      </div>
    </>
  );
}
