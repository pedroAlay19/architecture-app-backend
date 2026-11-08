import { ValueTransformer } from "typeorm";

export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value, // Al guardar
  from: (value?: string | null) => (value == null ? value : parseFloat(value)), // Convierte el valor recibido
};