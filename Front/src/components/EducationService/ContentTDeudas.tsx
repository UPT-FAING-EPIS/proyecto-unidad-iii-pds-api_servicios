import { Link } from "react-router-dom";

export function ContentTDeudas({
  codigoDeuda,
  cantidadDeuda,
  fechaVencimiento,
  estado,
  codigoestudiante,
}: {
  codigoDeuda: string;
  cantidadDeuda: string;
  fechaVencimiento: string;
  estado: string|undefined;
  codigoestudiante: string;
}) {
  return (
    <>
      <tr className="">
        <th scope="row" className="px-6 py-4 text-gray-700">
          {codigoDeuda}
        </th>
        <td className="px-6 py-4 text-gray-700">S/. {cantidadDeuda}</td>
        <td className="px-6 py-4 text-gray-700">{fechaVencimiento}</td>
        <td className="px-6 py-4 text-gray-700">{estado}</td>
        <td className="px-6 py-4 text-gray-700">{codigoestudiante}</td>
        <td className="px-6 py-4 text-gray-700 ">
          {estado === "Pagado" ? (
            <span className="text-green-800">Pagado</span>
          ) : (
            <Link
              to={`/Servicios/Educacion/RealizarPago?codigoDeuda=${codigoDeuda}&MontoPago=${cantidadDeuda}`}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
            >
              Pagar
            </Link>
          )}
        </td>
      </tr>
    </>
  );
}
