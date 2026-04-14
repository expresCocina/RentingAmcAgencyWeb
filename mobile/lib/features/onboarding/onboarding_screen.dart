import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  static const _slides = [
    _OnboardingSlide(
      emoji: '🚀',
      title: 'La Nueva Era\nDigital',
      subtitle:
          'No somos una agencia más. Somos tu partner tecnológico para construir la infraestructura digital que tu marca merece.',
      highlight: 'Partner Tecnológico',
    ),
    _OnboardingSlide(
      emoji: '⚡',
      title: 'Soluciones\nde Élite',
      subtitle:
          'Desarrollo web de alto rendimiento, infraestructura cloud global y soluciones enterprise que escalan con tu negocio.',
      highlight: 'Alto Rendimiento',
    ),
    _OnboardingSlide(
      emoji: '🎯',
      title: 'Empieza\nHoy Mismo',
      subtitle:
          'Explora nuestros servicios, revisa casos de éxito reales y solicita tu cotización personalizada en minutos.',
      highlight: 'Solicita tu cotización',
    ),
  ];

  Future<void> _onGetStarted() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_done', true);
    if (mounted) context.go('/home');
  }

  void _nextPage() {
    if (_currentPage < _slides.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeOutCubic,
      );
    } else {
      _onGetStarted();
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Background grid
          Positioned.fill(
            child: CustomPaint(painter: _OnboardingBgPainter()),
          ),
          Column(
            children: [
              // Skip button
              SafeArea(
                child: Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: GestureDetector(
                      onTap: _onGetStarted,
                      child: Text(
                        'Saltar',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              // Page view
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (i) => setState(() => _currentPage = i),
                  itemCount: _slides.length,
                  itemBuilder: (context, index) =>
                      _OnboardingSlideWidget(slide: _slides[index]),
                ),
              ),

              // Bottom controls
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.screenPadding,
                  AppSpacing.lg,
                  AppSpacing.screenPadding,
                  AppSpacing.xl,
                ),
                child: Column(
                  children: [
                    // Page indicator
                    SmoothPageIndicator(
                      controller: _pageController,
                      count: _slides.length,
                      effect: ExpandingDotsEffect(
                        activeDotColor: AppColors.accent,
                        dotColor: AppColors.borderColor,
                        dotHeight: 6,
                        dotWidth: 6,
                        expansionFactor: 4,
                        spacing: 6,
                      ),
                    ),
                    const SizedBox(height: 32),
                    // CTA Button
                    AmcButton(
                      label: _currentPage == _slides.length - 1
                          ? 'Comenzar Ahora'
                          : 'Siguiente',
                      onPressed: _nextPage,
                      width: double.infinity,
                      icon: _currentPage == _slides.length - 1
                          ? Icons.arrow_forward_rounded
                          : null,
                    ),
                    if (_currentPage < _slides.length - 1) ...[
                      const SizedBox(height: 16),
                      GestureDetector(
                        onTap: _onGetStarted,
                        child: Text(
                          'Explorar sin guía',
                          style: TextStyle(
                            color: AppColors.textMuted,
                            fontSize: 13,
                            decoration: TextDecoration.underline,
                            decorationColor: AppColors.textMuted,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _OnboardingSlideWidget extends StatelessWidget {
  final _OnboardingSlide slide;

  const _OnboardingSlideWidget({required this.slide});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.screenPadding),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Emoji icon with glow
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: AppColors.borderColor),
              boxShadow: [
                BoxShadow(
                  color: AppColors.accent.withOpacity(0.1),
                  blurRadius: 40,
                  spreadRadius: 10,
                ),
              ],
            ),
            child: Center(
              child: Text(slide.emoji, style: const TextStyle(fontSize: 52)),
            ),
          )
              .animate()
              .fadeIn(duration: 600.ms)
              .scale(begin: const Offset(0.8, 0.8), duration: 600.ms, curve: Curves.easeOutBack),
          const SizedBox(height: 40),
          // Title
          Text(
            slide.title,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.displaySmall,
          )
              .animate()
              .fadeIn(delay: 150.ms, duration: 600.ms)
              .slideY(begin: 0.2, delay: 150.ms),
          const SizedBox(height: 16),
          // Gold accent
          Container(
            width: 50,
            height: 3,
            decoration: const BoxDecoration(gradient: AppColors.goldGradient),
          )
              .animate()
              .fadeIn(delay: 250.ms)
              .scaleX(begin: 0, delay: 250.ms, duration: 500.ms),
          const SizedBox(height: 20),
          // Subtitle
          Text(
            slide.subtitle,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.7),
          )
              .animate()
              .fadeIn(delay: 300.ms, duration: 600.ms),
        ],
      ),
    );
  }
}

class _OnboardingSlide {
  final String emoji;
  final String title;
  final String subtitle;
  final String highlight;

  const _OnboardingSlide({
    required this.emoji,
    required this.title,
    required this.subtitle,
    required this.highlight,
  });
}

class _OnboardingBgPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.borderColor.withOpacity(0.25)
      ..strokeWidth = 0.5;
    const spacing = 50.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_OnboardingBgPainter old) => false;
}
