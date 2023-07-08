import { CardOptions } from "../../components/CardOptions";
import { Regresar } from "../../components/Regresar";

export function PagarDeudas() {
  return (
    <>
      <Regresar to="/Servicios/Educacion" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Elija la entidad</h1>
        <div className="max-w-md mx-auto gap-10 flex flex-row">
          <CardOptions
            imageSrc="https://seeklogo.com/images/U/universidad-privada-de-tacna-logo-3E1EE39EEA-seeklogo.com.png"
            altText="Logo Upt"
            to="/Servicios/Educacion/BusquedaPago"
          />
          <CardOptions
            imageSrc="https://scontent.ftcq1-1.fna.fbcdn.net/v/t1.6435-9/117724849_3288405121254173_8630798209598129302_n.jpg?_nc_cat=106&cb=99be929b-59f725be&ccb=1-7&_nc_sid=8631f5&_nc_eui2=AeFPV0EM9ny2X0-yM5hCqobHZQZuBXgKkullBm4FeAqS6Qq2eKO3WL7CobS8idp4CU3bAayLXmbce0qj_23uJerT&_nc_ohc=PEbUN0v0m-8AX8bgUAl&_nc_ht=scontent.ftcq1-1.fna&oh=00_AfCCOcDJh4zn-vzq_BGPpd4C3_ie_n8k5UQwDytDb-BAzA&oe=64CFD8A6"
            altText="Logo Unjbg"
            to="/"
          />
        </div>
      </div>
    </>
  );
}
