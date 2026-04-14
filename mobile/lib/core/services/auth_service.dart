import 'package:supabase_flutter/supabase_flutter.dart';
import 'api_service.dart';

/// Enum de roles de usuario en la app
enum UserRole { guest, client, admin }

/// Modelo del usuario autenticado con su rol
class AppUser {
  final String id;
  final String email;
  final UserRole role;
  final String? token;

  const AppUser({
    required this.id,
    required this.email,
    required this.role,
    this.token,
  });

  bool get isAdmin => role == UserRole.admin;
  bool get isClient => role == UserRole.client;
  bool get isGuest => role == UserRole.guest;
}

/// Servicio de autenticación — login, logout y detección de rol
class AuthService {
  AuthService._();

  static final _supabase = Supabase.instance.client;

  // Emails de administradores — deben coincidir con ADMIN_EMAIL del sitio web
  static const _adminEmails = [
    'contact@amcagencyweb.com', // Email principal del admin (mismo que el sitio web)
    'info@amcagencyweb.com',
    'admin@amcagencyweb.com',
  ];

  // Usuario activo en memoria
  static AppUser? _currentUser;
  static AppUser? get currentUser => _currentUser;

  static bool get isLoggedIn => _currentUser != null;
  static bool get isAdmin => _currentUser?.isAdmin ?? false;
  static bool get isClient => _currentUser?.isClient ?? false;

  // ── Inicialización ───────────────────────────────────────────────────────

  /// Llama esto al arrancar la app para restaurar sesión persistida
  static Future<AppUser?> restoreSession() async {
    final session = _supabase.auth.currentSession;
    if (session == null) return null;

    return _buildUser(session.user, session.accessToken);
  }

  // ── Login ────────────────────────────────────────────────────────────────

  /// Login con email y contraseña vía Supabase Auth
  static Future<AuthResult> login(String email, String password) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email.trim(),
        password: password.trim(),
      );

      if (response.user == null || response.session == null) {
        return AuthResult.error('Credenciales inválidas. Revisa tu email y contraseña.');
      }

      final user = await _buildUser(response.user!, response.session!.accessToken);
      return AuthResult.success(user);
    } on AuthException catch (e) {
      return AuthResult.error(_translateAuthError(e.message));
    } catch (e) {
      return AuthResult.error('Error de conexión. Intenta de nuevo.');
    }
  }

  // ── Logout ───────────────────────────────────────────────────────────────

  static Future<void> logout() async {
    await _supabase.auth.signOut();
    _currentUser = null;
    ApiService.setAuthToken(null);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  static Future<AppUser> _buildUser(User supabaseUser, String token) async {
    final email = supabaseUser.email ?? '';
    final role = _adminEmails.contains(email) ? UserRole.admin : UserRole.client;

    // Configurar el token en el servicio HTTP
    ApiService.setAuthToken(token);

    _currentUser = AppUser(
      id: supabaseUser.id,
      email: email,
      role: role,
      token: token,
    );

    return _currentUser!;
  }

  static String _translateAuthError(String message) {
    if (message.contains('Invalid login credentials')) {
      return 'Email o contraseña incorrectos.';
    }
    if (message.contains('Email not confirmed')) {
      return 'Debes confirmar tu email primero.';
    }
    if (message.contains('Too many requests')) {
      return 'Demasiados intentos. Espera unos minutos.';
    }
    return 'Error al iniciar sesión. Intenta de nuevo.';
  }
}

// ── Resultado de autenticación ────────────────────────────────────────────────

class AuthResult {
  final bool success;
  final AppUser? user;
  final String? error;

  const AuthResult._({required this.success, this.user, this.error});

  factory AuthResult.success(AppUser user) =>
      AuthResult._(success: true, user: user);

  factory AuthResult.error(String message) =>
      AuthResult._(success: false, error: message);
}
