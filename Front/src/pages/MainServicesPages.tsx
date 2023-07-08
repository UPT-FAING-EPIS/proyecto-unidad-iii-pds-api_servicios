import { ServiceCard } from "../components/ServiceCard";

export function MainServicesPages() {
  return (
    <div className="py-8 px-4">
      <h1 className="text-black text-3xl font-bold mb-4">
        Escoga su opción de pago
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <ServiceCard
          icon="BsBook"
          iconColor="text-orange-300"
          route="/Servicios/Educacion"
          title="Pago de Educación"
        />
        <ServiceCard
          icon="BsGlobe"
          iconColor="text-gray-300"
          route="/Servicios/Internet"
          title="Pago de Internet"
        />
        <ServiceCard
          icon="BsLightning"
          iconColor="text-yellow-400"
          route="/Servicios/Luz"
          title="Pago de Luz"
        />
        <ServiceCard
          icon="BsDroplet"
          iconColor="text-sky-400"
          route="/Servicios/Agua"
          title="Pago de Agua"
        />
        <ServiceCard
          icon="BsPhone"
          iconColor="text-gray-400"
          route="/Servicios/Telefonia"
          title="Pago de Telefonía"
        />
        <ServiceCard
          icon="BsPhone"
          iconColor="text-gray-400"
          route="/Cliente"
          title="Clientes"
        />
        
      </div>
    </div>
  );
}
