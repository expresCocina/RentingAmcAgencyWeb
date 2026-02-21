"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { AMCLogo } from "./AMCLogo";

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t.nav.services, href: "/#servicios" },
    { name: t.nav.projects, href: "/#proyectos" },
    { name: t.nav.renting, href: "/#renting" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-3 md:px-4 transition-all duration-300 ${scrolled ? "drop-shadow-2xl" : ""
        }`}
    >
      <div
        className={`flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 rounded-full border transition-all duration-500 w-full max-w-5xl ${scrolled ? "bg-[#050505]/90 border-white/10 backdrop-blur-md" : "bg-transparent border-transparent"
          }`}
      >
        {/* LOGO */}
        <AMCLogo size="sm" withLink={true} />

        {/* MENÚ DESKTOP */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* CONTROLES DERECHA */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* BOTONES IDIOMA - VISIBLE EN MD+ */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-500">
            <button
              onClick={() => setLanguage("es")}
              className={language === "es" ? "text-blue-500" : "hover:text-white transition-colors"}
            >
              ES
            </button>
            <span>/</span>
            <button
              onClick={() => setLanguage("en")}
              className={language === "en" ? "text-blue-500" : "hover:text-white transition-colors"}
            >
              EN
            </button>
          </div>

          {/* BOTÓN ACCESO CLIENTES */}
          <Link
            href="/login"
            className="hidden md:flex items-center gap-1.5 px-3 md:px-5 py-2 md:py-2.5 bg-blue-600 text-white text-[9px] md:text-[10px] font-black tracking-widest uppercase rounded-full hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/40 whitespace-nowrap flex-shrink-0"
          >
            <LayoutDashboard size={12} />
            Mis Sitios
          </Link>

          {/* BOTÓN COTIZAR */}
          <button
            onClick={() => {
              if (window.location.pathname === "/") {
                document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
              } else {
                window.location.href = "/#contacto";
              }
            }}
            className="px-3 md:px-6 py-2 md:py-2.5 bg-white text-black text-[9px] md:text-[10px] font-black tracking-widest uppercase rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-blue-500/30 whitespace-nowrap flex-shrink-0"
          >
            {t.nav.quote}
          </button>

          {/* BOTÓN ADMIN DISCRETO */}
          <Link
            href="/login"
            title="Acceso Administrador"
            className="hidden lg:flex items-center gap-1 text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <ShieldCheck size={14} />
          </Link>

          {/* BOTÓN HAMBURGUESA */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MENÚ MOBILE DESPLEGABLE */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-3 right-3 mt-2 bg-[#050505]/95 border border-white/10 rounded-2xl backdrop-blur-md p-4 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all py-3 px-4 rounded-xl"
              >
                {link.name}
              </Link>
            ))}

            {/* ACCESOS MOBILE */}
            <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-black tracking-widest uppercase bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-500 transition-all"
              >
                <LayoutDashboard size={14} />
                Mis Sitios — Acceso Clientes
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-white py-2 px-4 rounded-xl hover:bg-white/5 transition-all"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            </div>

            {/* IDIOMA EN MOBILE */}
            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-white/10 px-4">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Idioma:</span>
              <button
                onClick={() => { setLanguage("es"); setMobileMenuOpen(false); }}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${language === "es" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                ES
              </button>
              <button
                onClick={() => { setLanguage("en"); setMobileMenuOpen(false); }}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${language === "en" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
              >
                EN
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};