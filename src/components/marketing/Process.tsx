"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Process = () => {
  const { t } = useLanguage();

  const steps = [
    { num: "01", title: t.process.step1.t, desc: t.process.step1.d },
    { num: "02", title: t.process.step2.t, desc: t.process.step2.d },
    { num: "03", title: t.process.step3.t, desc: t.process.step3.d },
    { num: "04", title: t.process.step4.t, desc: t.process.step4.d },
  ];

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-3 md:mb-4">{t.process.subtitle}</p>
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white tracking-tighter">
            {t.process.title1} <span className="text-blue-500">{t.process.title2}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 md:p-10 rounded-[24px] md:rounded-[40px] bg-white/[0.02] border border-white/5 group hover:border-blue-500/30 transition-all"
            >
              <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white/5 mb-4 md:mb-6 block group-hover:text-blue-500/20 transition-colors">
                {step.num}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tight">{step.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed mb-4 md:mb-6 text-sm md:text-base">{step.desc}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">
                <div className="w-4 h-4 rounded-full border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={10} />
                </div>
                {t.process.verified}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};