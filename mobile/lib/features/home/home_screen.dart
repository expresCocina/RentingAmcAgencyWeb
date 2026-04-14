import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/data/mock_data.dart';
import '../../core/services/whatsapp_service.dart';
import '../../core/services/auth_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  late AnimationController _particleController;
  late AnimationController _glowController;

  @override
  void initState() {
    super.initState();
    _particleController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();
    _glowController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _particleController.dispose();
    _glowController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // ── Animación de partículas/estrellas (igual al web) ──────────────
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _particleController,
              builder: (_, __) => CustomPaint(
                painter: _StarFieldPainter(_particleController.value),
              ),
            ),
          ),

          // ── Orbe de luz azul superior (igual al web) ──────────────────────
          Positioned(
            top: -100,
            left: 0,
            right: 0,
            child: AnimatedBuilder(
              animation: _glowController,
              builder: (_, __) => Container(
                height: 400,
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    center: Alignment.topCenter,
                    radius: 1.0,
                    colors: [
                      AppColors.accent.withOpacity(0.08 + _glowController.value * 0.04),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
          ),

          // ── Contenido scrollable ──────────────────────────────────────────
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // ── NAV BAR premium ─────────────────────────────────────────
              SliverAppBar(
                pinned: false,
                floating: true,
                backgroundColor: Colors.transparent,
                elevation: 0,
                title: _PremiumLogo(glowController: _glowController),
                actions: [
                  GestureDetector(
                    onTap: () {
                      if (!AuthService.isLoggedIn) {
                        context.push('/login');
                      } else if (AuthService.isAdmin) {
                        context.push('/admin-dashboard');
                      } else {
                        context.push('/client-portal');
                      }
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 16),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: AuthService.isLoggedIn
                            ? AppColors.accent.withOpacity(0.15)
                            : AppColors.surface.withOpacity(0.8),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: AuthService.isLoggedIn
                              ? AppColors.accent.withOpacity(0.4)
                              : AppColors.borderColor,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (AuthService.isLoggedIn)
                            Container(
                              width: 6, height: 6,
                              margin: const EdgeInsets.only(right: 6),
                              decoration: const BoxDecoration(
                                color: Colors.green, shape: BoxShape.circle,
                              ),
                            ),
                          Icon(
                            AuthService.isAdmin
                                ? Icons.admin_panel_settings_rounded
                                : (AuthService.isLoggedIn
                                    ? Icons.account_circle_rounded
                                    : Icons.person_outline_rounded),
                            size: 14,
                            color: AuthService.isLoggedIn ? AppColors.accent : AppColors.textSecondary,
                          ),
                          const SizedBox(width: 5),
                          Text(
                            AuthService.isAdmin ? 'Admin' : (AuthService.isClient ? 'Portal' : 'Entrar'),
                            style: TextStyle(
                              color: AuthService.isLoggedIn ? AppColors.accent : AppColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              // ── HERO SECTION ─────────────────────────────────────────────
              SliverToBoxAdapter(child: _HeroPremium()),

              // ── STATS BAR ────────────────────────────────────────────────
              SliverToBoxAdapter(child: _StatsPremium()),

              // ── SERVICIOS ────────────────────────────────────────────────
              SliverToBoxAdapter(child: _ServicesPremium()),

              // ── PORTAFOLIO PREVIEW ───────────────────────────────────────
              SliverToBoxAdapter(child: _PortfolioPremium()),

              // ── CTA FINAL ────────────────────────────────────────────────
              SliverToBoxAdapter(child: _CtaPremium()),

              const SliverToBoxAdapter(child: SizedBox(height: 120)),
            ],
          ),
        ],
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGO PREMIUM con glow pulsante
// ══════════════════════════════════════════════════════════════════════════════
class _PremiumLogo extends StatelessWidget {
  final AnimationController glowController;
  const _PremiumLogo({required this.glowController});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        AnimatedBuilder(
          animation: glowController,
          builder: (_, __) => Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: AppColors.accentGradient,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: AppColors.accent.withOpacity(0.3 + glowController.value * 0.25),
                  blurRadius: 12 + glowController.value * 8,
                  spreadRadius: glowController.value * 2,
                ),
              ],
            ),
            child: const Center(
              child: Text(
                'A²',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.5,
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 10),
        RichText(
          text: const TextSpan(
            children: [
              TextSpan(
                text: 'AMC ',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.3,
                ),
              ),
              TextSpan(
                text: 'Agency',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 17,
                  fontWeight: FontWeight.w400,
                  letterSpacing: -0.3,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// HERO SECTION — igual al web
// ══════════════════════════════════════════════════════════════════════════════
class _HeroPremium extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Badge animado
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.accent.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.accent.withOpacity(0.25)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 6, height: 6,
                  decoration: const BoxDecoration(
                    color: AppColors.accent, shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'Partner Tecnológico de Élite',
                  style: TextStyle(
                    color: AppColors.accent,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.8,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 100.ms).slideX(begin: -0.1),

          const SizedBox(height: 22),

          // Headline principal — idéntico al web
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'El Futuro de tu',
                style: const TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 38,
                  fontWeight: FontWeight.w900,
                  height: 1.05,
                  letterSpacing: -1.5,
                ),
              ).animate().fadeIn(delay: 250.ms).slideY(begin: 0.15),
              ShaderMask(
                shaderCallback: (bounds) => const LinearGradient(
                  colors: [AppColors.accent, Color(0xFF7DD3FC)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ).createShader(bounds),
                child: const Text(
                  'Negocio es Hoy',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 38,
                    fontWeight: FontWeight.w900,
                    height: 1.05,
                    letterSpacing: -1.5,
                  ),
                ),
              ).animate().fadeIn(delay: 350.ms).slideY(begin: 0.15),
            ],
          ),

          const SizedBox(height: 18),

          Text(
            'Transformamos empresas con Marketing, Software y Web de élite. Tecnología, creatividad y resultados.',
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 15,
              height: 1.65,
              letterSpacing: 0.1,
            ),
          ).animate().fadeIn(delay: 450.ms),

          const SizedBox(height: 28),

          // Botones CTA
          Column(
            children: [
              // Primario — gradiente azul
              GestureDetector(
                onTap: () => context.push('/contact'),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    gradient: AppColors.accentGradient,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.accent.withOpacity(0.35),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Solicitar Cotización',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.3,
                        ),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 12),

              // Secundarios
              Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => WhatsAppService.openWhatsApp(),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.borderColor),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.chat_rounded, size: 15, color: AppColors.textSecondary),
                            SizedBox(width: 6),
                            Text('WhatsApp', style: TextStyle(
                              color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600,
                            )),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => context.go('/services'),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.borderColor),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.grid_view_rounded, size: 15, color: AppColors.textSecondary),
                            SizedBox(width: 6),
                            Text('Servicios', style: TextStyle(
                              color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600,
                            )),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ).animate().fadeIn(delay: 550.ms).slideY(begin: 0.1),
        ],
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// STATS BAR — glassmorphism
// ══════════════════════════════════════════════════════════════════════════════
class _StatsPremium extends StatelessWidget {
  static const _stats = [
    ('50+', 'Proyectos'),
    ('98%', 'Satisfacción'),
    ('24/7', 'Soporte'),
    ('5+', 'Años'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 4),
      decoration: BoxDecoration(
        color: AppColors.surface.withOpacity(0.7),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderColor.withOpacity(0.8)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 20),
        ],
      ),
      child: Row(
        children: _stats.asMap().entries.map((e) {
          final isLast = e.key == _stats.length - 1;
          return Expanded(
            child: Container(
              decoration: BoxDecoration(
                border: !isLast
                    ? Border(right: BorderSide(color: AppColors.borderColor))
                    : null,
              ),
              child: Column(
                children: [
                  ShaderMask(
                    shaderCallback: (b) => AppColors.accentGradient.createShader(b),
                    child: Text(
                      e.value.$1,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    e.value.$2,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    ).animate().fadeIn(delay: 650.ms).slideY(begin: 0.1);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// SERVICIOS PREMIUM — cards con glow igual al web
// ══════════════════════════════════════════════════════════════════════════════
class _ServicesPremium extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 40, 20, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                width: 3, height: 20,
                decoration: BoxDecoration(
                  gradient: AppColors.accentGradient,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 10),
              const Text(
                'NUESTROS SERVICIOS',
                style: TextStyle(
                  color: AppColors.accent,
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2,
                ),
              ),
            ],
          ).animate().fadeIn(delay: 700.ms),

          const SizedBox(height: 10),
          const Text(
            'Soluciones\nDigitales de Élite',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 30,
              fontWeight: FontWeight.w900,
              height: 1.1,
              letterSpacing: -1,
            ),
          ).animate().fadeIn(delay: 750.ms),

          const SizedBox(height: 20),

          ...MockData.services.asMap().entries.map((e) {
            final s = e.value;
            return _ServiceCardPremium(service: s, index: e.key);
          }),
        ],
      ),
    );
  }
}

class _ServiceCardPremium extends StatefulWidget {
  final dynamic service;
  final int index;
  const _ServiceCardPremium({required this.service, required this.index});

  @override
  State<_ServiceCardPremium> createState() => _ServiceCardPremiumState();
}

class _ServiceCardPremiumState extends State<_ServiceCardPremium> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        context.push('/services/${widget.service.id}', extra: widget.service);
      },
      onTapCancel: () => setState(() => _pressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: _pressed
              ? AppColors.surfaceHighlight
              : AppColors.surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: _pressed
                ? AppColors.accent.withOpacity(0.4)
                : AppColors.borderColor,
          ),
          boxShadow: _pressed
              ? [BoxShadow(color: AppColors.accent.withOpacity(0.1), blurRadius: 20)]
              : [],
        ),
        child: Row(
          children: [
            // Icono con glow
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppColors.accent.withOpacity(0.15),
                    AppColors.accentDark.withOpacity(0.08),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.accent.withOpacity(0.2)),
              ),
              child: Center(
                child: Text(widget.service.icon, style: const TextStyle(fontSize: 24)),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.service.title,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.3,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    widget.service.subtitle,
                    style: const TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            // Tag + flecha
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.accent.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    widget.service.tag,
                    style: const TextStyle(
                      color: AppColors.accent,
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                const Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 12,
                  color: AppColors.textMuted,
                ),
              ],
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: Duration(milliseconds: 800 + widget.index * 80)).slideX(begin: 0.05);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PORTAFOLIO PREVIEW — mini-cards horizontales con LIVE badge
// ══════════════════════════════════════════════════════════════════════════════
class _PortfolioPremium extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final projects = MockData.portfolio.take(4).toList();

    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 40, 0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.only(right: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 3, height: 16,
                          decoration: BoxDecoration(
                            gradient: AppColors.accentGradient,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'CASOS DE ÉXITO',
                          style: TextStyle(
                            color: AppColors.accent, fontSize: 10,
                            fontWeight: FontWeight.w800, letterSpacing: 2,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Proyectos Reales',
                      style: TextStyle(
                        color: AppColors.textPrimary, fontSize: 26,
                        fontWeight: FontWeight.w900, letterSpacing: -0.8,
                      ),
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => context.go('/portfolio'),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.borderColor),
                    ),
                    child: const Text(
                      'Ver todos →',
                      style: TextStyle(
                        color: AppColors.accent, fontSize: 12, fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 1000.ms),

          const SizedBox(height: 16),

          // Scroll horizontal de tarjetas
          SizedBox(
            height: 200,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.only(right: 20),
              itemCount: projects.length,
              itemBuilder: (context, i) {
                final p = projects[i];
                final color = Color(int.parse('0xFF${p.colorHex.replaceFirst('#', '')}'));
                final hasLive = p.liveUrl != null;

                return GestureDetector(
                  onTap: () => context.push('/portfolio/${p.id}', extra: p),
                  child: Container(
                    width: 185,
                    margin: const EdgeInsets.only(right: 12),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          color.withOpacity(0.2),
                          AppColors.surface,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: color.withOpacity(0.25)),
                      boxShadow: [
                        BoxShadow(color: color.withOpacity(0.1), blurRadius: 15),
                      ],
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Badge tipo + LIVE indicator
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                decoration: BoxDecoration(
                                  color: color.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  p.category.split('·').first.trim(),
                                  style: TextStyle(
                                    fontSize: 8, fontWeight: FontWeight.w700,
                                    color: color, letterSpacing: 0.3,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ),
                            if (hasLive) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 4, height: 4,
                                      decoration: const BoxDecoration(
                                        color: Colors.green, shape: BoxShape.circle,
                                      ),
                                    ),
                                    const SizedBox(width: 3),
                                    const Text(
                                      'LIVE',
                                      style: TextStyle(
                                        color: Colors.green, fontSize: 7,
                                        fontWeight: FontWeight.w900, letterSpacing: 0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),

                        const Spacer(),

                        Text(
                          p.title,
                          style: const TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.3,
                            height: 1.2,
                          ),
                          maxLines: 2,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            p.result,
                            style: TextStyle(
                              fontSize: 9, fontWeight: FontWeight.w700,
                              color: color,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ).animate()
                    .fadeIn(delay: Duration(milliseconds: 1050 + i * 80))
                    .slideX(begin: 0.12, delay: Duration(milliseconds: 1050 + i * 80));
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// CTA FINAL premium
// ══════════════════════════════════════════════════════════════════════════════
class _CtaPremium extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/contact'),
      child: Container(
        margin: const EdgeInsets.fromLTRB(20, 40, 20, 0),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.accent.withOpacity(0.15),
              AppColors.accentDark.withOpacity(0.08),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppColors.accent.withOpacity(0.3)),
          boxShadow: [
            BoxShadow(
              color: AppColors.accent.withOpacity(0.08),
              blurRadius: 30,
              spreadRadius: 0,
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '¿Listo para\nescalar tu negocio?',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      height: 1.2,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Cotización personalizada en 24h. Sin compromiso.',
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      gradient: AppColors.accentGradient,
                      borderRadius: BorderRadius.circular(10),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.accent.withOpacity(0.3),
                          blurRadius: 15, offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Cotizar ahora',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.3,
                          ),
                        ),
                        SizedBox(width: 6),
                        Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                gradient: AppColors.accentGradient,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.accent.withOpacity(0.4),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: const Icon(Icons.rocket_launch_rounded, color: Colors.white, size: 28),
            ),
          ],
        ),
      ).animate().fadeIn(delay: 1200.ms).slideY(begin: 0.1),
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// STAR FIELD PAINTER — partículas como el sitio web
// ══════════════════════════════════════════════════════════════════════════════
class _StarFieldPainter extends CustomPainter {
  final double progress;
  static final _rng = math.Random(42);
  static late final List<_Star> _stars;
  static bool _initialized = false;

  _StarFieldPainter(this.progress) {
    if (!_initialized) {
      _stars = List.generate(80, (i) => _Star(
        x: _rng.nextDouble(),
        y: _rng.nextDouble(),
        size: _rng.nextDouble() * 1.8 + 0.3,
        speed: _rng.nextDouble() * 0.3 + 0.05,
        opacity: _rng.nextDouble() * 0.5 + 0.1,
        phase: _rng.nextDouble() * math.pi * 2,
      ));
      _initialized = true;
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    // Grid sutil de fondo
    final gridPaint = Paint()
      ..color = AppColors.borderColor.withOpacity(0.2)
      ..strokeWidth = 0.4;
    const spacing = 50.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }

    // Estrellas animadas
    for (final star in _stars) {
      final twinkle = (math.sin(progress * math.pi * 2 * star.speed + star.phase) + 1) / 2;
      final opacity = star.opacity * (0.5 + twinkle * 0.5);
      final dy = (progress * star.speed * 0.15) % 1.0;
      final y = ((star.y + dy) % 1.0) * size.height;

      final paint = Paint()
        ..color = AppColors.accent.withOpacity(opacity)
        ..style = PaintingStyle.fill;

      // Glow
      canvas.drawCircle(
        Offset(star.x * size.width, y),
        star.size * 2,
        Paint()
          ..color = AppColors.accent.withOpacity(opacity * 0.3)
          ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 3),
      );
      canvas.drawCircle(
        Offset(star.x * size.width, y),
        star.size,
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(_StarFieldPainter old) => old.progress != progress;
}

class _Star {
  final double x, y, size, speed, opacity, phase;
  const _Star({
    required this.x, required this.y,
    required this.size, required this.speed,
    required this.opacity, required this.phase,
  });
}
