import { obtenerplan,elegirplan } from "../../api/Telephony.ts";
import { Plan } from "../../Types/telephonyservice.ts";
import { useEffect, useState } from "react";
import { Regresar } from "../../components/Regresar";
import { useNavigate } from "react-router-dom";

export function Planes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarPlanes() {
      try {
        const res = await obtenerplan();
        setPlanes(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    cargarPlanes();
  }, []);

  const handleSeleccionarPlan = async (plan_id: number, costo_mensual: number) => {
    const idcliente = 1;
    try {
      // Llamar a la función "elegirplan" y pasar el plan_id y el costo_mensual
      await elegirplan(idcliente, plan_id, costo_mensual);
    } catch (error) {
      console.error(error);
    }finally {
      navigate(`/Servicios/Telefonia/RealizarPago?id_cliente=${idcliente}&monto=${costo_mensual}`);
    }
  };
  return (
    <>
      <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios/Telefonia" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">Elegir tu Plan</h1> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-xl p-6 flex flex-col justify-between"
          >
            <h2 className="text-xl font-bold mb-4">{plan.nombre}</h2>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 text-center font-semibold">
                <span className="font-bold "></span>{" "}
                S/{plan.costo_mensual}
              </p><hr />
              <div className="bg-blue-900 rounded-full py-2 px-4 mt-4 font-bold text-center">
              <p className="text-neutral-100" >
                <span className="font-semibold"></span>{" "}
                {plan.minutos_incluidos} Min
              </p>
              <p className="text-neutral-100">
                <span className="font-semibold"></span>{" "}
                {plan.datos_incluidos} GB
              </p>
              </div>
            </div>
            <button className="bg-blue-900 hover:bg-orange-600 text-white font-semibold py-2 px-4 mt-4 rounded-md" onClick={() => handleSeleccionarPlan(plan.id, plan.costo_mensual)}>
              ¡Me Interesa!
            </button>
          </div>
        ))}
      </div><br/><br/>
    </div>
    </>
  );
}
