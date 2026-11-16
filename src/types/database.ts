export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  destacado: boolean;
  activo: boolean;
  tamanos: string[];
  created_at?: string;
  updated_at?: string;
}

export type PedidoEstado = 'Pendiente' | 'En producción' | 'Entregado' | 'Cancelado';

export interface Pedido {
  id: string;
  producto_id: string | null;
  producto_nombre: string;
  tamano_elegido: string | null;
  precio: number;
  cliente_nombre: string;
  cliente_telefono: string;
  cliente_email: string;
  aclaraciones: string | null;
  estado: PedidoEstado;
  created_at: string;
}

export interface Configuracion {
  clave: string;
  valor: string;
  descripcion?: string;
  updated_at?: string;
}
