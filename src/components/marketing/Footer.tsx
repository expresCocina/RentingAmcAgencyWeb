"use client";
import { motion } from "framer-motion";
import { Mail, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/* ── Deep Links para abrir la app nativa en móvil ── */
const SOCIAL = {
  facebook: {
    /* intent para Android / universal link iOS */
    app: "fb://page/Amcagencycol",
    web: "https://www.facebook.com/Amcagencycol/?locale=es_LA",
  },
  instagram: {
    app: "instagram://user?username=amcagencycol",
    web: "https://www.instagram.com/amcagencycol/",
  },
};

/**
 * Intenta abrir la app nativa; si falla en 300ms abre la web.
 */
function openSocial(appUrl: string, webUrl: string) {
  const start = Date.now();
  window.location.href = appUrl;
  setTimeout(() => {
    // Si pasaron menos de 800ms la app no abrió → fallback al navegador
    if (Date.now() - start < 800) {
      window.open(webUrl, "_blank", "noopener,noreferrer");
    }
  }, 300);
}

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-white/5 py-12 md:py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
              {t.footer.branding.brand}{" "}
              <span className="text-blue-500">{t.footer.branding.highlight}</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t.footer.branding.desc}
            </p>
          </motion.div>

          {/* Servicios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-bold mb-3 text-sm">{t.footer.services.title}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/servicios/desarrollo-web" className="hover:text-blue-500 transition">{t.footer.services.web}</a></li>
              <li><a href="/servicios/cloud-infrastructure" className="hover:text-blue-500 transition">{t.footer.services.cloud}</a></li>
              <li><a href="/servicios/renting-tecnologico" className="hover:text-blue-500 transition">{t.footer.services.renting}</a></li>
            </ul>
          </motion.div>

          {/* Empresa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-bold mb-3 text-sm">{t.footer.company.title}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/empresa/sobre-nosotros" className="hover:text-blue-500 transition">{t.footer.company.about}</a></li>
              <li><a href="/empresa/portafolio" className="hover:text-blue-500 transition">{t.footer.company.portfolio}</a></li>
              <li><a href="/empresa/blog" className="hover:text-blue-500 transition">{t.footer.company.blog}</a></li>
            </ul>
          </motion.div>

          {/* Redes Sociales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-bold mb-3 text-sm">{t.footer.connect.title}</h4>
            <div className="flex flex-wrap gap-3">

              {/* Facebook → abre app nativa */}
              <button
                onClick={() => openSocial(SOCIAL.facebook.app, SOCIAL.facebook.web)}
                aria-label="Síguenos en Facebook"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition group"
              >
                <Facebook className="w-4 h-4 opacity-60 group-hover:opacity-100" />
              </button>

              {/* Instagram → abre app nativa */}
              <button
                onClick={() => openSocial(SOCIAL.instagram.app, SOCIAL.instagram.web)}
                aria-label="Síguenos en Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 hover:text-pink-500 transition group"
              >
                <Instagram className="w-4 h-4 opacity-60 group-hover:opacity-100" />
              </button>

              {/* Email directo */}
              <a
                href="mailto:contacto@amcagencyweb.com"
                aria-label="Envíanos un email"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition group"
              >
                <Mail className="w-4 h-4 opacity-60 group-hover:opacity-100" />
              </a>
            </div>

            {/* Links de texto para SEO */}
            <div className="mt-3 space-y-1">
              <a
                href={SOCIAL.facebook.web}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-gray-600 hover:text-blue-400 transition"
              >
                facebook.com/Amcagencycol
              </a>
              <a
                href={SOCIAL.instagram.web}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-gray-600 hover:text-pink-400 transition"
              >
                instagram.com/amcagencycol
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divisor */}
        <div className="border-t border-white/5 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs gap-3">
            <p>{t.footer.copyright}</p>
            <div className="flex gap-4 md:gap-6">
              <a href="/politicas/privacidad" className="hover:text-white transition">{t.footer.privacy}</a>
              <a href="/politicas/terminos" className="hover:text-white transition">{t.footer.terms}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
