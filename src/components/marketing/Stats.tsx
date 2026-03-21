"use client";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Activity, Users, Rocket, BarChart3 } from "lucide-react";

// Hook de conteo animado con IntersectionObserver
function useCountUp(target: number, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (!inView || !enabled) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(1)));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration, enabled]);

  return { ref, count };
}

function AnimatedStat({ value, suffix, label, icon, index }: {
  value: number; suffix: string; label: string; icon: React.ReactNode; index: number;
}) {
  const { ref, count } = useCountUp(value, 2000);
  const display = suffix === "%" && value === 99.9
    ? count.toFixed(1) + suffix
    : Math.round(count) + suffix;

  return (
    <div className="group flex flex-col items-center space-y-3 md:space-y-4">
      <div className="p-2.5 md:p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20 group-hover:border-blue-500/50 transition-colors shadow-lg shadow-blue-500/5">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 ref={ref as React.RefObject<HTMLHeadingElement>} className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">
          {display}
        </h3>
        <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold italic leading-tight">
          {label}
        </p>
      </div>
      <div className="w-10 md:w-12 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
        <motion.div
          initial={{ left: "-100%" }}
          whileInView={{ left: "0%" }}
          transition={{ duration: 1, delay: index * 0.2 }}
          className="absolute inset-0 bg-blue-500"
        />
      </div>
    </div>
  );
}

export const Stats = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black/50 border-y border-white/5">
      <motion.div
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-0"
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <p className="text-center text-gray-500 text-xs md:text-sm font-medium italic mb-10 md:mb-14">
          Resultados reales de negocios colombianos que ya confian en AMC Agency
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 text-center">
          <AnimatedStat value={99.9} suffix="%" label="Uptime Garantizado" icon={<Activity className="text-blue-500" size={18} />} index={0} />
          <AnimatedStat value={47} suffix="+" label="Proyectos Entregados" icon={<Rocket className="text-blue-500" size={18} />} index={1} />
          <AnimatedStat value={320} suffix="%" label="Retorno de Inversion" icon={<BarChart3 className="text-blue-500" size={18} />} index={2} />

          {/* 24/7 fijo - no anima */}
          <div className="group flex flex-col items-center space-y-3 md:space-y-4">
            <div className="p-2.5 md:p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20 group-hover:border-blue-500/50 transition-colors shadow-lg shadow-blue-500/5">
              <Users className="text-blue-500" size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">24/7</h3>
              <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold italic leading-tight">
                Soporte Global
              </p>
            </div>
            <div className="w-10 md:w-12 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div initial={{ left: "-100%" }} whileInView={{ left: "0%" }} transition={{ duration: 1, delay: 0.6 }} className="absolute inset-0 bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
