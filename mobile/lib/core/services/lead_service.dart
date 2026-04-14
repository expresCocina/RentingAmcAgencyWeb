import '../models/models.dart';
import 'api_service.dart';

/// Service para enviar leads/cotizaciones desde la app.
/// Ahora usa la API de Next.js (amcagencyweb.com/api/app/leads)
/// en lugar de llamar a Supabase directamente.
/// Beneficios: email al admin, tracking de fuente, validaciones centralizadas.
class LeadService {
  LeadService._();

  // ── Public API ────────────────────────────────────────────────────────────

  /// Submit a quote request. Returns true if successful.
  static Future<bool> submitLead(LeadModel lead) async {
    final result = await ApiService.post<Map<String, dynamic>>(
      '/leads',
      {
        ...lead.toJson(),
        'app_version': '1.0.0',
        'device_info': 'flutter_mobile',
      },
      fromJson: (data) => data != null ? Map<String, dynamic>.from(data as Map) : {},
    );

    if (!result.success) {
      // ignore: avoid_print
      print('[LeadService] Error: ${result.error}');
    }

    return result.success;
  }
}
