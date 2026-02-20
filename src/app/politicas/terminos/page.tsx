"use client";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { FileText, CheckCircle2, AlertTriangle, Scale, Mail, ChevronRight, Gavel } from "lucide-react";

const sections = [
    {
        id: "aceptacion",
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
        title: "1. Aceptación de los Términos",
        content: [
            {
                subtitle: "Acuerdo de uso",
                text: "Al acceder y utilizar el sitio web de AMC Agency (amcagency.com), así como al contratar cualquiera de nuestros servicios de desarrollo web, infraestructura cloud o renting tecnológico, aceptas expresamente estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguno de los términos aquí establecidos, debes abstenerte de usar nuestros servicios.",
            },
            {
                subtitle: "Capacidad legal",
                text: "Para contratar nuestros servicios, debes tener al menos 18 años de edad o ser el representante legal autorizado de la empresa que realiza la contratación. Al aceptar estos términos, declaras y garantizas que tienes la capacidad legal y la autorización necesaria para celebrar este acuerdo.",
            },
        ],
    },
    {
        id: "servicios",
        icon: <FileText className="w-5 h-5 text-blue-400" />,
        title: "2. Descripción de Servicios",
        content: [
            {
                subtitle: "Renting Web de Élite",
                text: "Nuestro servicio de Renting Web consiste en el diseño, desarrollo, alojamiento y mantenimiento continuo de sitios y aplicaciones web bajo un modelo de suscripción mensual. El cliente no adquiere la propiedad del código fuente durante la vigencia del contrato de renting, pero puede ejercer la opción de compra ('Buy-Out') según las condiciones específicas de su plan.",
            },
            {
                subtitle: "Infraestructura Cloud y Software a Medida",
                text: "Los proyectos de infraestructura cloud y software a medida se cotizan de forma individualizada mediante propuesta técnica y económica. Los entregables, plazos, condiciones de pago y propiedad intelectual del código se detallan en el contrato específico de cada proyecto. El cliente es propietario del código resultante una vez completado el pago total.",
            },
            {
                subtitle: "Modificaciones a los servicios",
                text: "AMC Agency se reserva el derecho de modificar, actualizar o discontinuar cualquier servicio con un preaviso mínimo de 30 días. En caso de discontinuación de un plan de renting activo, ofreceremos alternativas equivalentes o la opción de Buy-Out a precio preferencial.",
            },
        ],
    },
    {
        id: "pagos",
        icon: <Scale className="w-5 h-5 text-amber-400" />,
        title: "3. Pagos y Facturación",
        content: [
            {
                subtitle: "Modalidad de pago — Planes de Renting",
                text: "Los planes de Renting se facturan de forma mensual anticipada. El pago debe realizarse dentro de los primeros 5 días hábiles del mes. El retraso en el pago de más de 10 días hábiles puede resultar en la suspensión temporal del servicio. Retrasos superiores a 30 días pueden dar lugar a la terminación del contrato.",
            },
            {
                subtitle: "Proyectos a medida",
                text: "Los proyectos de software o infraestructura a medida requieren un anticipo del 50% para iniciar el desarrollo. El 50% restante se factura al momento de la entrega. Para proyectos de largo aliento (más de 3 meses), se establecerá un calendario de pagos en hitos acordado en el contrato.",
            },
            {
                subtitle: "Política de reembolsos",
                text: "Los planes de renting no son reembolsables una vez iniciado el período de servicio. Para proyectos a medida, si AMC Agency decide cancelar el proyecto por causas atribuibles a la agencia, se reembolsará el anticipo íntegro. No se realizan reembolsos por cambios de criterio del cliente una vez iniciado el desarrollo.",
            },
        ],
    },
    {
        id: "propiedad",
        icon: <Gavel className="w-5 h-5 text-violet-400" />,
        title: "4. Propiedad Intelectual",
        content: [
            {
                subtitle: "Propiedad del código — Renting",
                text: "En el modelo de Renting, AMC Agency retiene la propiedad del código, diseños y arquitectura técnica durante la vigencia del contrato. El cliente tiene licencia de uso exclusiva sobre la plataforma. Al finalizar o dar de baja el servicio, el cliente puede adquirir la propiedad total mediante la cláusula de Buy-Out, cuyo precio se establece en el contrato.",
            },
            {
                subtitle: "Propiedad del código — Proyectos a medida",
                text: "En proyectos de software a medida, una vez completado el pago total, el cliente adquiere la propiedad completa del código fuente entregado. AMC Agency puede usar el proyecto en su portafolio con fines de marketing, a menos que el cliente solicite explícitamente confidencialidad mediante cláusula NDA.",
            },
            {
                subtitle: "Contenido del cliente",
                text: "El cliente es responsable de que todo el contenido (textos, imágenes, logos, datos) que proporciona a AMC Agency para incorporar en su proyecto no infringe derechos de terceros. AMC Agency no se hace responsable de reclamaciones por infracciones de propiedad intelectual derivadas del contenido proporcionado por el cliente.",
            },
        ],
    },
    {
        id: "responsabilidades",
        icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
        title: "5. Limitación de Responsabilidad",
        content: [
            {
                subtitle: "Disponibilidad del servicio",
                text: "AMC Agency se compromete a mantener una disponibilidad (uptime) del 99.9% para todos los servicios de renting activos, medido mensualmente. En caso de interrupciones superiores al 0.1% mensual por causas atribuibles a AMC Agency, se aplicarán créditos proporcionales en la siguiente factura. No se incluyen interrupciones por fuerza mayor, ataques DDoS o fallos de proveedores de infraestructura externos.",
            },
            {
                subtitle: "Pérdida de datos",
                text: "Aunque implementamos copias de seguridad (backups) automatizadas con frecuencia diaria, AMC Agency no se hace responsable de la pérdida de datos causada por factores externos, acciones del cliente o situaciones de fuerza mayor. Recomendamos a todos los clientes mantener copias de seguridad independientes de su información crítica.",
            },
            {
                subtitle: "Daños indirectos",
                text: "En ningún caso AMC Agency será responsable por daños indirectos, incidentales, especiales o consecuentes, incluyendo pérdida de beneficios, pérdida de datos o interrupción del negocio, incluso si AMC Agency ha sido advertida de la posibilidad de tales daños. La responsabilidad máxima de AMC Agency se limita al importe abonado por el cliente en los 3 meses anteriores al evento.",
            },
        ],
    },
    {
        id: "terminacion",
        icon: <Scale className="w-5 h-5 text-cyan-400" />,
        title: "6. Terminación y Cancelación",
        content: [
            {
                subtitle: "Cancelación por el cliente",
                text: "El cliente puede cancelar su plan de renting en cualquier momento con un preaviso mínimo de 30 días. Durante ese período, el servicio seguirá activo y facturándose normalmente. Para proyectos en curso, la cancelación requiere liquidar los hitos completados hasta la fecha de terminación.",
            },
            {
                subtitle: "Resolución del contrato",
                text: "AMC Agency se reserva el derecho de terminar el contrato de forma inmediata en caso de: uso del servicio para actividades ilegales, impago de más de 45 días, violación de cualquier término de este documento, o comportamiento que ponga en riesgo la reputación o seguridad de la agencia o de otros clientes.",
            },
        ],
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#050505]">
            <Navbar />

            {/* ——— HERO ——— */}
            <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-600/8 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <Reveal>
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                                <Scale className="w-3.5 h-3.5" />
                                Documento Legal
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-5 leading-[1.05]">
                                Términos y <span className="text-emerald-400">Condiciones</span>
                            </h1>
                            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                                Este documento establece las condiciones que rigen el uso de nuestros servicios y la relación comercial entre AMC Agency y sus clientes.
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

                    {/* ÍNDICE LATERAL */}
                    <div className="lg:col-span-1">
                        <Reveal>
                            <div className="lg:sticky lg:top-28 p-5 rounded-[20px] bg-white/[0.02] border border-white/5">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Contenido</p>
                                <nav className="space-y-1.5">
                                    {sections.map((s) => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className="flex items-center gap-2 text-gray-500 hover:text-emerald-400 transition-colors text-xs py-1 group"
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
                                    className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-emerald-500/10 transition-all scroll-mt-28"
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
                                                <h3 className="text-sm font-bold text-emerald-400 mb-2 tracking-wide">
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

                        {/* CONTACTO LEGAL */}
                        <Reveal width="100%">
                            <div className="p-6 md:p-8 rounded-[24px] md:rounded-[32px] bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-center">
                                <Gavel className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">¿Tienes dudas legales o contractuales?</h3>
                                <p className="text-gray-400 text-sm mb-5">
                                    Nuestro equipo legal responde consultas específicas sobre contratos en menos de 24 horas.
                                </p>
                                <a
                                    href="mailto:contact@amcagency.com"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full transition-all text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20"
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
