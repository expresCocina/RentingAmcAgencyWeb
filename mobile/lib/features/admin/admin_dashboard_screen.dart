import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/services/api_service.dart';
import '../../core/services/auth_service.dart';
import '../../core/theme/app_colors.dart';

/// Dashboard del administrador — métricas del negocio, clientes y leads en tiempo real.
class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic>? _stats;
  List<Map<String, dynamic>> _recentLeads = [];
  bool _loading = true;
  String? _error;
  int _selectedTab = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() { _loading = true; _error = null; });

    final statsResult = await ApiService.get<Map<String, dynamic>>(
      '/admin/stats',
      fromJson: (data) => Map<String, dynamic>.from(data as Map),
    );

    final leadsResult = await ApiService.get<List<Map<String, dynamic>>>(
      '/admin/leads',
      queryParams: {'limit': '10'},
      fromJson: (data) => (data as List).map((e) => Map<String, dynamic>.from(e as Map)).toList(),
    );

    if (!mounted) return;

    if (statsResult.hasData) {
      setState(() {
        _stats = statsResult.data;
        _recentLeads = leadsResult.data ?? [];
        _loading = false;
      });
    } else {
      setState(() { _error = statsResult.error; _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Dashboard Admin', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800, fontSize: 18)),
            Text('AMC Agency', style: TextStyle(color: AppColors.accent, fontSize: 11, fontWeight: FontWeight.w600)),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh_rounded, color: AppColors.textSecondary),
            onPressed: _loadData,
          ),
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
              : _buildDashboard(),
    );
  }

  Widget _buildError() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.cloud_off_rounded, color: AppColors.textSecondary, size: 64),
          const SizedBox(height: 16),
          Text(_error!, textAlign: TextAlign.center, style: TextStyle(color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton.icon(onPressed: _loadData, icon: const Icon(Icons.refresh), label: const Text('Reintentar')),
        ],
      ),
    );
  }

  Widget _buildDashboard() {
    return Column(
      children: [
        // ── Tabs ─────────────────────────────────────────────
        Container(
          color: AppColors.surface,
          child: Row(
            children: [
              _buildTab('Resumen', 0),
              _buildTab('Leads', 1),
              _buildTab('Clientes', 2),
            ],
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: _loadData,
            child: _selectedTab == 0
                ? _buildResumen()
                : _selectedTab == 1
                    ? _buildLeadsTab()
                    : _buildClientesTab(),
          ),
        ),
      ],
    );
  }

  Widget _buildTab(String label, int index) {
    final isSelected = _selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = index),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isSelected ? AppColors.accent : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? AppColors.accent : AppColors.textSecondary,
              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
              fontSize: 13,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResumen() {
    final s = _stats!;
    final clients = s['clients'] as Map? ?? {};
    final leads = s['leads'] as Map? ?? {};
    final revenue = s['revenue'] as Map? ?? {};

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Ingresos ──────────────────────────────────────
          _buildRevenueCard(revenue),
          const SizedBox(height: 16),

          // ── Grid de métricas ───────────────────────────────
          Text('Clientes', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16)),
          const SizedBox(height: 10),
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.1,
            children: [
              _buildMetricCard('Total', '${clients['total'] ?? 0}', Icons.group_rounded, AppColors.accent),
              _buildMetricCard('Activos', '${clients['active'] ?? 0}', Icons.check_circle_outline_rounded, Colors.green),
              _buildMetricCard('Vencidos', '${clients['overdue'] ?? 0}', Icons.warning_amber_rounded, Colors.orange),
            ],
          ),

          const SizedBox(height: 16),
          Text('Leads', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16)),
          const SizedBox(height: 10),
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.1,
            children: [
              _buildMetricCard('Total', '${leads['total'] ?? 0}', Icons.people_outline_rounded, AppColors.accent),
              _buildMetricCard('Nuevos', '${leads['new'] ?? 0}', Icons.fiber_new_rounded, Colors.blue),
              _buildMetricCard('App', '${leads['fromApp'] ?? 0}', Icons.phone_android_rounded, Colors.purple),
            ],
          ),

          const SizedBox(height: 16),

          // ── Accesos rápidos ────────────────────────────────
          Text('Gestionar', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 16)),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _buildActionCard(
                  icon: Icons.people_rounded,
                  label: 'Ver todos los clientes',
                  onTap: () => setState(() => _selectedTab = 2),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildActionCard(
                  icon: Icons.inbox_rounded,
                  label: 'Ver todos los leads',
                  onTap: () => setState(() => _selectedTab = 1),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRevenueCard(Map revenue) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [AppColors.accent.withOpacity(0.3), AppColors.accentDark.withOpacity(0.15)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.accent.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.trending_up_rounded, color: Colors.green, size: 36),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Ingreso mensual recurrente', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
              Text(
                revenue['monthlyFormatted'] ?? '\$0',
                style: TextStyle(color: AppColors.textPrimary, fontSize: 24, fontWeight: FontWeight.w800),
              ),
              Text('Solo clientes activos', style: TextStyle(color: Colors.green, fontSize: 11)),
            ],
          ),
        ],
      ),
    ).animate().fadeIn().slideY(begin: 0.05);
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.borderColor),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(value, style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontWeight: FontWeight.w800)),
          Text(label, style: TextStyle(color: AppColors.textSecondary, fontSize: 10)),
        ],
      ),
    ).animate().fadeIn(delay: 100.ms);
  }

  Widget _buildActionCard({required IconData icon, required String label, required VoidCallback onTap}) {
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
            Icon(icon, color: AppColors.accent, size: 20),
            const SizedBox(width: 8),
            Expanded(child: Text(label, style: TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600))),
            Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textSecondary, size: 12),
          ],
        ),
      ),
    );
  }

  Widget _buildLeadsTab() {
    return _AsyncLeadsList(key: const ValueKey('leads_list'));
  }

  Widget _buildClientesTab() {
    return _AsyncClientsList(key: const ValueKey('clients_list'));
  }
}

// ── Widget para lista de leads (con carga independiente) ─────────────────────

class _AsyncLeadsList extends StatefulWidget {
  const _AsyncLeadsList({super.key});
  @override State<_AsyncLeadsList> createState() => _AsyncLeadsListState();
}

class _AsyncLeadsListState extends State<_AsyncLeadsList> {
  List<Map<String, dynamic>> _leads = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    final result = await ApiService.get<List<Map<String, dynamic>>>(
      '/admin/leads',
      queryParams: {'limit': '50'},
      fromJson: (data) => (data as List).map((e) => Map<String, dynamic>.from(e as Map)).toList(),
    );
    if (mounted) setState(() { _leads = result.data ?? []; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_leads.isEmpty) return Center(child: Text('No hay leads', style: TextStyle(color: AppColors.textSecondary)));

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _leads.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final lead = _leads[index];
        final isNew = lead['status'] == 'new';
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isNew ? AppColors.accent.withOpacity(0.4) : AppColors.borderColor,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(
                  color: (isNew ? AppColors.accent : AppColors.textSecondary).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  lead['source'] == 'app_mobile' ? Icons.phone_android_rounded : Icons.language_rounded,
                  color: isNew ? AppColors.accent : AppColors.textSecondary,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(lead['name'] ?? '', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 14)),
                    Text('${lead['service'] ?? ''} • ${lead['sourceLabel'] ?? ''}',
                        style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor(lead['status']).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  lead['statusLabel'] ?? '',
                  style: TextStyle(color: _getStatusColor(lead['status']), fontSize: 11, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ).animate().fadeIn(delay: (index * 50).ms);
      },
    );
  }

  Color _getStatusColor(String? status) {
    switch (status) {
      case 'new': return Colors.blue;
      case 'contacted': return Colors.orange;
      case 'converted': return Colors.green;
      case 'lost': return Colors.red;
      default: return Colors.grey;
    }
  }
}

// ── Widget para lista de clientes ─────────────────────────────────────────────

class _AsyncClientsList extends StatefulWidget {
  const _AsyncClientsList({super.key});
  @override State<_AsyncClientsList> createState() => _AsyncClientsListState();
}

class _AsyncClientsListState extends State<_AsyncClientsList> {
  List<Map<String, dynamic>> _clients = [];
  bool _loading = true;

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    final result = await ApiService.get<List<Map<String, dynamic>>>(
      '/admin/clients',
      queryParams: {'limit': '100'},
      fromJson: (data) => (data as List).map((e) => Map<String, dynamic>.from(e as Map)).toList(),
    );
    if (mounted) setState(() { _clients = result.data ?? []; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_clients.isEmpty) return Center(child: Text('No hay clientes', style: TextStyle(color: AppColors.textSecondary)));

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _clients.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final client = _clients[index];
        final status = client['paymentStatus'];
        final statusColor = status == 'active' ? Colors.green : (status == 'overdue' ? Colors.red : Colors.orange);
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderColor),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(client['businessName'] ?? '', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 14)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: statusColor.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                    child: Text(client['paymentStatusLabel'] ?? '', style: TextStyle(color: statusColor, fontSize: 11, fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text('${client['planLabel']} • \$${client['monthlyPrice']}/mes',
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              Text(client['domain'] ?? '', style: TextStyle(color: AppColors.accent, fontSize: 11)),
            ],
          ),
        ).animate().fadeIn(delay: (index * 30).ms);
      },
    );
  }
}
