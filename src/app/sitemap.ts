import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.amcagencyweb.com'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    return [
        // ── Páginas Principales ──
        {
            url: `${BASE_URL}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/registro`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/login`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },

        // ── Servicios ──
        {
            url: `${BASE_URL}/servicios/renting-tecnologico`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/servicios/desarrollo-web`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/servicios/cloud-infrastructure`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },

        // ── Empresa ──
        {
            url: `${BASE_URL}/empresa/sobre-nosotros`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/empresa/portafolio`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/empresa/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
        },

        // ── Políticas ──
        {
            url: `${BASE_URL}/politicas/privacidad`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/politicas/terminos`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]
}
