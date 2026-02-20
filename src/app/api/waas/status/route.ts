import { NextRequest, NextResponse } from 'next/server'
import { waasService } from '@/services/waas'

// GET /api/waas/status?domain=www.turbobrandcol.com
// Endpoint PÚBLICO — llamado por waas-lock.js desde el sitio del cliente
export async function GET(req: NextRequest) {
    const domain = req.nextUrl.searchParams.get('domain')
    if (!domain) {
        return NextResponse.json({ blocked: false, error: 'Domain required' }, { status: 400 })
    }

    // CORS: permitir requests desde cualquier dominio (el cliente instala el script en su web)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
    }

    try {
        const status = await waasService.getStatusByDomain(domain)
        if (!status) {
            return NextResponse.json({ blocked: false }, { headers })
        }
        return NextResponse.json(status, { headers })
    } catch {
        return NextResponse.json({ blocked: false }, { headers })
    }
}

// OPTIONS: preflight CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
    })
}
