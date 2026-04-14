import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import '../../core/models/models.dart';
import '../../core/theme/app_colors.dart';

/// Pantalla de detalle de un proyecto con WebView en vivo.
/// Muestra el sitio web real del cliente dentro de la app.
class ProjectDetailScreen extends StatefulWidget {
  final ProjectModel? project;
  const ProjectDetailScreen({super.key, this.project});

  @override
  State<ProjectDetailScreen> createState() => _ProjectDetailScreenState();
}

class _ProjectDetailScreenState extends State<ProjectDetailScreen> {
  late final WebViewController? _controller;
  bool _loading = true;
  bool _hasLiveUrl = false;
  bool _webViewMode = false; // true = pantalla completa WebView

  @override
  void initState() {
    super.initState();
    final liveUrl = widget.project?.liveUrl;
    _hasLiveUrl = liveUrl != null && liveUrl.isNotEmpty;
    if (_hasLiveUrl) {
      _controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setNavigationDelegate(NavigationDelegate(
          onPageStarted: (_) => setState(() => _loading = true),
          onPageFinished: (_) => setState(() => _loading = false),
          onWebResourceError: (_) => setState(() => _loading = false),
        ))
        ..loadRequest(Uri.parse(liveUrl!));
    } else {
      _controller = null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.project;
    if (p == null) return const Scaffold(body: Center(child: Text('Proyecto no encontrado')));

    // Modo pantalla completa WebView
    if (_webViewMode && _hasLiveUrl) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: AppColors.surface,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
            onPressed: () => setState(() => _webViewMode = false),
          ),
          title: Row(
            children: [
              Container(
                width: 8, height: 8,
                decoration: const BoxDecoration(color: Colors.green, shape: BoxShape.circle),
              ),
              const SizedBox(width: 6),
              const Text('LIVE', style: TextStyle(
                color: Colors.green, fontSize: 10,
                fontWeight: FontWeight.w900, letterSpacing: 1,
              )),
              const SizedBox(width: 10),
              Flexible(child: Text(
                p.liveUrl ?? '',
                style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                overflow: TextOverflow.ellipsis,
              )),
            ],
          ),
          actions: [
            if (_loading) const Padding(
              padding: EdgeInsets.only(right: 12),
              child: SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)),
            ),
          ],
        ),
        body: WebViewWidget(controller: _controller!),
      );
    }

    // Modo normal: info del proyecto + preview
    final color = Color(int.parse('0xFF${p.colorHex.replaceFirst('#', '')}'));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // ── AppBar con preview del sitio ──────────────────────────────────
          SliverAppBar(
            expandedHeight: _hasLiveUrl ? 280 : 200,
            pinned: true,
            backgroundColor: AppColors.surface,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              if (_hasLiveUrl)
                GestureDetector(
                  onTap: () => setState(() => _webViewMode = true),
                  child: Container(
                    margin: const EdgeInsets.only(right: 12),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.green.withOpacity(0.4)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.wifi_rounded, color: Colors.green, size: 12),
                        SizedBox(width: 4),
                        Text('VER LIVE', style: TextStyle(
                          color: Colors.green, fontSize: 9,
                          fontWeight: FontWeight.w900, letterSpacing: 1,
                        )),
                      ],
                    ),
                  ),
                ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: _hasLiveUrl
                  ? Stack(
                      children: [
                        // WebView preview
                        SizedBox(
                          width: double.infinity,
                          height: double.infinity,
                          child: ClipRect(
                            child: OverflowBox(
                              alignment: Alignment.topLeft,
                              maxWidth: double.infinity,
                              maxHeight: double.infinity,
                              child: SizedBox(
                                width: MediaQuery.of(context).size.width * 3,
                                height: 900,
                                child: Transform.scale(
                                  scale: 0.333,
                                  alignment: Alignment.topLeft,
                                  child: WebViewWidget(controller: _controller!),
                                ),
                              ),
                            ),
                          ),
                        ),
                        // Loading overlay
                        if (_loading) Container(
                          color: AppColors.background,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                CircularProgressIndicator(
                                  valueColor: AlwaysStoppedAnimation(AppColors.accent),
                                  strokeWidth: 2,
                                ),
                                const SizedBox(height: 10),
                                Text('Cargando ${p.title}...',
                                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                              ],
                            ),
                          ),
                        ),
                        // Badge LIVE
                        if (!_loading) Positioned(
                          top: 60,
                          right: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.7),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Row(
                              children: [
                                Icon(Icons.circle, color: Colors.green, size: 6),
                                SizedBox(width: 4),
                                Text('LIVE', style: TextStyle(
                                  color: Colors.green, fontSize: 9,
                                  fontWeight: FontWeight.w900, letterSpacing: 1,
                                )),
                              ],
                            ),
                          ),
                        ),
                        // Gradiente inferior
                        Positioned.fill(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [Colors.transparent, AppColors.background.withOpacity(0.8)],
                                stops: const [0.5, 1.0],
                              ),
                            ),
                          ),
                        ),
                      ],
                    )
                  : Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [color.withOpacity(0.3), AppColors.surface],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: Center(child: Text(p.category,
                        style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.w700))),
                    ),
            ),
          ),

          // ── Info del proyecto ─────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Categoría
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(p.category, style: TextStyle(
                      color: color, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5,
                    )),
                  ),
                  const SizedBox(height: 12),

                  // Título
                  Text(p.title, style: const TextStyle(
                    color: AppColors.textPrimary, fontSize: 28, fontWeight: FontWeight.w800,
                  )),
                  const SizedBox(height: 8),

                  // Descripción larga
                  Text(p.description, style: const TextStyle(
                    color: AppColors.textSecondary, fontSize: 14, height: 1.7,
                  )),
                  const SizedBox(height: 20),

                  // Resultado
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color.withOpacity(0.15), color.withOpacity(0.05)],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: color.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.trending_up_rounded, color: color, size: 20),
                        const SizedBox(width: 10),
                        Expanded(child: Text(p.result, style: TextStyle(
                          color: color, fontSize: 14, fontWeight: FontWeight.w700,
                        ))),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Tecnologías
                  const Text('Tecnologías', style: TextStyle(
                    color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w700,
                  )),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: p.technologies.map((t) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.borderColor),
                      ),
                      child: Text(t, style: const TextStyle(
                        color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600,
                      )),
                    )).toList(),
                  ),

                  const SizedBox(height: 32),

                  // Botón ver sitio en vivo (fullscreen)
                  if (_hasLiveUrl)
                    SizedBox(
                      width: double.infinity,
                      child: GestureDetector(
                        onTap: () => setState(() => _webViewMode = true),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(
                            gradient: AppColors.accentGradient,
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: [BoxShadow(
                              color: AppColors.accent.withOpacity(0.3),
                              blurRadius: 20, offset: const Offset(0, 6),
                            )],
                          ),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.open_in_full_rounded, color: Colors.white, size: 18),
                              SizedBox(width: 8),
                              Text('Ver sitio completo', style: TextStyle(
                                color: Colors.white, fontSize: 15,
                                fontWeight: FontWeight.w800, letterSpacing: 0.5,
                              )),
                            ],
                          ),
                        ),
                      ),
                    ),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
