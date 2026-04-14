import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'core/navigation/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inicializar Supabase (para Auth y consultas directas del cliente)
  await Supabase.initialize(
    url: 'https://ngywfiecmrrlinckmfhx.supabase.co',
    anonKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5neXdmaWVjbXJybGluY2ttZmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NjgyNDIsImV4cCI6MjA4NzU0NDI0Mn0.qO4gvGUFdLoRz1u93dsEwisvX8gGEfvjdKjhLOrLk54',
  );

  // Restaurar sesión del usuario si existe
  await AuthService.restoreSession();

  // Orientación solo portrait
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Barra de sistema edge-to-edge
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF0F1420),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const AmcAgencyApp());
}

class AmcAgencyApp extends StatelessWidget {
  const AmcAgencyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'AMC Agency',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      routerConfig: AppRouter.router,
    );
  }
}
