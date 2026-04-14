import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/data/mock_data.dart';
import '../../core/models/models.dart';

class PortfolioScreen extends StatefulWidget {
  const PortfolioScreen({super.key});
  @override
  State<PortfolioScreen> createState() => _PortfolioScreenState();
}

class _PortfolioScreenState extends State<PortfolioScreen> with SingleTickerProviderStateMixin {
  late AnimationController _bgController;

  @override
  void initState() {
    super.initState();
    _bgController = AnimationController(vsync: this, duration: const Duration(seconds: 15))..repeat();
  }

  @override
  void dispose() {
    _bgController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Fondo partículas
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _bgController,
              builder: (_, __) => CustomPaint(
                painter: _PortfolioBgPainter(_bgController.value),
              ),
            ),
          ),
          // Orbe superior
          Positioned(
            top: -80, left: 0, right: 0,
            child: Container(
              height: 300,
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.topCenter,
                  radius: 1.0,
                  colors: [AppColors.accent.withOpacity(0.06), Colors.transparent],
                ),
              ),
            ),
          ),
          // Contenido
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // AppBar premium
              SliverAppBar(
                pinned: true,
                floating: false,
                backgroundColor: AppColors.background.withOpacity(0.85),
                elevation: 0,
                flexibleSpace: Container(
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(color: AppColors.borderColor.withOpacity(0.5)),
                    ),
                  ),
                ),
                title: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'CASOS DE ÉXITO',
                      style: TextStyle(
                        color: AppColors.accent,
                        fontSize: 9,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2.5,
                      ),
                    ),
                    const Text(
                      'Portafolio',
                      style: TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ],
                ),
              ),

              // Subtítulo
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Previsualiza cada proyecto\nen tiempo real.',
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                          height: 1.5,
                        ),
                      ).animate().fadeIn(delay: 100.ms),
                      const SizedBox(height: 20),
                    ],
                  ),
                ),
              ),

              // Grid de proyectos
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, i) => _ProjectCard3D(
                      project: MockData.portfolio[i],
                      index: i,
                    ),
                    childCount: MockData.portfolio.length,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// CARD 3D CON TILT — idéntico al efecto del Showcase web
// ══════════════════════════════════════════════════════════════════════════════
class _ProjectCard3D extends StatefulWidget {
  final ProjectModel project;
  final int index;
  const _ProjectCard3D({required this.project, required this.index});

  @override
  State<_ProjectCard3D> createState() => _ProjectCard3DState();
}

class _ProjectCard3DState extends State<_ProjectCard3D> with SingleTickerProviderStateMixin {
  late AnimationController _tiltController;
  double _tiltX = 0;
  double _tiltY = 0;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _tiltController = AnimationController(vsync: this, duration: const Duration(milliseconds: 300));
  }

  @override
  void dispose() {
    _tiltController.dispose();
    super.dispose();
  }

  void _onPanUpdate(DragUpdateDetails details, BuildContext context) {
    final box = context.findRenderObject() as RenderBox;
    final local = box.globalToLocal(details.globalPosition);
    setState(() {
      _tiltX = (local.dy / box.size.height - 0.5) * -12;
      _tiltY = (local.dx / box.size.width - 0.5) * 12;
    });
  }

  void _resetTilt() {
    setState(() {
      _tiltX = 0;
      _tiltY = 0;
      _pressed = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.project;
    final color = Color(int.parse('0xFF${p.colorHex.replaceFirst('#', '')}'));
    final hasLive = p.liveUrl != null;

    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        context.push('/portfolio/${p.id}', extra: p);
      },
      onTapCancel: _resetTilt,
      onPanUpdate: (d) => _onPanUpdate(d, context),
      onPanEnd: (_) => _resetTilt(),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 16),
        transform: Matrix4.identity()
          ..setEntry(3, 2, 0.001)
          ..rotateX(_tiltX * math.pi / 180)
          ..rotateY(_tiltY * math.pi / 180)
          ..scale(_pressed ? 0.97 : 1.0),
        child: Container(
          height: 220,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.18),
                AppColors.surface,
                AppColors.surfaceLight,
              ],
              stops: const [0.0, 0.5, 1.0],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: _pressed ? color.withOpacity(0.5) : color.withOpacity(0.2),
              width: _pressed ? 1.5 : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: color.withOpacity(_pressed ? 0.2 : 0.08),
                blurRadius: _pressed ? 30 : 15,
                offset: const Offset(0, 6),
              ),
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 20,
              ),
            ],
          ),
          child: Stack(
            children: [
              // Grid pattern de fondo
              Positioned.fill(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(24),
                  child: CustomPaint(painter: _CardGridPainter(color: color)),
                ),
              ),

              // Orbe de glow top-right
              Positioned(
                top: -30, right: -20,
                child: Container(
                  width: 120, height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [color.withOpacity(0.15), Colors.transparent],
                    ),
                  ),
                ),
              ),

              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top row: categoría + LIVE badge
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.4),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: color.withOpacity(0.3)),
                          ),
                          child: Text(
                            p.category,
                            style: TextStyle(
                              color: color,
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                        if (hasLive) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 5, height: 5,
                                  decoration: const BoxDecoration(
                                    color: Colors.green, shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  'LIVE',
                                  style: TextStyle(
                                    color: Colors.green,
                                    fontSize: 8,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: 1,
                                  ),
                                ),
                              ],
                            ),
                          ).animate(
                            effects: [ShimmerEffect(
                              color: Colors.green.withOpacity(0.3),
                              duration: const Duration(seconds: 2),
                              delay: Duration(milliseconds: widget.index * 200),
                            )],
                          ),
                        ],
                        const Spacer(),
                        Text(
                          '0${widget.index + 1}',
                          style: TextStyle(
                            color: color.withOpacity(0.4),
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),

                    const Spacer(),

                    // Título
                    Text(
                      p.title,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -0.5,
                        height: 1.1,
                      ),
                    ),

                    const SizedBox(height: 8),

                    Text(
                      p.description,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        height: 1.4,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),

                    const SizedBox(height: 12),

                    // Resultado + tech chips
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: color.withOpacity(0.2)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.trending_up_rounded, color: color, size: 12),
                              const SizedBox(width: 5),
                              Text(
                                p.result.split('·').first.trim(),
                                style: TextStyle(
                                  color: color, fontSize: 10, fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Spacer(),
                        Row(
                          children: [
                            for (final t in p.technologies.take(2))
                              Container(
                                margin: const EdgeInsets.only(left: 5),
                                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.borderColor),
                                ),
                                child: Text(t, style: const TextStyle(
                                  color: AppColors.textSecondary, fontSize: 8, fontWeight: FontWeight.w600,
                                )),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Arrow indicador
              Positioned(
                bottom: 20, right: 20,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  width: 32, height: 32,
                  decoration: BoxDecoration(
                    color: _pressed ? color.withOpacity(0.3) : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    Icons.arrow_forward_ios_rounded,
                    color: color.withOpacity(0.6),
                    size: 14,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate()
        .fadeIn(delay: Duration(milliseconds: 100 + widget.index * 100), duration: 500.ms)
        .slideY(begin: 0.1, delay: Duration(milliseconds: 100 + widget.index * 100));
  }
}

class _CardGridPainter extends CustomPainter {
  final Color color;
  const _CardGridPainter({required this.color});
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..color = color.withOpacity(0.07)..strokeWidth = 0.5;
    const s = 40.0;
    for (double x = 0; x < size.width; x += s) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), p);
    }
    for (double y = 0; y < size.height; y += s) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), p);
    }
  }
  @override
  bool shouldRepaint(_) => false;
}

class _PortfolioBgPainter extends CustomPainter {
  final double progress;
  static final _rng = math.Random(99);
  static late List<_Dot> _dots;
  static bool _init = false;

  _PortfolioBgPainter(this.progress) {
    if (!_init) {
      _dots = List.generate(60, (i) => _Dot(
        x: _rng.nextDouble(),
        y: _rng.nextDouble(),
        s: _rng.nextDouble() * 1.2 + 0.2,
        sp: _rng.nextDouble() * 0.2 + 0.02,
        op: _rng.nextDouble() * 0.4 + 0.05,
        ph: _rng.nextDouble() * math.pi * 2,
      ));
      _init = true;
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    final gp = Paint()..color = AppColors.borderColor.withOpacity(0.15)..strokeWidth = 0.3;
    const gs = 50.0;
    for (double x = 0; x < size.width; x += gs) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gp);
    }
    for (double y = 0; y < size.height; y += gs) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gp);
    }
    for (final d in _dots) {
      final tw = (math.sin(progress * math.pi * 2 * d.sp + d.ph) + 1) / 2;
      final op = d.op * (0.4 + tw * 0.6);
      final dy = (progress * d.sp * 0.1) % 1.0;
      final y = ((d.y + dy) % 1.0) * size.height;
      canvas.drawCircle(
        Offset(d.x * size.width, y), d.s,
        Paint()..color = AppColors.accent.withOpacity(op),
      );
    }
  }

  @override
  bool shouldRepaint(_PortfolioBgPainter old) => old.progress != progress;
}

class _Dot {
  final double x, y, s, sp, op, ph;
  const _Dot({required this.x, required this.y, required this.s, required this.sp, required this.op, required this.ph});
}
