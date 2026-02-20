"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const techs = [
  { name: "NEXT.JS 15", color: "from-white to-blue-400" },
  { name: "SUPABASE", color: "from-emerald-400 to-cyan-500" },
  { name: "TYPESCRIPT", color: "from-blue-500 to-indigo-600" },
  { name: "AWS CLOUD", color: "from-orange-400 to-red-500" },
  { name: "TAILWIND", color: "from-cyan-400 to-blue-500" },
  { name: "VERCEL", color: "from-gray-300 to-white" },
];

export const TechStack = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-800, 0]);

  return (
    <section ref={containerRef} className="py-20 md:py-40 relative overflow-hidden bg-black">
      {/* FONDO DE REJILLA 3D */}
      <div className="absolute inset-0 [perspective:1000px]">
        <div
          className="absolute inset-0 opacity-20 [transform:rotateX(60deg)] bg-[linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] bg-[size:50px_50px]"
          style={{ maskImage: "radial-gradient(ellipse at 50% 50%, black, transparent)" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 mb-12 md:mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter italic text-white"
        >
          POWERED BY <span className="text-blue-500">AMC STACK</span>
        </motion.h2>
      </div>

      <div className="relative flex flex-col gap-6 md:gap-10">
        {/* FILA 1 */}
        <motion.div style={{ x: x1 }} className="flex gap-4 md:gap-8 whitespace-nowrap w-max">
          {[...techs, ...techs, ...techs, ...techs].map((tech, i) => (
            <div key={i} className="group relative px-6 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl bg-[#080808] border border-white/5 overflow-hidden shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <span className="text-xl md:text-3xl lg:text-5xl font-black text-white/20 group-hover:text-white transition-all tracking-tighter italic">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* FILA 2 */}
        <motion.div style={{ x: x2 }} className="flex gap-4 md:gap-8 whitespace-nowrap w-max">
          {[...techs, ...techs, ...techs, ...techs].reverse().map((tech, i) => (
            <div key={i} className="group relative px-6 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl bg-[#080808] border border-white/5 overflow-hidden shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <span className="text-xl md:text-3xl lg:text-5xl font-black text-white/20 group-hover:text-white transition-all tracking-tighter italic">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};