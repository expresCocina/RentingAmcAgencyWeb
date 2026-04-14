import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/services/whatsapp_service.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Mi Cuenta'),
        leading: IconButton(
          icon: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.borderColor),
            ),
            child: const Icon(Icons.arrow_back_ios_new_rounded, size: 16),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        child: Column(
          children: [
            // Avatar / banner "Próximamente"
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.xl),
              decoration: BoxDecoration(
                gradient: AppColors.premiumCardGradient,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.borderColor),
              ),
              child: Column(
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [
                          AppColors.accent.withOpacity(0.3),
                          AppColors.gold.withOpacity(0.2),
                        ],
                      ),
                      border: Border.all(color: AppColors.accent.withOpacity(0.4), width: 2),
                    ),
                    child: const Center(
                      child: Text('🔐', style: TextStyle(fontSize: 34)),
                    ),
                  )
                      .animate()
                      .scale(begin: const Offset(0.7, 0.7), duration: 600.ms, curve: Curves.easeOutBack),
                  const SizedBox(height: 16),
                  Text(
                    'Panel de Cliente',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                    decoration: BoxDecoration(
                      gradient: AppColors.goldGradient,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'PRÓXIMAMENTE',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: Colors.black,
                        letterSpacing: 2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Estamos construyendo tu espacio personal para gestionar proyectos, facturas y comunicación directa con tu equipo AMC.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.65),
                  ),
                ],
              ),
            ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1, delay: 200.ms),

            const SizedBox(height: AppSpacing.lg),

            // Features futuras
            _FutureFeatureCard(
              index: 0,
              icon: '📊',
              title: 'Dashboard de Proyectos',
              desc: 'Consulta el estado de tu proyecto en tiempo real.',
            ),
            _FutureFeatureCard(
              index: 1,
              icon: '📄',
              title: 'Facturas y Pagos',
              desc: 'Historial de facturación y estado de pagos.',
            ),
            _FutureFeatureCard(
              index: 2,
              icon: '💬',
              title: 'Mensajes Directos',
              desc: 'Comunicación en tiempo real con tu account manager.',
            ),
            _FutureFeatureCard(
              index: 3,
              icon: '🔔',
              title: 'Notificaciones Push',
              desc: 'Alertas de actualizaciones, entregas y reportes.',
            ),
            _FutureFeatureCard(
              index: 4,
              icon: '📈',
              title: 'Reportes de Analítica',
              desc: 'KPIs y métricas de tu plataforma digital.',
            ),

            const SizedBox(height: AppSpacing.xl),

            // CTA mientras tanto
            GlassCard(
              isHighlighted: true,
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                children: [
                  const Text('¿Tienes un proyecto activo?',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  const SizedBox(height: 8),
                  const Text(
                    'Mientras habilitamos el panel, coordina todo directamente con nuestro equipo por WhatsApp.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.55),
                  ),
                  const SizedBox(height: 16),
                  AmcButton(
                    label: 'Contactar a mi Equipo AMC',
                    onPressed: () => WhatsAppService.openWhatsApp(
                      message: 'Hola! 👋 Soy cliente de AMC Agency y me gustaría consultar sobre mi proyecto.',
                    ),
                    width: double.infinity,
                    icon: Icons.chat_bubble_outline_rounded,
                  ),
                ],
              ),
            ).animate().fadeIn(delay: 800.ms),

            const SizedBox(height: 60),
          ],
        ),
      ),
    );
  }
}

class _FutureFeatureCard extends StatelessWidget {
  final int index;
  final String icon;
  final String title;
  final String desc;

  const _FutureFeatureCard({
    required this.index,
    required this.icon,
    required this.title,
    required this.desc,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.accentGlow,
              borderRadius: BorderRadius.circular(11),
            ),
            child: Center(child: Text(icon, style: const TextStyle(fontSize: 20))),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 2),
                Text(desc, style: Theme.of(context).textTheme.bodySmall),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.goldGlow,
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Text(
              'Pronto',
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.gold, letterSpacing: 0.5),
            ),
          ),
        ],
      ),
    )
        .animate()
        .fadeIn(delay: Duration(milliseconds: 300 + index * 80))
        .slideX(begin: 0.08, delay: Duration(milliseconds: 300 + index * 80));
  }
}
