import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/services/whatsapp_service.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  static const _diferentials = [
    _Diff(icon: '⚡', title: 'Velocidad de Entrega', desc: 'Sprints semanales. Ves resultados desde la primera semana.'),
    _Diff(icon: '🔒', title: 'Seguridad Enterprise', desc: 'Infraestructura blindada con los más altos estándares del mercado.'),
    _Diff(icon: '📈', title: 'Enfoque en ROI', desc: 'Cada línea de código está orientada a generar retornos reales.'),
    _Diff(icon: '🤝', title: 'Partner, no Proveedor', desc: 'Nos involucramos como si fuera nuestro propio negocio.'),
    _Diff(icon: '🔄', title: 'Evolución Continua', desc: 'Tu plataforma crece con tu negocio. Nunca queda obsoleta.'),
    _Diff(icon: '🌎', title: 'Alcance Global', desc: 'Infraestructura distribuida globalmente para el mejor rendimiento.'),
  ];

  static const _process = [
    _Step(number: '01', title: 'Descubrimiento', desc: 'Entendemos tu negocio, objetivos y visión de marca.'),
    _Step(number: '02', title: 'Arquitectura', desc: 'Diseñamos la solución técnica y visual óptima.'),
    _Step(number: '03', title: 'Desarrollo', desc: 'Construimos con sprints semanales y entregas iterativas.'),
    _Step(number: '04', title: 'Despliegue', desc: 'Lanzamiento con monitoreo, soporte y evolución continua.'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppColors.background,
            elevation: 0,
            title: const Text('Sobre AMC'),
            actions: [
              TextButton.icon(
                onPressed: () => context.push('/faq'),
                icon: const Icon(Icons.help_outline_rounded, size: 16),
                label: const Text('FAQ'),
                style: TextButton.styleFrom(foregroundColor: AppColors.accent),
              ),
            ],
          ),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.screenPadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([

                // Hero blurb
                Container(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  decoration: BoxDecoration(
                    gradient: AppColors.premiumCardGradient,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 44, height: 44,
                            decoration: BoxDecoration(
                              gradient: AppColors.accentGradient,
                              borderRadius: BorderRadius.circular(11),
                            ),
                            child: const Center(child: Text('AMC', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w900))),
                          ),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('AMC Agency', style: Theme.of(context).textTheme.titleLarge),
                              Text('Partner Tecnológico de Élite', style: TextStyle(color: AppColors.gold, fontSize: 11, fontWeight: FontWeight.w600)),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'No somos una agencia más. Somos el departamento digital que tu empresa necesita: comprometidos, técnicamente superiores y orientados a resultados.',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.7),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1, delay: 200.ms),

                const SizedBox(height: AppSpacing.sectionSpacing),

                // Filosofía
                const SectionHeader(eyebrow: 'Filosofía', title: 'Por qué\nexistimos'),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'El mundo digital cambia a una velocidad brutal. Las empresas que no se adaptan quedan obsoletas. Nuestra misión es que eso nunca te pase a ti.\n\nCombinamos arquitectura técnica de primer nivel con estrategia de negocio real. No ejecutamos tareas: construimos ventajas competitivas duraderas.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.75),
                ).animate().fadeIn(delay: 300.ms),

                const SizedBox(height: AppSpacing.sectionSpacing),

                // Diferenciales
                const SectionHeader(eyebrow: 'Diferenciales', title: 'Lo que nos\nhace únicos'),
                const SizedBox(height: AppSpacing.md),
                GridView.count(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisCount: 2,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 1.15,
                  children: _diferentials.asMap().entries.map((e) =>
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceLight,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.borderColor),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(e.value.icon, style: const TextStyle(fontSize: 24)),
                          const SizedBox(height: 8),
                          Text(e.value.title, style: Theme.of(context).textTheme.titleSmall?.copyWith(color: AppColors.textPrimary)),
                          const SizedBox(height: 4),
                          Expanded(
                            child: Text(e.value.desc, style: Theme.of(context).textTheme.bodySmall, overflow: TextOverflow.fade),
                          ),
                        ],
                      ),
                    ).animate().fadeIn(delay: Duration(milliseconds: 400 + e.key * 80))
                  ).toList(),
                ),

                const SizedBox(height: AppSpacing.sectionSpacing),

                // Proceso
                const SectionHeader(eyebrow: 'Metodología', title: 'Nuestro\nProceso'),
                const SizedBox(height: AppSpacing.md),
                ..._process.asMap().entries.map((e) {
                  final st = e.value;
                  final isLast = e.key == _process.length - 1;
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 44, height: 44,
                            decoration: BoxDecoration(
                              gradient: AppColors.accentGradient,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [BoxShadow(color: AppColors.accent.withOpacity(0.25), blurRadius: 12)],
                            ),
                            child: Center(child: Text(st.number, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w800))),
                          ),
                          if (!isLast) Container(width: 2, height: 40, color: AppColors.borderColor),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 10, bottom: 28),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(st.title, style: Theme.of(context).textTheme.titleMedium),
                              const SizedBox(height: 4),
                              Text(st.desc, style: Theme.of(context).textTheme.bodySmall),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: Duration(milliseconds: 600 + e.key * 100)).slideX(begin: 0.1);
                }),

                const SizedBox(height: AppSpacing.lg),

                // CTAs
                AmcButton(
                  label: 'Hablar con el Equipo',
                  onPressed: () => WhatsAppService.openWhatsApp(),
                  width: double.infinity,
                  icon: Icons.chat_bubble_outline_rounded,
                ),
                const SizedBox(height: 12),
                AmcButton(
                  label: 'Explorar Servicios',
                  isOutlined: true,
                  onPressed: () => GoRouter.of(context).go('/services'),
                  width: double.infinity,
                ),
                const SizedBox(height: 12),
                AmcButton(
                  label: 'Preguntas Frecuentes',
                  isOutlined: true,
                  onPressed: () => context.push('/faq'),
                  width: double.infinity,
                  icon: Icons.help_outline_rounded,
                ),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _Diff {
  final String icon;
  final String title;
  final String desc;
  const _Diff({required this.icon, required this.title, required this.desc});
}

class _Step {
  final String number;
  final String title;
  final String desc;
  const _Step({required this.number, required this.title, required this.desc});
}
