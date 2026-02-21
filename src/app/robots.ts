import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                // Permitir a todos los bots indexar el sitio público
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/login',
                    '/registro',
                    '/dashboard/',
                ],
            },
            {
                // Bloquear GPTBot (OpenAI) de scraping
                userAgent: 'GPTBot',
                disallow: '/',
            },
        ],
        sitemap: 'https://www.amcagencyweb.com/sitemap.xml',
        host: 'https://www.amcagencyweb.com',
    }
}
