import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/data/mock_data.dart';

class FaqScreen extends StatefulWidget {
  const FaqScreen({super.key});

  @override
  State<FaqScreen> createState() => _FaqScreenState();
}

class _FaqScreenState extends State<FaqScreen> {
  int? _expandedIndex;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Preguntas Frecuentes'),
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
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.screenPadding),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SectionHeader(
              eyebrow: 'Dudas Comunes',
              title: 'Transparencia\nTotal',
              subtitle: 'Respuestas claras para decisiones estratégicas.',
            ),
            const SizedBox(height: AppSpacing.lg),

            ...MockData.faqs.asMap().entries.map((e) {
              final faq = e.value;
              final isOpen = _expandedIndex == e.key;
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: isOpen ? AppColors.surfaceHighlight : AppColors.surfaceLight,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isOpen ? AppColors.accent.withOpacity(0.4) : AppColors.borderColor,
                    width: isOpen ? 1.5 : 1,
                  ),
                ),
                child: Theme(
                  data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                  child: ExpansionTile(
                    tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    initiallyExpanded: isOpen,
                    onExpansionChanged: (open) =>
                        setState(() => _expandedIndex = open ? e.key : null),
                    trailing: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 28, height: 28,
                      decoration: BoxDecoration(
                        color: isOpen ? AppColors.accentGlow : AppColors.surfaceLight,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: isOpen ? AppColors.accent.withOpacity(0.4) : AppColors.borderColor,
                        ),
                      ),
                      child: Icon(
                        isOpen ? Icons.remove_rounded : Icons.add_rounded,
                        size: 16,
                        color: isOpen ? AppColors.accent : AppColors.textSecondary,
                      ),
                    ),
                    title: Text(
                      faq.question,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: isOpen ? AppColors.textPrimary : AppColors.textSecondary,
                        fontWeight: isOpen ? FontWeight.w600 : FontWeight.w400,
                      ),
                    ),
                    children: [
                      Text(
                        faq.answer,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.7),
                      ),
                    ],
                  ),
                ),
              ).animate().fadeIn(delay: Duration(milliseconds: 100 + e.key * 60))
               .slideY(begin: 0.1, delay: Duration(milliseconds: 100 + e.key * 60));
            }),

            const SizedBox(height: AppSpacing.xl),

            // CTA
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                gradient: AppColors.cardGradient,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderColor),
              ),
              child: Column(
                children: [
                  const Text('¿No encontraste tu respuesta?', textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                  const SizedBox(height: 8),
                  const Text('Escríbenos directamente por WhatsApp y te respondemos de inmediato.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.5)),
                  const SizedBox(height: 16),
                  AmcButton(label: 'Preguntar por WhatsApp', onPressed: () {}, width: double.infinity, icon: Icons.chat_bubble_outline_rounded),
                ],
              ),
            ).animate().fadeIn(delay: 600.ms),
            const SizedBox(height: 60),
          ],
        ),
      ),
    );
  }
}
