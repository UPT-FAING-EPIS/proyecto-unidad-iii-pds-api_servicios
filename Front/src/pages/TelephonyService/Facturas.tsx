import { useEffect, useState } from "react";
import { obtenerfactura } from "../../api/Telephony.ts";
import { Factura } from "../../Types/telephonyservice.ts";
import { Regresar } from "../../components/Regresar";

export function Facturas() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
  
    useEffect(() => {
      async function cargarFacturas() {
        try {
          const res = await obtenerfactura();
          setFacturas(res.data);
        } catch (error) {
          console.error(error);
        }
      }
      cargarFacturas();
    }, []);
  
    return (
      <>
        {<Regresar to="/Servicios/Telefonia" />}
        <div className="flex flex-col gap-4"></div>
        <h2 className="text-xl font-bold" >Lista de facturas</h2><br></br>
        <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Plan</th>
              <th className="border px-4 py-2">Monto</th>
              <th className="border px-4 py-2">Fecha de emisión</th>
              <th className="border px-4 py-2">Fecha de vencimiento</th>
              <th className="border px-4 py-2">Pagado</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td className="border text-center px-4 py-2">{factura.cliente}</td>
                <td className="border text-center px-4 py-2">{factura.plan}</td>
                <td className="border text-center px-4 py-2">{factura.monto}</td>
                <td className="border text-center px-4 py-2">{factura.fecha_emision}</td>
                <td className="border text-center px-4 py-2">{factura.fecha_vencimiento}</td>
                <td className={`border font-bold text-center px-4 py-2 ${factura.pagado ? 'text-green-600' : 'text-orange-500'}`}>{factura.pagado ? 'Sí' : 'No'}</td>
                <td className="border text-center px-4 py-2">{factura.estado ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div><br/>
      </>
    );
  }