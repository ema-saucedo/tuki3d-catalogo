-- ==============================================================================
-- TUKI3D - ESQUEMA DE BASE DE DATOS SUPABASE
-- "Impresiones 3D a tu medida"
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: configuracion
CREATE TABLE IF NOT EXISTS public.configuracion (
    clave TEXT PRIMARY KEY,
    valor TEXT NOT NULL,
    descripcion TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserción inicial de número de WhatsApp (fallback: 5493718545385)
INSERT INTO public.configuracion (clave, valor, descripcion)
VALUES ('whatsapp_number', '5493718545385', 'Número receptor de pedidos en WhatsApp')
ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor;

-- 3. TABLA: productos
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio NUMERIC NOT NULL CHECK (precio >= 0),
    categoria TEXT NOT NULL,
    imagen_url TEXT NOT NULL,
    destacado BOOLEAN NOT NULL DEFAULT false,
    activo BOOLEAN NOT NULL DEFAULT true,
    tamanos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para búsquedas y filtros rápidos
CREATE INDEX IF NOT EXISTS idx_productos_destacado ON public.productos (destacado) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos (categoria) WHERE activo = true;

-- 4. TABLA: pedidos
CREATE TABLE IF NOT EXISTS public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id UUID REFERENCES public.productos(id) ON DELETE SET NULL,
    producto_nombre TEXT NOT NULL,
    tamano_elegido TEXT,
    precio NUMERIC NOT NULL,
    cliente_nombre TEXT NOT NULL,
    cliente_telefono TEXT NOT NULL,
    cliente_email TEXT NOT NULL,
    aclaraciones TEXT,
    estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En producción', 'Entregado', 'Cancelado')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON public.pedidos (estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON public.pedidos (created_at DESC);

-- 5. STORAGE BUCKET: productos-imagenes
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos-imagenes', 'productos-imagenes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. SEGURIDAD: ROW LEVEL SECURITY (RLS)
ALTER TABLE public.configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas para: configuracion
-- Lectura pública para obtener el número de WhatsApp y para el endpoint /api/ping
CREATE POLICY "Lectura publica de configuracion"
    ON public.configuracion FOR SELECT
    USING (true);

-- Solo usuarios administradores autenticados pueden modificar la configuración
CREATE POLICY "Edicion de configuracion solo admin"
    ON public.configuracion FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Políticas para: productos
-- Lectura pública de productos (para catálogo y carrusel)
CREATE POLICY "Lectura publica de productos"
    ON public.productos FOR SELECT
    USING (true);

-- Solo administradores pueden insertar, actualizar o eliminar productos
CREATE POLICY "Creacion de productos solo admin"
    ON public.productos FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Modificacion de productos solo admin"
    ON public.productos FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Eliminacion de productos solo admin"
    ON public.productos FOR DELETE
    TO authenticated
    USING (true);

-- Políticas para: pedidos
-- Clientes anónimos/públicos pueden registrar pedidos
CREATE POLICY "Clientes pueden crear pedidos"
    ON public.pedidos FOR INSERT
    WITH CHECK (true);

-- Solo administradores autenticados pueden ver la lista de pedidos
CREATE POLICY "Lectura de pedidos solo admin"
    ON public.pedidos FOR SELECT
    TO authenticated
    USING (true);

-- Solo administradores autenticados pueden actualizar el estado de un pedido
CREATE POLICY "Actualizacion de pedidos solo admin"
    ON public.pedidos FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Políticas para: storage.objects en bucket productos-imagenes
CREATE POLICY "Lectura publica de imagenes"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'productos-imagenes');

CREATE POLICY "Subida de imagenes solo admin"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'productos-imagenes');

CREATE POLICY "Actualizacion de imagenes solo admin"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'productos-imagenes');

CREATE POLICY "Eliminacion de imagenes solo admin"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'productos-imagenes');

-- 7. SEED DATA: PRODUCTOS INICIALES REALES Y DE EJEMPLO
INSERT INTO public.productos (nombre, descripcion, precio, categoria, imagen_url, destacado, activo, tamanos)
VALUES
(
    'Soporte para controles y auricular',
    'El toque final que le falta a tu setup. Ahorrá espacio en tu escritorio y exhibí hasta dos joysticks y tus auriculares siempre listos para jugar. Impresión 3D resistente con excelente terminación.',
    15000,
    'Setup & Gaming',
    '/images/soporte-controles-auricular.png',
    true,
    true,
    '["Estándar (2 controles + 1 auricular)"]'::jsonb
),
(
    'Organizador para juegos de Nintendo Switch',
    'Mantené tu colección de Nintendo Switch ordenada y a mano. Soporte impreso en 3D con ranuras individuales para cajas de juegos y detalle frontal en relieve.',
    12000,
    'Setup & Gaming',
    '/images/organizador-nintendo-switch.png',
    true,
    true,
    '["10 juegos", "15 juegos"]'::jsonb
),
(
    'Lámpara Cubo Led RGB Gamer',
    'Iluminá tu rincón gamer con estilo geométrico futurista. Fabricada en filamento translúcido con soporte negro mate, diseñada para tiras led o velas led seguras.',
    18500,
    'Decoración',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    false,
    true,
    '["12x12 cm", "16x16 cm"]'::jsonb
),
(
    'Llavero Articulado Dragón Custom',
    'Dragón fidget articulado impreso en una sola pieza con movimiento hiper fluido. Ideal para mochilas, llaves o desestresarse en el escritorio.',
    5500,
    'Llaveros',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    false,
    true,
    '["Chico (12 cm)", "Grande (18 cm)"]'::jsonb
);
