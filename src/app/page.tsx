"use client";

import { Navbar } from "@/components/marketing/Navbar";
import { Stats } from "@/components/marketing/Stats";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Process } from "@/components/marketing/Process";
import { Pricing } from "@/components/marketing/Pricing";
import { TechStack } from "@/components/marketing/TechStack";
import { Reveal } from "@/components/marketing/Reveal";
import { Showcase } from "@/components/marketing/Showcase";
import { FAQ } from "@/components/marketing/FAQ";
import { HeroVisual } from "@/components/marketing/HeroVisual";
import { Footer } from "@/components/marketing/Footer";
import { useLanguage } from "@/context/LanguageContext"; // <-- 1. Importamos el contexto

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#050505]">
      <Navbar />

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
              <p className="text-gray-400 text-sm md:text-base lg:text-lg max-w-xl font-light leading-relaxed">
                {t.hero.description}
              </p>
            </Reveal>

            <Reveal>
              <div className="flex flex-wrap gap-3 md:gap-4 pt-1 md:pt-2">
                <a href="#renting" className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs md:text-sm font-bold rounded-full transition-all shadow-lg shadow-blue-500/30">
                  {t.hero.btnPrimary}
                </a>
                <a href="#proyectos" className="px-6 md:px-8 py-3 md:py-4 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs md:text-sm font-medium rounded-full transition-all backdrop-blur-sm">
                  {t.hero.btnSecondary}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="hidden md:flex h-[380px] lg:h-[500px] relative justify-center items-center">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Secciones automáticas */}
      <Stats />
      <TechStack />
      <div id="servicios"><Reveal width="100%"><ServicesGrid /></Reveal></div>
      <div id="proyectos"><Reveal width="100%"><Showcase /></Reveal></div>
      <Process />
      <div id="renting"><Reveal width="100%"><Pricing /></Reveal></div>
      <FAQ />
      <div id="contacto"><Reveal width="100%"><ContactForm /></Reveal></div>

      <Footer />
    </main>
  );
}