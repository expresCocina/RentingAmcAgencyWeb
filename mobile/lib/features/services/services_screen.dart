import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/data/mock_data.dart';
import '../../core/models/models.dart';

class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

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
            title: const Text('Servicios'),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(1),
              child: Divider(height: 1, color: AppColors.borderColor),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.screenPadding),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SectionHeader(
                  eyebrow: 'Soluciones AMC',
                  title: 'Nuestras\nEspecialidades',
                  subtitle:
                      'Cada servicio diseñado para llevar tu empresa al siguiente nivel digital.',
                ),
                const SizedBox(height: AppSpacing.lg),
                ...MockData.services.asMap().entries.map((e) =>
                    _ServiceCard(service: e.value, index: e.key)),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _ServiceCard extends StatelessWidget {
  final ServiceModel service;
  final int index;

  const _ServiceCard({required this.service, required this.index});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/services/${service.id}', extra: service),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          gradient: AppColors.cardGradient,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                gradient: AppColors.premiumCardGradient,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 52, height: 52,
                    decoration: BoxDecoration(
                      color: AppColors.accentGlow,
                      borderRadius: BorderRadius.circular(13),
                      border: Border.all(color: AppColors.accent.withOpacity(0.3)),
                    ),
                    child: Center(child: Text(service.icon, style: const TextStyle(fontSize: 26))),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: AppColors.accentGlow, borderRadius: BorderRadius.circular(6)),
                          child: Text(service.tag, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.accent, letterSpacing: 1)),
                        ),
                        const SizedBox(height: 4),
                        Text(service.title, style: Theme.of(context).textTheme.headlineSmall),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.textMuted),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(service.description, style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.65)),
                  const SizedBox(height: 16),
                  ...service.features.take(3).map((f) => Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      children: [
                        Container(width: 5, height: 5, decoration: const BoxDecoration(color: AppColors.accent, shape: BoxShape.circle)),
                        const SizedBox(width: 10),
                        Expanded(child: Text(f, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.textSecondary))),
                      ],
                    ),
                  )),
                  const SizedBox(height: 4),
                  Text('+${service.features.length - 3} características más →', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.accent)),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 200 + index * 150), duration: 600.ms)
     .slideY(begin: 0.15, delay: Duration(milliseconds: 200 + index * 150));
  }
}
