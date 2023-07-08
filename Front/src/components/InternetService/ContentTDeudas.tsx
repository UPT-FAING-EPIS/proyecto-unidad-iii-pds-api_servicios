import { Link } from "react-router-dom";

export function ContentTDeudas({
  CodigoDeudInter,
  MonDeuda,
  FechVenc,
  Estado,
}: {
  CodigoDeudInter: string;
  MonDeuda: string;
  FechVenc: string;
  Estado: string|undefined;
}) {
  return (
    <>
      <tr className="">
        <th scope="row" className="px-6 py-4 text-gray-700">
          {CodigoDeudInter}
        </th>
        <td className="px-6 py-4 text-gray-700">S/. {MonDeuda}</td>
        <td className="px-6 py-4 text-gray-700">{FechVenc}</td>
        <td className="px-6 py-4 text-gray-700">{Estado}</td>
        <td className="px-6 py-4 text-gray-700 ">
          {Estado === "Pagado" ? (
            <span className="text-green-800">Pagado</span>
          ) : (
            <Link
              to={`/Servicios/Internet/RealizarPago?codigoDeuda=${CodigoDeudInter}&MontoPago=${MonDeuda}`}
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
