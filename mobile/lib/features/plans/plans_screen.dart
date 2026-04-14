import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/data/mock_data.dart';
import '../../core/models/models.dart';
import '../../core/services/whatsapp_service.dart';

class PlansScreen extends StatefulWidget {
  const PlansScreen({super.key});

  @override
  State<PlansScreen> createState() => _PlansScreenState();
}

class _PlansScreenState extends State<PlansScreen> {
  int _selectedPlan = 1; // Growth & Ads por defecto

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
            title: const Text('Planes'),
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
                  eyebrow: 'Inversión Estratégica',
                  title: 'Elige tu\nNivel de Impacto',
                  subtitle: 'Planes diseñados para escalar tu negocio sin costos sorpresa.',
                ),
                const SizedBox(height: AppSpacing.lg),

                // Toggle selector de plans
                _PlanToggle(
                  selectedIndex: _selectedPlan,
                  onChanged: (i) => setState(() => _selectedPlan = i),
                ),
                const SizedBox(height: AppSpacing.lg),

                // Plan cards
                ...MockData.plans.asMap().entries.map((e) =>
                  _PlanCard(
                    plan: e.value,
                    index: e.key,
                    isSelected: _selectedPlan == e.key,
                    onSelect: () => setState(() => _selectedPlan = e.key),
                  ),
                ),

                // Nota
                const SizedBox(height: AppSpacing.md),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.goldGlow,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.gold.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Text('💡', style: TextStyle(fontSize: 18)),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          'Todos los planes incluyen código fuente, hosting premium y soporte 24/7. Sin contratos de permanencia obligatoria.',
                          style: TextStyle(
                            color: AppColors.goldLight,
                            fontSize: 12,
                            height: 1.55,
                          ),
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(delay: 700.ms),

                const SizedBox(height: AppSpacing.xl),

                // CTA final
                AmcButton(
                  label: 'Hablar con un Asesor',
                  onPressed: () => WhatsAppService.openWhatsApp(
                    message: 'Hola! 👋 Me interesa conocer más sobre los planes de AMC Agency. ¿Pueden asesorarme?',
                  ),
                  width: double.infinity,
                  icon: Icons.chat_bubble_outline_rounded,
                ).animate().fadeIn(delay: 800.ms),

                const SizedBox(height: 12),

                AmcButton(
                  label: 'Solicitar Cotización Personalizada',
                  isOutlined: true,
                  onPressed: () => context.push('/contact'),
                  width: double.infinity,
                ).animate().fadeIn(delay: 900.ms),

                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

// ── TOGGLE de planes ──────────────────────────────────────────────────────
class _PlanToggle extends StatelessWidget {
  final int selectedIndex;
  final ValueChanged<int> onChanged;

  const _PlanToggle({required this.selectedIndex, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    final labels = ['Digital Core', 'Growth & Ads', 'Elite Partner'];
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderColor),
      ),
      padding: const EdgeInsets.all(4),
      child: Row(
        children: labels.asMap().entries.map((e) {
          final isActive = e.key == selectedIndex;
          return Expanded(
            child: GestureDetector(
              onTap: () => onChanged(e.key),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 9),
                decoration: BoxDecoration(
                  gradient: isActive ? AppColors.accentGradient : null,
                  borderRadius: BorderRadius.circular(9),
                ),
                child: Text(
                  e.value,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: isActive ? FontWeight.w700 : FontWeight.w400,
                    color: isActive ? Colors.white : AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ── CARD de plan ──────────────────────────────────────────────────────────
class _PlanCard extends StatelessWidget {
  final PlanModel plan;
  final int index;
  final bool isSelected;
  final VoidCallback onSelect;

  const _PlanCard({
    required this.plan,
    required this.index,
    required this.isSelected,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onSelect,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        margin: const EdgeInsets.only(bottom: 14),
        decoration: BoxDecoration(
          gradient: isSelected ? AppColors.premiumCardGradient : AppColors.cardGradient,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.accent : AppColors.borderColor,
            width: isSelected ? 1.5 : 1,
          ),
          boxShadow: isSelected
              ? [BoxShadow(color: AppColors.accent.withOpacity(0.2), blurRadius: 25, offset: const Offset(0, 6))]
              : null,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Cabecera
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(plan.name,
                                style: Theme.of(context).textTheme.headlineSmall),
                            if (plan.isPopular) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  gradient: AppColors.goldGradient,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text('Popular',
                                    style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800,
                                        color: Colors.black, letterSpacing: 0.5)),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(plan.tagline, style: Theme.of(context).textTheme.bodySmall),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      ShaderMask(
                        shaderCallback: (b) => AppColors.accentGradient.createShader(b),
                        child: Text(plan.price,
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                      ),
                      Text(plan.priceNote,
                          style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                    ],
                  ),
                ],
              ),
            ),

            Divider(color: AppColors.borderColor, height: 1),

            // Features
            Padding(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                children: [
                  ...plan.features.map((f) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 18, height: 18,
                          decoration: BoxDecoration(
                            color: AppColors.accentGlow,
                            borderRadius: BorderRadius.circular(5),
                          ),
                          child: const Icon(Icons.check_rounded, color: AppColors.accent, size: 12),
                        ),
                        const SizedBox(width: 10),
                        Expanded(child: Text(f,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.textSecondary, height: 1.4))),
                      ],
                    ),
                  )),
                  const SizedBox(height: 8),
                  AmcButton(
                    label: plan.id == 'elite-partner' ? 'Consultar Precio' : 'Empezar con ${plan.name}',
                    onPressed: () => WhatsAppService.openForPlan(plan.name),
                    width: double.infinity,
                    isSmall: true,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(delay: Duration(milliseconds: 200 + index * 150), duration: 600.ms)
        .slideY(begin: 0.1, delay: Duration(milliseconds: 200 + index * 150));
  }
}
