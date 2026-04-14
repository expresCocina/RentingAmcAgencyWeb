import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../services/whatsapp_service.dart';
import '../services/auth_service.dart';
import '../widgets/shared_widgets.dart';

class MainScaffold extends StatelessWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  static const List<_NavItem> _navItems = [
    _NavItem(label: 'Inicio', icon: Icons.home_outlined, filledIcon: Icons.home_rounded, path: '/home'),
    _NavItem(label: 'Servicios', icon: Icons.grid_view_outlined, filledIcon: Icons.grid_view_rounded, path: '/services'),
    _NavItem(label: 'Portafolio', icon: Icons.work_outline_rounded, filledIcon: Icons.work_rounded, path: '/portfolio'),
    _NavItem(label: 'Planes', icon: Icons.workspace_premium_outlined, filledIcon: Icons.workspace_premium_rounded, path: '/plans'),
    _NavItem(label: 'Más', icon: Icons.more_horiz_outlined, filledIcon: Icons.more_horiz_rounded, path: '/more'),
  ];

  /// Navega al portal del usuario según su rol
  void _goToPortal(BuildContext context) {
    if (!AuthService.isLoggedIn) {
      context.push('/login');
    } else if (AuthService.isAdmin) {
      context.push('/admin-dashboard');
    } else {
      context.push('/client-portal');
    }
  }

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final index = _navItems.indexWhere((item) => location.startsWith(item.path));
    return index < 0 ? 0 : index;
  }

  @override
  Widget build(BuildContext context) {
    final currentIndex = _currentIndex(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          child,
          // WhatsApp FAB overlaid on every screen
          WhatsAppFab(
            onTap: () => WhatsAppService.openWhatsApp(),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(context, currentIndex),
    );
  }

  Widget _buildBottomNav(BuildContext context, int currentIndex) {
    return Container(
      decoration: BoxDecoration(
        // Glassmorphism background
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AppColors.surface.withOpacity(0.85),
            AppColors.background.withOpacity(0.95),
          ],
        ),
        border: const Border(
          top: BorderSide(color: Color(0xFF1E2030), width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.4),
            blurRadius: 30,
            offset: const Offset(0, -8),
          ),
          BoxShadow(
            color: AppColors.accent.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 62,
          child: Row(
            children: [
              ..._navItems.asMap().entries.map((entry) {
                final idx = entry.key;
                final item = entry.value;
                final isActive = idx == currentIndex;

                return Expanded(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      if (!isActive) context.go(item.path);
                    },
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          width: isActive ? 42 : 30,
                          height: isActive ? 32 : 26,
                          decoration: isActive ? BoxDecoration(
                            color: AppColors.accent.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.accent.withOpacity(0.2),
                                blurRadius: 12,
                                spreadRadius: 0,
                              ),
                            ],
                          ) : null,
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 200),
                            child: Icon(
                              isActive ? item.filledIcon : item.icon,
                              key: ValueKey(isActive),
                              color: isActive ? AppColors.accent : AppColors.textSecondary,
                              size: isActive ? 20 : 19,
                            ),
                          ),
                        ),
                        const SizedBox(height: 3),
                        AnimatedDefaultTextStyle(
                          duration: const Duration(milliseconds: 200),
                          style: TextStyle(
                            fontSize: isActive ? 10 : 9,
                            fontWeight: isActive ? FontWeight.w800 : FontWeight.w400,
                            color: isActive ? AppColors.accent : AppColors.textSecondary,
                            letterSpacing: isActive ? 0.3 : 0,
                          ),
                          child: Text(item.label),
                        ),
                      ],
                    ),
                  ),
                );

              }),
              // ── Botón portal / cuenta ──────────────────────
              Expanded(
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: () => _goToPortal(context),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Stack(
                        alignment: Alignment.topRight,
                        children: [
                          Icon(
                            AuthService.isLoggedIn
                                ? (AuthService.isAdmin
                                    ? Icons.admin_panel_settings_rounded
                                    : Icons.account_circle_rounded)
                                : Icons.person_outline_rounded,
                            color: AppColors.accent,
                            size: 22,
                          ),
                          if (AuthService.isLoggedIn)
                            Container(
                              width: 7,
                              height: 7,
                              decoration: const BoxDecoration(
                                color: Colors.green,
                                shape: BoxShape.circle,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        AuthService.isAdmin ? 'Admin' : (AuthService.isClient ? 'Portal' : 'Cuenta'),
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: AppColors.accent,
                          letterSpacing: 0.2,
                        ),
                      ),
                      const SizedBox(height: 4),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final String label;
  final IconData icon;
  final IconData filledIcon;
  final String path;

  const _NavItem({
    required this.label,
    required this.icon,
    required this.filledIcon,
    required this.path,
  });
}
