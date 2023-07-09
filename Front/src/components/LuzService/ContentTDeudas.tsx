import { Link } from "react-router-dom";

export function ContentTDeudas({
  codigo_Deuda,
  Monto,
  FechaVencimientoPago,
  Estado,
  FkCodigoCliente,
}: {
  codigo_Deuda: string;
  Monto: number;
  FechaVencimientoPago: string;
  Estado: string | undefined;
  FkCodigoCliente: string;
}) {
  return (
    <tr className="">
      <th scope="row" className="px-6 py-4 text-gray-700">
        {codigo_Deuda}
      </th>
      <td className="px-6 py-4 text-gray-700">S/.{Monto}</td>
      <td className="px-6 py-4 text-gray-700">{FechaVencimientoPago}</td>
      <td className="px-6 py-4 text-gray-700">{Estado}</td>
      <td className="px-6 py-4 text-gray-700">{FkCodigoCliente}</td>
      <td className="px-6 py-4 text-gray-700 ">
        {Estado === "Pagado" ? (
          <span className="text-green-800">Pagado</span>
        ) : (
          <Link
            to={`/Servicios/Luz/RealizarPago?codigoDeuda=${codigo_Deuda}&MontoPago=${Monto}`}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Pagar
          </Link>
        )}
      </td>
    </tr>
  );
}