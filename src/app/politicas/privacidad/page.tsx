"use client";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { Shield, Lock, Eye, FileText, Mail, ChevronRight } from "lucide-react";

const sections = [
    {
        id: "informacion",
        icon: <FileText className="w-5 h-5 text-blue-400" />,
        title: "1. Información que Recopilamos",
        content: [
            {
                subtitle: "Información que nos proporcionas directamente",
                text: "Cuando completas nuestros formularios de contacto o solicitas una cotización, recopilamos tu nombre completo, dirección de correo electrónico, número de teléfono (opcional) y cualquier información adicional que decidas compartir en el campo de mensaje. Esta información es usada exclusivamente para responder a tu solicitud y establecer una relación comercial.",
            },
            {
                subtitle: "Información recopilada automáticamente",
                text: "Utilizamos herramientas de análisis como Google Analytics para recopilar datos de navegación de forma anónima: páginas visitadas, tiempo de permanencia, dispositivo utilizado, país de origen y fuente de tráfico. Esta información nos ayuda a mejorar la experiencia del sitio. No recopilamos información personal identificable de forma automática.",
            },
        ],
    },
    {
        id: "uso",
        icon: <Eye className="w-5 h-5 text-emerald-400" />,
        title: "2. Cómo Usamos tu Información",
        content: [
            {
                subtitle: "Comunicación y propuesta comercial",
                text: "Utilizamos tu información de contacto para responderte dentro de las primeras 24 horas hábiles, preparar una propuesta personalizada según tus necesidades y hacer un seguimiento puntual de tu proyecto. No enviaremos comunicaciones no solicitadas (spam).",
            },
            {
                subtitle: "Mejora de nuestros servicios",
                text: "Los datos de navegación anónimos nos permiten entender qué servicios generan más interés, optimizar el contenido del sitio web y mejorar el rendimiento técnico de la plataforma. Nunca vendemos ni compartimos esta información con terceros con fines comerciales.",
            },
        ],
    },
    {
        id: "proteccion",
        icon: <Lock className="w-5 h-5 text-violet-400" />,
        title: "3. Protección de tus Datos",
        content: [
            {
                subtitle: "Medidas de seguridad técnicas",
                text: "Toda la información transmitida entre tu navegador y nuestros servidores está protegida mediante encriptación SSL/TLS (HTTPS). Los datos de formularios se procesan a través de Supabase, que cumple con estándares SOC 2 Type II y ofrece encriptación en reposo y en tránsito.",
            },
            {
                subtitle: "Acceso restringido",
                text: "El acceso a los datos de clientes está limitado únicamente a los miembros del equipo que necesitan esa información para completar tu proyecto. Todos los colaboradores firman acuerdos de confidencialidad (NDA) como parte de su relación con AMC Agency.",
            },
        ],
    },
    {
        id: "cookies",
        icon: <Shield className="w-5 h-5 text-amber-400" />,
        title: "4. Cookies y Tecnologías de Seguimiento",
        content: [
            {
                subtitle: "Cookies esenciales",
                text: "Usamos cookies técnicas estrictamente necesarias para el funcionamiento del sitio web: gestión de sesiones, preferencias de idioma y seguridad. Estas cookies no requieren tu consentimiento ya que son imprescindibles para el correcto funcionamiento de la plataforma.",
            },
            {
                subtitle: "Cookies analíticas",
                text: "Con tu consentimiento, utilizamos cookies de Google Analytics (GA4) para analizar el comportamiento de los usuarios de forma anónima. Puedes rechazar estas cookies sin que ello afecte la funcionalidad del sitio. Para desactivarlas, puedes usar la extensión 'Google Analytics Opt-out' o configurar tu navegador para bloquear cookies de terceros.",
            },
        ],
    },
    {
        id: "derechos",
        icon: <FileText className="w-5 h-5 text-cyan-400" />,
        title: "5. Tus Derechos",
        content: [
            {
                subtitle: "Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)",
                text: "Tienes derecho a acceder a los datos personales que tenemos sobre ti, solicitar su corrección si son inexactos, pedir su eliminación en cualquier momento y oponerte a ciertos usos de tu información. Para ejercer cualquiera de estos derechos, envíanos un correo a contact@amcagency.com con el asunto 'Derechos ARCO' y procesaremos tu solicitud en un máximo de 10 días hábiles.",
            },
            {
                subtitle: "Portabilidad de datos",
                text: "A solicitud expresa, podemos proporcionarte un archivo con todos los datos personales que hemos recopilado sobre ti en un formato estructurado y de uso común (JSON o CSV). Esta solicitud se procesará en un plazo máximo de 30 días hábiles.",
            },
        ],
    },
    {
        id: "contacto",
        icon: <Mail className="w-5 h-5 text-rose-400" />,
        title: "6. Contacto y Actualizaciones",
        content: [
            {
                subtitle: "Responsable del tratamiento de datos",
                text: "AMC Agency es responsable del tratamiento de tus datos personales. Si tienes preguntas, inquietudes o deseas ejercer tus derechos de privacidad, puedes contactarnos en: contact@amcagency.com. Responderemos a todas las consultas relacionadas con privacidad en un plazo máximo de 5 días hábiles.",
            },
            {
                subtitle: "Cambios en esta política",
                text: "Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas, tecnologías o requisitos legales. La fecha de 'Última actualización' en la parte superior de esta página siempre mostrará cuándo fue revisada por última vez. Te recomendamos revisarla regularmente.",
            },
        ],
    },
];

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#050505]">
            <Navbar />

            {/* ——— HERO ——— */}
            <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <Reveal>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                                <Shield className="w-3.5 h-3.5" />
                                Documento Legal
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-5 leading-[1.05]">
                                Política de <span className="text-blue-500">Privacidad</span>
                            </h1>
                            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                                En AMC Agency, tu privacidad es una prioridad estratégica. Este documento explica cómo recopilamos, usamos y protegemos tu información personal.
                            </p>
                            <p className="text-gray-600 text-xs mt-4">
                                Última actualización: 20 de Febrero de 2026
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ——— CONTENIDO PRINCIPAL ——— */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">

                    {/* ÍNDICE (sticky en desktop) */}
                    <div className="lg:col-span-1">
                        <Reveal>
                            <div className="lg:sticky lg:top-28 p-5 rounded-[20px] bg-white/[0.02] border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Contenido</p>
                                <nav className="space-y-1.5">
                                    {sections.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className="flex items-center gap-2 text-gray-500 hover:text-blue-400 transition-colors text-xs py-1 group"
                                        >
                                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                            <span className="leading-tight">{s.title.replace(/^\d+\.\s/, "")}</span>
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </Reveal>
                    </div>

                    {/* SECCIONES */}
                    <div className="lg:col-span-3 space-y-6 md:space-y-8">
                        {sections.map((section, i) => (
                            <Reveal key={i} width="100%">
                                <div
                                    id={section.id}
                                    className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-blue-500/10 transition-all scroll-mt-28"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                            {section.icon}
                                        </div>
                                        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="space-y-5">
                                        {section.content.map((item, j) => (
                                            <div key={j}>
                                                <h3 className="text-sm font-bold text-blue-400 mb-2 tracking-wide">
                                                    {item.subtitle}
                                                </h3>
                                                <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">
                                                    {item.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        ))}

                        {/* CONTACTO CTA */}
                        <Reveal width="100%">
                            <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 text-center">
                                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-4" />
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">¿Tienes preguntas sobre tu privacidad?</h3>
                                <p className="text-gray-400 text-sm mb-5">
                                    Nuestro equipo responde todas las consultas en menos de 24 horas hábiles.
                                </p>
                                <a
                                    href="mailto:contact@amcagency.com"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    contact@amcagency.com
                                </a>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
