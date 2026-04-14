import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/services/api_service.dart';
import '../../core/services/auth_service.dart';
import '../../core/theme/app_colors.dart';

/// Portal del cliente — muestra su plan activo, estado de pago y próximos vencimientos.
class ClientPortalScreen extends StatefulWidget {
  const ClientPortalScreen({super.key});

  @override
  State<ClientPortalScreen> createState() => _ClientPortalScreenState();
}

class _ClientPortalScreenState extends State<ClientPortalScreen> {
  Map<String, dynamic>? _profile;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    setState(() { _loading = true; _error = null; });
    final result = await ApiService.get<Map<String, dynamic>>(
      '/client/profile',
      fromJson: (data) => Map<String, dynamic>.from(data as Map),
    );
    if (!mounted) return;
    if (result.hasData) {
      setState(() { _profile = result.data; _loading = false; });
    } else {
      setState(() { _error = result.error; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text('Mi Portal', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700)),
        actions: [
          IconButton(
            icon: Icon(Icons.logout_rounded, color: AppColors.textSecondary),
            onPressed: () async {
              await AuthService.logout();
              if (mounted) context.go('/login');
            },
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? _buildError()
              : _buildPortal(),
    );
  }

  Widget _buildError() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, color: AppColors.textSecondary, size: 64),
            const SizedBox(height: 16),
            Text(_error!, textAlign: TextAlign.center, style: TextStyle(color: AppColors.textSecondary)),
            const SizedBox(height: 24),
            ElevatedButton(onPressed: _loadProfile, child: const Text('Reintentar')),
          ],
        ),
      ),
    );
  }

  Widget _buildPortal() {
    final p = _profile!;
    final isActive = p['paymentStatus'] == 'active';
    final isPending = p['paymentStatus'] == 'pending';
    final isBlocked = p['isBlocked'] == true;

    return RefreshIndicator(
      onRefresh: _loadProfile,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Saludo ─────────────────────────────────────────
            Text(
              '¡Bienvenido,',
              style: TextStyle(color: AppColors.textSecondary, fontSize: 14),
            ),
            Text(
              p['repName'] ?? p['businessName'] ?? 'Cliente',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 26,
                fontWeight: FontWeight.w800,
              ),
            ).animate().fadeIn().slideX(begin: -0.05),

            const SizedBox(height: 24),

            // ── Card Plan Activo ───────────────────────────────
            _buildPlanCard(p, isActive, isPending, isBlocked),
            const SizedBox(height: 16),

            // ── Card Info del dominio ──────────────────────────
            if (p['domain'] != null) _buildInfoCard(
              icon: Icons.language_rounded,
              title: 'Tu sitio web',
              subtitle: p['domain'],
              trailingIcon: Icons.open_in_new_rounded,
              onTap: () {/* TODO: url_launcher */},
            ),

            const SizedBox(height: 12),

            // ── Card Pagos ─────────────────────────────────────
            _buildInfoCard(
              icon: Icons.calendar_today_rounded,
              title: 'Próximo pago',
              subtitle: p['nextPaymentDate'] != null
                  ? _formatDate(p['nextPaymentDate'])
                  : 'Día ${p['billingDay'] ?? '-'} de cada mes',
            ),
            const SizedBox(height: 12),

            _buildInfoCard(
              icon: Icons.attach_money_rounded,
              title: 'Valor mensual',
              subtitle: '\$${_formatPrice(p['monthlyPrice'])} COP',
            ),

            const SizedBox(height: 24),

            // ── Acciones rápidas ───────────────────────────────
            Text(
              'Acciones rápidas',
              style: TextStyle(
                color: AppColors.textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: _buildActionButton(
                    icon: Icons.support_agent_rounded,
                    label: 'Soporte',
                    onTap: () => context.push('/contact'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    icon: Icons.workspace_premium_rounded,
                    label: 'Ver planes',
                    onTap: () => context.go('/plans'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildActionButton(
                    icon: Icons.grid_view_rounded,
                    label: 'Servicios',
                    onTap: () => context.go('/services'),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(Map p, bool isActive, bool isPending, bool isBlocked) {
    Color statusColor = isActive ? Colors.green : (isPending ? Colors.orange : Colors.red);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.accent.withOpacity(0.2),
            AppColors.accentDark.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.accent.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Plan activo', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  const SizedBox(height: 4),
                  Text(
                    p['planLabel'] ?? 'Plan',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: statusColor.withOpacity(0.4)),
                ),
                child: Text(
                  p['paymentStatusLabel'] ?? '',
                  style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          if (isBlocked) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: [
                  const Icon(Icons.lock_rounded, color: Colors.red, size: 16),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Text(
                      'Tu cuenta está suspendida. Contacta a soporte.',
                      style: TextStyle(color: Colors.red, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.05);
  }

  Widget _buildInfoCard({
    required IconData icon,
    required String title,
    required String subtitle,
    IconData? trailingIcon,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderColor),
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.accent, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            if (trailingIcon != null)
              Icon(trailingIcon, color: AppColors.textSecondary, size: 18),
          ],
        ),
      ).animate().fadeIn(delay: 200.ms),
    );
  }

  Widget _buildActionButton({required IconData icon, required String label, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.borderColor),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.accent, size: 24),
            const SizedBox(height: 6),
            Text(label, style: TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
          ],
        ),
      ).animate().fadeIn(delay: 300.ms),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('d MMM y', 'es').format(date);
    } catch (_) {
      return dateStr;
    }
  }

  String _formatPrice(dynamic price) {
    try {
      final num = double.parse(price.toString());
      return NumberFormat('#,###', 'es').format(num);
    } catch (_) {
      return price?.toString() ?? '0';
    }
  }
}
