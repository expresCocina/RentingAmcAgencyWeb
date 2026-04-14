import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/models/models.dart';
import '../../core/data/mock_data.dart';
import '../../core/services/whatsapp_service.dart';

class ServiceDetailScreen extends StatelessWidget {
  final ServiceModel? service;

  const ServiceDetailScreen({super.key, this.service});

  @override
  Widget build(BuildContext context) {
    // Fallback si se navega sin datos
    final s = service ?? MockData.services.first;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Hero AppBar
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: AppColors.background,
            leading: IconButton(
              icon: Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  color: AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.borderColor),
                ),
                child: const Icon(Icons.arrow_back_ios_new_rounded, size: 16),
              ),
              onPressed: () => Navigator.of(context).pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(gradient: AppColors.premiumCardGradient),
                child: Stack(
                  children: [
                    // Pattern de fondo
                    Positioned.fill(child: CustomPaint(painter: _DetailBgPainter())),
                    // Glow
                    Positioned(
                      top: -30, right: -30,
                      child: Container(
                        width: 200, height: 200,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [AppColors.accent.withOpacity(0.15), Colors.transparent],
                          ),
                        ),
                      ),
                    ),
                    // Contenido hero
                    Align(
                      alignment: Alignment.bottomLeft,
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(s.icon, style: const TextStyle(fontSize: 48)),
                            const SizedBox(height: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.accentGlow,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(s.tag, style: const TextStyle(color: AppColors.accent, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1)),
                            ),
                            const SizedBox(height: 8),
                            Text(s.title, style: Theme.of(context).textTheme.headlineLarge),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Contenido
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.screenPadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Descripción
                Text(
                  s.description,
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.7),
                ).animate().fadeIn(delay: 200.ms),

                const SizedBox(height: AppSpacing.lg),

                // Sección de características completas
                const SectionHeader(eyebrow: 'Incluye', title: 'Todo lo que\nobtienes'),
                const SizedBox(height: AppSpacing.md),

                ...s.features.asMap().entries.map((e) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceLight,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.borderColor),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 32, height: 32,
                        decoration: BoxDecoration(
                          color: AppColors.accentGlow,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.check_rounded, color: AppColors.accent, size: 16),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(e.value, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textPrimary)),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: Duration(milliseconds: 300 + e.key * 80)).slideX(begin: 0.1)),

                const SizedBox(height: AppSpacing.xl),

                // CTAs
                AmcButton(
                  label: 'Solicitar este Servicio',
                  onPressed: () => WhatsAppService.openForService(s.title),
                  width: double.infinity,
                  icon: Icons.chat_bubble_outline_rounded,
                ),
                const SizedBox(height: 12),
                AmcButton(
                  label: 'Ver Todos los Planes',
                  isOutlined: true,
                  onPressed: () => Navigator.of(context).pop(),
                  width: double.infinity,
                ),
                const SizedBox(height: 60),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _DetailBgPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = AppColors.borderColor.withOpacity(0.3)..strokeWidth = 0.5;
    const sp = 40.0;
    for (double x = 0; x < size.width; x += sp) canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    for (double y = 0; y < size.height; y += sp) canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
  }
  @override
  bool shouldRepaint(_) => false;
}
