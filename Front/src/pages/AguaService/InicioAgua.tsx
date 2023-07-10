import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { obtenerDeuda } from "../../api/agua.api.ts";
import { DeudaAgua } from "../../Types/aguaService.ts";
import { Regresar } from "../../components/Regresar.tsx";
import toast from "react-hot-toast";

export function DetallesDeudaAgua() {
  const { register, handleSubmit } = useForm();
  const [errorMessage] = useState("");
  const [deudaAgua, setDeudaAgua] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    const data2: DeudaAgua= {codigo_cliente: parseInt(data.codigoCliente)};
    const res = await obtenerDeuda(data2);
    setDeudaAgua(res.data.deuda);
    if(deudaAgua == '0.00'){
      toast.success("La deuda ya ha sido pagada.", {
        position: "top-center",
        style: {
          background: "#202033",
          color: "#fff",
        },
      });
    }
   
  });

  return (
    <>
      <Regresar to="/Servicios/" />
      <h1>Detalles de la Deuda de Agua</h1>

      <form onSubmit={onSubmit}>
        <input type="number" {...register("codigoCliente", { required: true })} placeholder="Código de cliente" />
        <button type="submit">Buscar</button>
      </form>

      {deudaAgua ? (
        <div>
          
          <p>Deuda: {deudaAgua}</p>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
    </>
  );
}
