import 'dart:convert';
import 'package:http/http.dart' as http;

/// Servicio HTTP centralizado para comunicarse con la API de Next.js.
/// Toda la app usa este servicio — un solo lugar para cambiar la base URL.
class ApiService {
  ApiService._();

  // ── Configuración ────────────────────────────────────────────────────────
  // En producción apunta a amcagencyweb.com, en debug a localhost:3000
  static const String _prodBaseUrl = 'https://www.amcagencyweb.com/api/app';
  static const String _devBaseUrl = 'http://10.0.2.2:3000/api/app'; // Android emulator
  // Para dispositivo físico en desarrollo, usa tu IP local:
  // static const String _devBaseUrl = 'http://192.168.x.x:3000/api/app';

  static String get baseUrl {
    // ignore: do_not_use_environment
    const isRelease = bool.fromEnvironment('dart.vm.product');
    return isRelease ? _prodBaseUrl : _devBaseUrl;
  }

  static Duration get timeout => const Duration(seconds: 15);

  // ── Token de autenticación ───────────────────────────────────────────────
  static String? _authToken;

  static void setAuthToken(String? token) {
    _authToken = token;
  }

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_authToken != null) 'Authorization': 'Bearer $_authToken',
      };

  // ── GET ──────────────────────────────────────────────────────────────────

  static Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, String>? queryParams,
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path').replace(
        queryParameters: queryParams,
      );

      final response = await http
          .get(uri, headers: _headers)
          .timeout(timeout);

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse.error(_getErrorMessage(e));
    }
  }

  // ── POST ─────────────────────────────────────────────────────────────────

  static Future<ApiResponse<T>> post<T>(
    String path,
    Map<String, dynamic> body, {
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');

      final response = await http
          .post(
            uri,
            headers: _headers,
            body: jsonEncode(body),
          )
          .timeout(timeout);

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse.error(_getErrorMessage(e));
    }
  }

  // ── PATCH ────────────────────────────────────────────────────────────────

  static Future<ApiResponse<T>> patch<T>(
    String path,
    Map<String, dynamic> body, {
    T Function(dynamic)? fromJson,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');

      final response = await http
          .patch(
            uri,
            headers: _headers,
            body: jsonEncode(body),
          )
          .timeout(timeout);

      return _handleResponse<T>(response, fromJson);
    } catch (e) {
      return ApiResponse.error(_getErrorMessage(e));
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  static ApiResponse<T> _handleResponse<T>(
    http.Response response,
    T Function(dynamic)? fromJson,
  ) {
    try {
      final json = jsonDecode(response.body) as Map<String, dynamic>;
      final success = json['success'] as bool? ?? false;

      if (!success || response.statusCode >= 400) {
        return ApiResponse.error(json['error'] as String? ?? 'Error desconocido');
      }

      final data = json['data'];
      if (fromJson != null && data != null) {
        return ApiResponse.success(fromJson(data));
      }

      return ApiResponse.success(data as T?);
    } catch (e) {
      return ApiResponse.error('Error al procesar la respuesta del servidor');
    }
  }

  static String _getErrorMessage(dynamic error) {
    final str = error.toString();
    if (str.contains('SocketException') || str.contains('Connection refused')) {
      return 'Sin conexión a internet. Verifica tu red.';
    }
    if (str.contains('TimeoutException')) {
      return 'La solicitud tardó demasiado. Intenta de nuevo.';
    }
    return 'Error de conexión. Intenta de nuevo.';
  }
}

// ── Modelo de respuesta genérica ─────────────────────────────────────────────

class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? error;

  const ApiResponse._({
    required this.success,
    this.data,
    this.error,
  });

  factory ApiResponse.success(T? data) =>
      ApiResponse._(success: true, data: data);

  factory ApiResponse.error(String message) =>
      ApiResponse._(success: false, error: message);

  bool get hasError => !success || error != null;
  bool get hasData => success && data != null;
}
