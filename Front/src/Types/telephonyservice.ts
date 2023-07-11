export type Factura = {
    id : number;
    cliente : number;
    plan : number;
    monto : number;
    fecha_emision : string;
    fecha_vencimiento : string;
    pagado: boolean;
    estado:boolean;
  };
  export type Llamadas = {
    id : number;
    fecha_hora: string;
    duracion: number;
    cliente_id : number;
  };
  export type Plan = {
    id : number;
    nombre : string;
    costo_mensual : number;
    minutos_incluidos : number;
    datos_incluidos : number;
  };
  export type Cliente = {
    id : number;
    nombre : string;
    direccion  : string;
    telefono  : string;
    cuenta_bancaria  : string;
    servicio_activo :boolean;
  };
  