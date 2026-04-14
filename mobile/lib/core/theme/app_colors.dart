import 'package:flutter/material.dart';

/// AMC Agency Brand Color System
/// Dark tech-luxury palette with electric blue accent and gold highlights
class AppColors {
  AppColors._();

  // ── Primary Background ──────────────────────────────────────────────────
  static const Color background     = Color(0xFF080B12);  // Deep space black
  static const Color surface        = Color(0xFF0F1420);  // Dark navy surface
  static const Color surfaceLight   = Color(0xFF141929);  // Card backgrounds
  static const Color surfaceHighlight = Color(0xFF1A2035); // Elevated surfaces

  // ── Brand Accent Colors ─────────────────────────────────────────────────
  static const Color accent         = Color(0xFF00B4FF);  // Electric blue
  static const Color accentDark     = Color(0xFF0090CC);  // Darker blue
  static const Color accentGlow     = Color(0x3300B4FF);  // Blue glow (30%)
  static const Color gold           = Color(0xFFC9A84C);  // Premium gold
  static const Color goldLight      = Color(0xFFE4C46A);  // Light gold
  static const Color goldGlow       = Color(0x30C9A84C);  // Gold glow (30%)

  // ── Text Colors ─────────────────────────────────────────────────────────
  static const Color textPrimary    = Color(0xFFF0F4FF);  // Primary white
  static const Color textSecondary  = Color(0xFF8A95B4);  // Muted blue-gray
  static const Color textMuted      = Color(0xFF4A5568);  // Very muted

  // ── Status Colors ───────────────────────────────────────────────────────
  static const Color success        = Color(0xFF00D4A1);  // Teal success
  static const Color warning        = Color(0xFFFFA500);  // Amber warning
  static const Color error          = Color(0xFFFF4D6D);  // Red error

  // ── Border & Divider ────────────────────────────────────────────────────
  static const Color borderColor    = Color(0xFF1E2740);  // Subtle border
  static const Color borderActive   = Color(0xFF00B4FF);  // Active border

  // ── WhatsApp ─────────────────────────────────────────────────────────────
  static const Color whatsapp       = Color(0xFF25D366);

  // ── Gradients ───────────────────────────────────────────────────────────
  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF080B12), Color(0xFF0D1530), Color(0xFF080B12)],
    stops: [0.0, 0.5, 1.0],
  );

  static const LinearGradient accentGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [Color(0xFF00B4FF), Color(0xFF0070D4)],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
    colors: [Color(0xFFC9A84C), Color(0xFFE4C46A), Color(0xFFC9A84C)],
  );

  static const LinearGradient cardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF141929), Color(0xFF0F1420)],
  );

  static const LinearGradient premiumCardGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1A2540), Color(0xFF0F1A2A)],
  );
}
