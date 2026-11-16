# Tuki3d — Catálogo Web Oficial & Pedidos
> *"Impresiones 3D a tu medida"*

Aplicación web de catálogo y pedidos de alto impacto visual y animaciones fluidas para **Tuki3d**, diseñada para producción 24/7 en **Vercel** con backend en **Supabase**.

---

## 🚀 Tecnologías
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Animaciones:** Framer Motion (Splash Screen de 3s, Carrusel Destacados, Filtros animados, Modales)
- **Tipografía:** Poppins (`next/font/google`)
- **Iconografía:** Lucide React
- **Backend & Auth:** Supabase (PostgreSQL + Supabase Storage + Supabase Auth)
- **Keep-Alive:** Endpoint `/api/ping` para evitar la pausa por inactividad del plan gratuito de Supabase

---

## 📂 Estructura de Assets
Los recursos de marca y fotos reales están ubicados en `public/images/`:
- `public/images/logo-tuki3d.png`: Logo oficial de la marca.
- `public/images/fondo-1.png`: Textura violeta oficial para pantallas móviles.
- `public/images/fondo-2.png`: Textura violeta oficial para pantallas de escritorio.
- `public/images/soporte-controles-auricular.png`: Foto real del producto gamer.
- `public/images/organizador-nintendo-switch.png`: Foto real del soporte de juegos.

---

## 🛠️ Comandos Locales
```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilación de producción
npm run build

# Iniciar servidor de producción
npm run start
```
