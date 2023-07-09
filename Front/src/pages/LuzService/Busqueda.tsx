import { useState } from "react";
import { useForm } from "react-hook-form";
import { buscarDeuda } from "../../api/luz.api.ts";
import { ContentTDeudas } from "../../components/LuzService/ContentTDeudas";
import { Regresar } from "../../components/Regresar.tsx";
import { Deuda } from "../../Types/luzservice.ts";

export function Busqueda() {
  const [deudor, setDeudor] = useState<Deuda | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const codigoDeuda = data.CodigoDeuda;
    console.log("Valor de CodigoDeuda:", codigoDeuda); // Imprimir el valor en la consola

    setIsLoading(true);
    setError("");

    try {
      const response = await buscarDeuda(parseInt(codigoDeuda));
      const deuda = response.data;

      if (deuda) {
        setDeudor(deuda);
      } else {
        setDeudor(null);
        setError("Deuda no encontrada");
      }
    } catch (error) {
      console.log(error);
      setDeudor(null);
      setError("Algo salió mal al obtener la deuda");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="mt-4">
        <form onSubmit={onSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              {...register("CodigoDeuda", { required: true })}
              className="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ingrese el código de la deuda"
              required
            />
            {errors.CodigoDeuda && (
              <span className="text-red-500">
                Código de deuda requerido
              </span>
            )}
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>
        <div className="container mx-auto px-4 py-8">
          {error && <p className="text-red-500">{error}</p>}
          {deudor && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-300 dark:text-gray-300">
                <thead className="text-xs text-gray-600 uppercase dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Codigo de deuda
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Cantidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Vencimiento
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ContentTDeudas
                    codigo_Deuda={deudor.codigo_deuda}
                    Monto={deudor.Monto}
                    FechaVenc={deudor.FechaVencimientoPago}
                    Estado={deudor.Estado}
                  
                  />
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
