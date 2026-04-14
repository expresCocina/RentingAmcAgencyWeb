import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/widgets/shared_widgets.dart';
import '../../core/services/lead_service.dart';
import '../../core/services/whatsapp_service.dart';
import '../../core/models/models.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl  = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _msgCtrl   = TextEditingController();
  String _selectedService = 'Renting Web de Élite';
  bool _isLoading = false;
  bool _submitted = false;

  // Servicios reales de amcagencyweb.com
  static const _services = [
    'Renting Web de Élite',
    'Landing Page de Alta Conversión',
    'CRM & Automatizaciones',
    'Gestión de Redes Sociales',
    'Consultoría Digital',
    'Otro / Consulta General',
  ];

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _msgCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    final lead = LeadModel(
      name: _nameCtrl.text.trim(),
      email: _emailCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      service: _selectedService,
      message: _msgCtrl.text.trim(),
    );

    final ok = await LeadService.submitLead(lead);
    if (!mounted) return;
    setState(() { _isLoading = false; _submitted = ok; });
    if (!ok) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error al enviar. Intenta de nuevo.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Cotización'),
        leading: IconButton(
          icon: Container(
            width: 36, height: 36,
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.borderColor),
            ),
            child: const Icon(Icons.arrow_back_ios_new_rounded, size: 16),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: _submitted
          ? _SuccessView()
          : _FormView(
              formKey: _formKey,
              nameCtrl: _nameCtrl,
              emailCtrl: _emailCtrl,
              phoneCtrl: _phoneCtrl,
              msgCtrl: _msgCtrl,
              selectedService: _selectedService,
              services: _services,
              isLoading: _isLoading,
              onServiceChange: (v) => setState(() => _selectedService = v!),
              onSubmit: _submit,
            ),
    );
  }
}

// ── FORMULARIO ────────────────────────────────────────────────────────────
class _FormView extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController nameCtrl, emailCtrl, phoneCtrl, msgCtrl;
  final String selectedService;
  final List<String> services;
  final bool isLoading;
  final ValueChanged<String?> onServiceChange;
  final VoidCallback onSubmit;

  const _FormView({
    required this.formKey,
    required this.nameCtrl,
    required this.emailCtrl,
    required this.phoneCtrl,
    required this.msgCtrl,
    required this.selectedService,
    required this.services,
    required this.isLoading,
    required this.onServiceChange,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.screenPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHeader(
            eyebrow: 'Solicitud',
            title: 'Cuéntanos tu\nProyecto',
            subtitle: 'Te respondemos en menos de 24 horas con una propuesta personalizada.',
          ),
          const SizedBox(height: AppSpacing.lg),

          Form(
            key: formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Nombre
                _FieldLabel(label: 'Nombre completo'),
                const SizedBox(height: 6),
                TextFormField(
                  controller: nameCtrl,
                  textCapitalization: TextCapitalization.words,
                  decoration: const InputDecoration(
                    hintText: 'Ej. Juan Carlos Pérez',
                    prefixIcon: Icon(Icons.person_outline_rounded, size: 20),
                  ),
                  validator: (v) => (v == null || v.trim().length < 2)
                      ? 'Ingresa tu nombre completo'
                      : null,
                ),
                const SizedBox(height: AppSpacing.md),

                // Email
                _FieldLabel(label: 'Correo electrónico'),
                const SizedBox(height: 6),
                TextFormField(
                  controller: emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    hintText: 'tu@empresa.com',
                    prefixIcon: Icon(Icons.email_outlined, size: 20),
                  ),
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Ingresa tu correo';
                    if (!RegExp(r'^[\w.-]+@[\w.-]+\.\w+$').hasMatch(v.trim())) {
                      return 'Correo no válido';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.md),

                // Teléfono / WhatsApp
                _FieldLabel(label: 'WhatsApp / Teléfono'),
                const SizedBox(height: 6),
                TextFormField(
                  controller: phoneCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    hintText: '+57 300 000 0000',
                    prefixIcon: Icon(Icons.phone_outlined, size: 20),
                  ),
                  validator: (v) => (v == null || v.trim().length < 7)
                      ? 'Ingresa tu número de contacto'
                      : null,
                ),
                const SizedBox(height: AppSpacing.md),

                // Servicio
                _FieldLabel(label: 'Servicio de interés'),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: selectedService,
                  dropdownColor: AppColors.surfaceLight,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    fontFamily: 'Inter',
                  ),
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.grid_view_outlined, size: 20),
                  ),
                  items: services
                      .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                      .toList(),
                  onChanged: onServiceChange,
                ),
                const SizedBox(height: AppSpacing.md),

                // Mensaje
                _FieldLabel(label: 'Cuéntanos tu visión'),
                const SizedBox(height: 6),
                TextFormField(
                  controller: msgCtrl,
                  maxLines: 5,
                  textCapitalization: TextCapitalization.sentences,
                  decoration: const InputDecoration(
                    hintText:
                        'Describe tu proyecto, objetivos, tiempos y cualquier detalle relevante...',
                    alignLabelWithHint: true,
                  ),
                  validator: (v) => (v == null || v.trim().length < 10)
                      ? 'Escribe al menos 10 caracteres'
                      : null,
                ),
                const SizedBox(height: AppSpacing.xl),

                // Submit
                AmcButton(
                  label: 'Enviar Solicitud',
                  onPressed: onSubmit,
                  isLoading: isLoading,
                  width: double.infinity,
                  icon: Icons.send_rounded,
                ),
                const SizedBox(height: AppSpacing.md),

                // Trust signals
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.lock_outline_rounded,
                        size: 13, color: AppColors.textMuted),
                    const SizedBox(width: 5),
                    Text(
                      'Tus datos están protegidos y no se comparten.',
                      style: TextStyle(color: AppColors.textMuted, fontSize: 11),
                    ),
                  ],
                ),
                const SizedBox(height: 60),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── CAMPO LABEL ───────────────────────────────────────────────────────────
class _FieldLabel extends StatelessWidget {
  final String label;
  const _FieldLabel({required this.label});

  @override
  Widget build(BuildContext context) => Text(
        label,
        style: const TextStyle(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: AppColors.textPrimary,
        ),
      );
}

// ── ESTADO DE ÉXITO ───────────────────────────────────────────────────────
class _SuccessView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                gradient: AppColors.accentGradient,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.accent.withOpacity(0.35),
                    blurRadius: 40,
                  ),
                ],
              ),
              child: const Icon(Icons.check_rounded,
                  color: Colors.white, size: 50),
            )
                .animate()
                .scale(
                    begin: const Offset(0, 0),
                    duration: 600.ms,
                    curve: Curves.elasticOut),
            const SizedBox(height: 28),
            Text('¡Solicitud Enviada!',
                    style: Theme.of(context).textTheme.headlineMedium)
                .animate()
                .fadeIn(delay: 400.ms),
            const SizedBox(height: 12),
            Text(
              'Nuestro equipo revisará tu proyecto y te contactará en menos de 24 horas con una propuesta personalizada.',
              textAlign: TextAlign.center,
              style: Theme.of(context)
                  .textTheme
                  .bodyLarge
                  ?.copyWith(height: 1.65),
            ).animate().fadeIn(delay: 500.ms),
            const SizedBox(height: 36),
            Container(
              padding: const EdgeInsets.all(AppSpacing.md),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0x30C9A84C), Color(0x15C9A84C)],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.gold.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('⏱️', style: TextStyle(fontSize: 22)),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Tiempo de respuesta',
                          style: Theme.of(context)
                              .textTheme
                              .labelMedium
                              ?.copyWith(color: AppColors.gold)),
                      Text('Menos de 24 horas',
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(color: AppColors.goldLight)),
                    ],
                  ),
                ],
              ),
            ).animate().fadeIn(delay: 600.ms),
            const SizedBox(height: 28),
            AmcButton(
              label: 'Hablar por WhatsApp Ahora',
              onPressed: () => WhatsAppService.openWhatsApp(
                message:
                    'Hola! 👋 Acabo de enviar una solicitud de cotización en la app de AMC Agency. ¿Pueden confirmar que la recibieron?',
              ),
              width: double.infinity,
              icon: Icons.chat_bubble_outline_rounded,
            ).animate().fadeIn(delay: 700.ms),
          ],
        ),
      ),
    );
  }
}
