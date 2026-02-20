"use client";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Activity, Users, Rocket, BarChart3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        (ref.current as HTMLElement).textContent =
          Intl.NumberFormat("en-US").format(Math.round(latest * 10) / 10) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0</span>;
};

export const Stats = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t.stats.uptime, value: 99.9, suffix: "%", icon: <Activity className="text-blue-500" size={18} /> },
    { label: t.stats.projects, value: 150, suffix: "+", icon: <Rocket className="text-blue-500" size={18} /> },
    { label: t.stats.roi, value: 3.5, suffix: "x", icon: <BarChart3 className="text-blue-500" size={18} /> },
    { label: t.stats.support, value: 24, suffix: "/7", icon: <Users className="text-blue-500" size={18} /> },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black/50 border-y border-white/5">
      <motion.div
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent z-0"
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="group flex flex-col items-center space-y-3 md:space-y-4">
              <div className="p-2.5 md:p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20 group-hover:border-blue-500/50 transition-colors shadow-lg shadow-blue-500/5">
                {stat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-gray-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold italic leading-tight">
                  {stat.label}
                </p>
              </div>
              <div className="w-10 md:w-12 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
                <motion.div
                  initial={{ left: "-100%" }}
                  whileInView={{ left: "0%" }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  className="absolute inset-0 bg-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};