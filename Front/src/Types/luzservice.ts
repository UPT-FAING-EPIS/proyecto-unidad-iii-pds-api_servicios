export interface Clientes {
    CodigoDeuda: string;
    FkCodigoCliente: string;
    Monto: number;
    FechaVencimientoPago: string; 
    Estado: string; 
    Situacion?:string;
  }
  
  export interface Deuda {
    codigo_deuda: string;
    FkCodigoCliente: string;
    FechaVencimientoPago: string; 
    Monto: number;
    Estado: string; 
  }
  
  export interface Pagos {
    CodigoPago: string;
    CodigoDeuda: number;
    Pago: number;
    FechaPago: string; 
  }
  