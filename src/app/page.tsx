"use client";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/marketing/Navbar";
import { Reveal } from "@/components/marketing/Reveal";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

// ── Lazy load de TODO lo que está below-the-fold ──────────────────────────────
// Esto divide el bundle JS inicial ~306KB → ~80KB en la primera carga
// y es el cambio más impactante para LCP y TBT.

const Stats = dynamic(() => import("@/components/marketing/Stats").then(m => ({ default: m.Stats })), { ssr: false });
const ServicesGrid = dynamic(() => import("@/components/marketing/ServicesGrid").then(m => ({ default: m.ServicesGrid })), { ssr: false });
const Process = dynamic(() => import("@/components/marketing/Process").then(m => ({ default: m.Process })), { ssr: false });
const Pricing = dynamic(() => import("@/components/marketing/Pricing").then(m => ({ default: m.Pricing })), { ssr: false });
const TechStack = dynamic(() => import("@/components/marketing/TechStack").then(m => ({ default: m.TechStack })), { ssr: false });
const Showcase = dynamic(() => import("@/components/marketing/Showcase").then(m => ({ default: m.Showcase })), { ssr: false });
const FAQ = dynamic(() => import("@/components/marketing/FAQ").then(m => ({ default: m.FAQ })), { ssr: false });
const ContactForm = dynamic(() => import("@/components/marketing/ContactForm").then(m => ({ default: m.ContactForm })), { ssr: false });
const Footer = dynamic(() => import("@/components/marketing/Footer").then(m => ({ default: m.Footer })), { ssr: false });

// HeroVisual - first load diferido también (carga tras hero text)
const HeroVisual = dynamic(() => import("@/components/marketing/HeroVisual").then(m => ({ default: m.HeroVisual })), { ssr: false });

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

      {/* ── HERO SECTION - SSR-friendly, texto visible inmediatamente ── */}
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-12 md:pt-28 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center h-full z-10">

          <div className="text-left space-y-5 md:space-y-6">
            <Reveal>
              <>
                <span className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-[0.2em] uppercase inline-block mb-2">
                  {t.hero.badge}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-white">
                  {t.hero.title1} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600">
                    {t.hero.title2}
                  </span>
                </h1>
              </>
            </Reveal>

            <Reveal>
              <p className="text-gray-300 text-base md:text-lg max-w-xl font-light leading-relaxed">
                {t.hero.description}
              </p>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
                <Link
                  href="#renting"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs md:text-sm tracking-widest uppercase transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
                >
                  {t.hero.btnPrimary}
                </Link>
                <Link
                  href="#proyectos"
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-xs md:text-sm tracking-wider uppercase transition-all"
                >
                  {t.hero.btnSecondary}
                </Link>
              </div>
            </Reveal>
          </div>

          {/* HeroVisual carga diferida - no bloquea LCP */}
          <div className="w-full h-[350px] md:h-[450px] lg:h-[500px] relative mt-8 lg:mt-0">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Below-the-fold: carga lazy ── */}
      <Stats />
      <ServicesGrid />
      <Process />
      <Showcase />
      <Pricing />
      <TechStack />
      <FAQ />
      <section id="contacto" className="py-20 md:py-32 px-4 md:px-6 bg-black/30">
        <div className="max-w-3xl mx-auto">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
