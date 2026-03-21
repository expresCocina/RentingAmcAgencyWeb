"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── WhatsApp links ────────────────────────────────────────────────
const WA_BASE = "https://wa.me/573138537261";
const waLink = (msg) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;
const WA_GENERAL = waLink("Hola, quiero más información sobre los servicios de AMC Agency");
const WA_LANDING = waLink("Hola, vi su landing y quiero información sobre sus servicios digitales");

// ─── useCountUp hook ───────────────────────────────────────────────
function useCountUp(target, suffix = "", duration = 2000) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0" + suffix);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const isDecimal = target % 1 !== 0;
          let start = 0;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start = Math.min(start + step, target);
            setDisplay(
              (isDecimal ? start.toFixed(1) : Math.round(start)) + suffix
            );
            if (start >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix, duration]);

  return { ref, display };
}

// ─── Counter card ──────────────────────────────────────────────────
function StatCard({ value, suffix, label, icon }) {
  const { ref, display } = useCountUp(value, suffix);
  return (
    <div ref={ref} className="text-center p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
      <span className="text-3xl">{icon}</span>
      <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">{display}</p>
      <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{label}</p>
    </div>
  );
}

// ─── Portfolio projects ────────────────────────────────────────────
const projects = [
  { title: "CRM Vida Digital", category: "Software de Gestión", img: "/portafolio/crm-vida-digital.png", link: "https://crm-vida-digitalcol.vercel.app" },
  { title: "Elegancia Atemporal", category: "E-commerce de Lujo", img: "/portafolio/elegancia-atemporal.png", link: "https://www.cycrelojeria.com" },
  { title: "Lyon Visión CRM", category: "HealthTech / Óptica", img: "/portafolio/lyon-vision.png", link: "https://crmopticalyonvision.vercel.app" },
  { title: "Taller de Italia", category: "Landing Premium", img: "/portafolio/taller-italia.png", link: "https://www.italiatelier.com" },
  { title: "Turbo Brand", category: "Agencia de Marketing", img: "/portafolio/turbo-brand.png", link: "https://www.turbobrandcol.com" },
];

// ─── Services data ─────────────────────────────────────────────────
const services = [
  {
    id: "ads",
    name: "Publicidad Digital",
    emoji: "📣",
    accent: "from-pink-500 to-rose-500",
    accentBg: "bg-pink-500/10",
    accentBorder: "border-pink-500/30",
    accentText: "text-pink-400",
    accentRing: "ring-pink-500/50",
    plans: [
      {
        name: "STARTER", price: "$350.000/mes", popular: false,
        desc: "Para negocios que inician en publicidad digital",
        features: ["1 plataforma (Meta o Google)", "Hasta $500k presupuesto en pauta", "2 campañas activas", "Reporte mensual", "Soporte por WhatsApp"],
        waMsg: "Hola, me interesa el plan STARTER de Publicidad Digital (Meta & Google Ads)",
      },
      {
        name: "GROWTH", price: "$650.000/mes", popular: true,
        desc: "Para negocios que quieren escalar con ambas plataformas",
        features: ["Meta Ads + Google Ads", "Hasta $2M presupuesto en pauta", "Campañas ilimitadas", "Pixel y CAPI configurados", "Reporte semanal", "Reunión de estrategia mensual"],
        waMsg: "Hola, me interesa el plan GROWTH de Publicidad Digital (Meta & Google Ads)",
      },
      {
        name: "SCALE", price: "Personalizado", popular: false,
        desc: "Para marcas con altos volúmenes de inversión",
        features: ["Presupuesto ilimitado", "Estrategia multicanal", "A/B testing avanzado", "Equipo dedicado", "Reporting en tiempo real", "Consultoría estratégica"],
        waMsg: "Hola, me interesa el plan SCALE de Publicidad Digital (Meta & Google Ads)",
      },
    ],
  },
  {
    id: "seo",
    name: "SEO & Posicionamiento",
    emoji: "🔍",
    accent: "from-lime-400 to-green-500",
    accentBg: "bg-lime-500/10",
    accentBorder: "border-lime-500/30",
    accentText: "text-lime-400",
    accentRing: "ring-lime-500/50",
    plans: [
      {
        name: "LOCAL SEO", price: "$280.000/mes", popular: false,
        desc: "Para negocios locales y pymes",
        features: ["Auditoría SEO inicial", "5 keywords objetivo", "Optimización On-Page", "Google My Business", "Reporte mensual"],
        waMsg: "Hola, me interesa el plan LOCAL SEO de SEO & Posicionamiento",
      },
      {
        name: "GROWTH SEO", price: "$550.000/mes", popular: true,
        desc: "Para empresas que quieren liderar su sector",
        features: ["Todo lo del plan Local", "20 keywords objetivo", "Link building mensual", "Contenido SEO (2 artículos/mes)", "Reporte semanal", "Reunión estratégica"],
        waMsg: "Hola, me interesa el plan GROWTH SEO de SEO & Posicionamiento",
      },
      {
        name: "ENTERPRISE", price: "Personalizado", popular: false,
        desc: "Para marcas con alta competencia digital",
        features: ["Keywords ilimitados", "Estrategia de contenido completa", "Link building agresivo", "Equipo SEO dedicado", "Dashboard en tiempo real"],
        waMsg: "Hola, me interesa el plan ENTERPRISE de SEO & Posicionamiento",
      },
    ],
  },
  {
    id: "social",
    name: "Redes Sociales",
    emoji: "📱",
    accent: "from-purple-500 to-fuchsia-500",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
    accentText: "text-purple-400",
    accentRing: "ring-purple-500/50",
    plans: [
      {
        name: "STARTER SOCIAL", price: "$320.000/mes", popular: false,
        desc: "Para negocios que buscan presencia básica",
        features: ["1 red social", "12 publicaciones/mes", "Diseño de contenido", "Reporte mensual"],
        waMsg: "Hola, me interesa el plan STARTER SOCIAL de Redes Sociales",
      },
      {
        name: "GROWTH SOCIAL", price: "$580.000/mes", popular: true,
        desc: "Para marcas que quieren crecer en múltiples redes",
        features: ["3 redes sociales", "24 publicaciones/mes", "Stories y Reels", "Calendario editorial", "Reporte quincenal"],
        waMsg: "Hola, me interesa el plan GROWTH SOCIAL de Redes Sociales",
      },
      {
        name: "FULL PRESENCE", price: "Personalizado", popular: false,
        desc: "Para marcas con alta demanda de contenido",
        features: ["Todas las redes", "Contenido diario", "Community manager", "Estrategia de influencers", "Dashboard analítico"],
        waMsg: "Hola, me interesa el plan FULL PRESENCE de Redes Sociales",
      },
    ],
  },
  {
    id: "email",
    name: "Email Marketing",
    emoji: "✉️",
    accent: "from-sky-400 to-blue-600",
    accentBg: "bg-sky-500/10",
    accentBorder: "border-sky-500/30",
    accentText: "text-sky-400",
    accentRing: "ring-sky-500/50",
    plans: [
      {
        name: "EMAIL STARTER", price: "$250.000/mes", popular: false,
        desc: "Para negocios que quieren arrancar con email",
        features: ["Hasta 3.000 contactos", "2 campañas/mes", "Template premium", "Reporte de métricas"],
        waMsg: "Hola, me interesa el plan EMAIL STARTER de Email Marketing",
      },
      {
        name: "EMAIL GROWTH", price: "$480.000/mes", popular: true,
        desc: "Para negocios que quieren automatizar ventas",
        features: ["Hasta 15.000 contactos", "Campañas ilimitadas", "3 flujos automatizados", "A/B Testing", "Reporte semanal"],
        waMsg: "Hola, me interesa el plan EMAIL GROWTH de Email Marketing",
      },
      {
        name: "EMAIL SCALE", price: "Personalizado", popular: false,
        desc: "Para empresas con grandes bases de datos",
        features: ["Contactos ilimitados", "Automatizaciones avanzadas", "Integración con CRM", "Equipo dedicado", "Dashboard en tiempo real"],
        waMsg: "Hola, me interesa el plan EMAIL SCALE de Email Marketing",
      },
    ],
  },
];

// ─── Why us cards ──────────────────────────────────────────────────
const whyUs = [
  { icon: "🚀", title: "Entregamos en 7 días", desc: "No en semanas ni meses. Tu proyecto listo y funcionando rápido." },
  { icon: "📍", title: "Somos colombianos", desc: "Entendemos tu mercado, tu cliente y tu cultura de negocio." },
  { icon: "💬", title: "Soporte real por WhatsApp", desc: "Sin tickets ni esperas. Te respondemos directamente." },
  { icon: "📊", title: "Resultados medibles", desc: "Sabes exactamente en qué se invierte tu dinero y qué retorna." },
  { icon: "🔒", title: "Sin permanencia", desc: "Te quedas porque quieres, no porque estás atrapado." },
  { icon: "⚡", title: "Stack tecnología elite", desc: "Next.js, AWS y Supabase — los mismos que usan las grandes empresas." },
];

// ─── Testimonials ──────────────────────────────────────────────────
const testimonials = [
  {
    initial: "C", color: "bg-blue-600", name: "Carlos M.", business: "Óptica Lyon Visión, Neiva",
    text: "Antes teníamos una web antigua que nadie veía. AMC nos hizo el sistema completo y ahora agendamos citas online. Nuestras ventas subieron un 40%.",
  },
  {
    initial: "V", color: "bg-pink-600", name: "Valentina R.", business: "Taller de Italia, Bogotá",
    text: "La landing que nos hicieron convierte increíble. En el primer mes conseguimos 23 clientes nuevos solo por la página web.",
  },
  {
    initial: "A", color: "bg-purple-600", name: "Andrés P.", business: "Turbo Brand, Medellín",
    text: "El equipo de AMC entiende el marketing digital de verdad. Las campañas de Meta Ads nos generan leads todos los días a buen costo.",
  },
];

// ══════════════════════════════════════════════════════════════════
export default function LandingAgenciaDigital() {
  const [activeService, setActiveService] = useState("ads");
  const current = services.find((s) => s.id === activeService);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 1 — HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Fondo glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[11px] font-black tracking-[0.25em] uppercase mb-8">
              🏆 Agencia Digital · Neiva, Colombia
            </span>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6">
              ¿Tu negocio necesita{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                más clientes?
              </span>
              <br />
              Nosotros te los{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                conseguimos.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-light">
              Somos <strong className="text-white font-bold">AMC Agency</strong> — la agencia digital de Neiva que ya ayudó a más de{" "}
              <strong className="text-yellow-400">47 negocios colombianos</strong> a vender más por internet.
              Páginas web, publicidad, SEO y redes sociales desde{" "}
              <strong className="text-white">$250.000/mes.</strong>
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center gap-3">
              <motion.a
                href={WA_LANDING}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base md:text-lg tracking-wide shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all"
              >
                <svg className="w-6 h-6 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Quiero más clientes → Hablar ahora
              </motion.a>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                <span className="text-yellow-400">⚡</span> Respondemos en menos de 10 minutos
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 2 — STATS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-500 text-xs font-black tracking-[0.3em] uppercase mb-10">
            Números que hablan por nosotros
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value={47} suffix="+" label="Proyectos entregados" icon="🚀" />
            <StatCard value={99.9} suffix="%" label="Uptime garantizado" icon="⬆️" />
            <StatCard value={320} suffix="%" label="ROI promedio" icon="📈" />
            <StatCard value={5} suffix="+" label="Años de experiencia" icon="🏆" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 3 — PORTAFOLIO
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Negocios reales.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Resultados reales.
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Estos son algunos proyectos que hemos construido para negocios colombianos como el tuyo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p, i) => (
              <motion.a
                key={i}
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-64 md:h-72 rounded-3xl overflow-hidden border border-white/10 bg-[#111] block"
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  loading="lazy"
                  className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-2 p-4">
                  <p className="text-yellow-400 text-[10px] font-black tracking-widest uppercase">{p.category}</p>
                  <p className="text-white text-xl font-black tracking-tight text-center">{p.title}</p>
                  <span className="text-sm text-white/80 mt-1">Ver proyecto →</span>
                </div>
                {/* Bottom info always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-5 group-hover:opacity-0 transition-opacity">
                  <p className="text-yellow-400 text-[9px] font-black tracking-widest uppercase mb-1">{p.category}</p>
                  <p className="text-white font-bold text-lg leading-tight">{p.title}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 4 — SERVICIOS Y PRECIOS (tabs)
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">
              Elige lo que tu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                negocio necesita
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Sin permanencia forzada. Sin costos ocultos. Cancelás cuando quieras.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveService(s.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                  activeService === s.id
                    ? `bg-gradient-to-r ${s.accent} text-white border-transparent shadow-lg`
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{s.emoji}</span> {s.name}
              </button>
            ))}
          </div>

          {/* Plans grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {current.plans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative p-7 rounded-3xl border ${current.accentBorder} ${current.accentBg} ${
                    plan.popular ? `ring-2 ${current.accentRing}` : ""
                  }`}
                >
                  {plan.popular && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-widest uppercase px-4 py-1 rounded-full bg-gradient-to-r ${current.accent} text-white`}>
                      ⭐ Más popular
                    </span>
                  )}
                  <p className={`text-xs font-black tracking-widest uppercase ${current.accentText} mb-1`}>{plan.name}</p>
                  <p className="text-3xl font-black text-white mb-1">{plan.price}</p>
                  <p className="text-gray-400 text-sm mb-5">{plan.desc}</p>
                  <ul className="space-y-2 mb-7">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className={`mt-0.5 text-xs ${current.accentText}`}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waLink(plan.waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center py-3 rounded-2xl bg-gradient-to-r ${current.accent} text-white font-black text-xs tracking-widest uppercase hover:opacity-90 transition-opacity`}
                  >
                    Empezar ahora →
                  </a>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 5 — POR QUÉ ELEGIRNOS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
              ¿Por qué{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                AMC Agency
              </span>{" "}
              y no otra agencia?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-colors"
              >
                <span className="text-3xl mb-4 block">{w.icon}</span>
                <h3 className="text-white font-black text-lg mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 6 — TESTIMONIOS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-black/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-center mb-14">
            Lo que dicen{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              nuestros clientes
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-7 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.business}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECCIÓN 7 — CTA FINAL
      ═══════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10 pointer-events-none" />
        <div className="absolute inset-0 border-y border-yellow-500/10 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-5">
              ¿Listo para conseguir{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                más clientes?
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light">
              Escríbenos ahora y en menos de 10 minutos te decimos exactamente qué necesita tu negocio.
            </p>
            <motion.a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              animate={{ boxShadow: ["0 0 20px rgba(37,211,102,0.3)", "0 0 50px rgba(37,211,102,0.6)", "0 0 20px rgba(37,211,102,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-6 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-lg transition-colors"
            >
              <svg className="w-7 h-7 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              💬 Escribir al WhatsApp ahora
            </motion.a>
            <p className="mt-6 text-gray-500 text-xs tracking-widest uppercase">
              🔒 Sin compromiso · Sin contratos forzados · Respondemos al instante
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER MÍNIMO
      ═══════════════════════════════════════════════════════ */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <p className="text-white font-black text-xl tracking-tighter mb-1">
          AMC<span className="text-yellow-400">.</span>
        </p>
        <p className="text-gray-600 text-xs">© {new Date().getFullYear()} AMC Agency · Neiva, Colombia · Todos los derechos reservados</p>
      </footer>

      {/* ═══════════════════════════════════════════════════════
          BARRA FLOTANTE MÓVIL
      ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <a
          href={WA_GENERAL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black py-4 px-6 text-base transition-colors shadow-2xl shadow-green-500/40"
        >
          <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          💬 Hablar con un asesor ahora →
        </a>
      </div>

      {/* Espacio extra en mobile para la barra flotante */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
