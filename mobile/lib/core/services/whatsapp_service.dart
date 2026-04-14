import 'package:url_launcher/url_launcher.dart';

/// Service to handle WhatsApp integration
class WhatsAppService {
  WhatsAppService._();

  static const String _phoneNumber = '573138537261';
  static const String _defaultMessage =
      'Hola! 👋 Vi la app de AMC Agency y me gustaría conocer más sobre sus servicios digitales.';

  /// Open WhatsApp with a predefined message
  static Future<void> openWhatsApp({String? message}) async {
    final text = Uri.encodeComponent(message ?? _defaultMessage);
    final url = Uri.parse('https://wa.me/$_phoneNumber?text=$text');

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  /// Open WhatsApp for a specific service inquiry
  static Future<void> openForService(String serviceName) async {
    final message =
        'Hola! 👋 Me interesa el servicio de *$serviceName* que vi en la app de AMC Agency. ¿Podemos coordinar una llamada?';
    await openWhatsApp(message: message);
  }

  /// Open WhatsApp for a specific plan
  static Future<void> openForPlan(String planName) async {
    final message =
        'Hola! 👋 Me interesa el plan *$planName* de AMC Agency. ¿Pueden enviarme información y una cotización personalizada?';
    await openWhatsApp(message: message);
  }

  /// Open an external URL
  static Future<void> openUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
