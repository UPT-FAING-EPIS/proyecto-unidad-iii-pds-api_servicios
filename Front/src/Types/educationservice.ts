export type Deudor = {
  CodigoDeuda: number;
  fkCodigoAlumno: string;
  CantidadDeuda: string;
  FechaVencimiento: string;
  Estado: boolean;
  Situacion?:string;
};
export type Deuda = {
  CodigoDeuda: number;
  MontoPago: number;
};
export type Pago = {
  CodigoPago: number;
  FKCodigoDeuda: number;
  MontoPago: string;
  FechaPago: string;
};
