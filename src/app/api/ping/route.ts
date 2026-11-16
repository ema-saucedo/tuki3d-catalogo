import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();

  // Si no está configurado Supabase aún en variables de entorno, responde ok indicando modo offline
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        status: 'ok',
        mode: 'offline_or_unconfigured',
        timestamp,
        message: 'Tuki3d Keep-Alive activo. Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para enlazar la base de datos.',
      },
      { status: 200 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('configuracion')
      .select('clave')
      .limit(1);

    if (error) {
      console.error('[Tuki3d Keep-Alive] Error al consultar Supabase:', error);
      return NextResponse.json(
        {
          status: 'error',
          error: error.message,
          timestamp,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: 'ok',
        timestamp,
        data,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[Tuki3d Keep-Alive] Excepción no controlada:', err);
    return NextResponse.json(
      {
        status: 'error',
        error: err instanceof Error ? err.message : 'Error desconocido',
        timestamp,
      },
      { status: 500 }
    );
  }
}
