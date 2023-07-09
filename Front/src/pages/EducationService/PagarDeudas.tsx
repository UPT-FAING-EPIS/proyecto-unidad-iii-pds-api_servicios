import { CardOptions } from "../../components/CardOptions";
import { Regresar } from "../../components/Regresar";
import logoupt from "../../assets/images/LogoUpt.png"
import logounjbg from "../../assets/images/LogoUnjbg.png"
export function PagarDeudas() {
  return (
    <>
      <Regresar to="/Servicios/Educacion" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Elija la entidad</h1>
        <div className="max-w-md mx-auto gap-10 flex flex-row">
          <CardOptions
            imageSrc={logoupt}
            altText="Logo Upt"
            to="/Servicios/Educacion/BusquedaPago"
          />
          <CardOptions
            imageSrc={logounjbg}
            altText="Logo Unjbg"
            to="/"
          />
        </div>
      </div>
    </>
  );
}
