# AMC Agency App 🚀

**Partner Tecnológico de Élite · App Móvil Flutter**

App móvil premium para AMC Agency, construida con Flutter. Diseño dark mode corporativo, arquitectura feature-based limpia y lista para publicar en Google Play Store.

---

## 📱 Pantallas Implementadas

| Pantalla | Descripción |
|---|---|
| **Splash** | Animación del logo AMC con fondo de cuadrícula |
| **Onboarding** | 3 slides con PageView y indicador de página |
| **Home** | Hero animado, stats, preview de servicios, portafolio |
| **Servicios** | 4 servicios con cards premium y detalle completo |
| **Portafolio** | 5 casos de éxito con cards coloridas y vista detalle |
| **Planes** | 3 planes con toggle selector y comparativa visual |
| **Sobre AMC** | Filosofía, diferenciales en grid, proceso de 4 pasos |
| **Contacto** | Formulario validado con envío mock + vista de éxito |
| **FAQ** | Acordeón expandible con 8 preguntas frecuentes |
| **Perfil** | Panel "Próximamente" con estructura para login futuro |

---

## 🛠️ Stack Tecnológico

- **Framework**: Flutter 3.x
- **Navegación**: GoRouter 13.x (Shell Route + rutas con transiciones)
- **Animaciones**: flutter_animate 4.x
- **Tipografía**: Space Grotesk (headings) + Inter (body) via google_fonts
- **Contacto externo**: url_launcher (WhatsApp)
- **Persistencia**: shared_preferences (flag de onboarding)
- **Backend**: Mock listo para conectar Supabase (ver `lead_service.dart`)

---

## 🚀 Cómo correr el proyecto

### Requisitos previos
- [Flutter SDK](https://docs.flutter.dev/get-started/install) 3.0+
- [Android Studio](https://developer.android.com/studio) con Android SDK
- JDK 17+ (`JAVA_HOME` configurado)
- Dispositivo Android o emulador

### Pasos

```bash
# 1. Instalar dependencias
flutter pub get

# 2. Correr en modo debug (requiere emulador o dispositivo)
flutter run

# 3. Correr en web (para preview rápido sin Android)
flutter run -d chrome

# 4. Build APK debug
flutter build apk --debug

# 5. Build APK release (para distribución)
flutter build apk --release
# → APK en: build/app/outputs/flutter-apk/app-release.apk
```

---

## 📁 Estructura del Proyecto

```
lib/
├── main.dart                          ← Entry point
├── core/
│   ├── theme/
│   │   ├── app_colors.dart           ← Paleta de colores de marca
│   │   ├── app_theme.dart            ← ThemeData completo (Dark Mode)
│   │   └── app_spacing.dart          ← Sistema de espaciado
│   ├── models/models.dart            ← Modelos de datos tipados
│   ├── data/mock_data.dart           ← Datos de la marca (reemplazar por API)
│   ├── navigation/
│   │   ├── app_router.dart           ← GoRouter con todas las rutas
│   │   └── main_scaffold.dart        ← Shell con bottom nav + WhatsApp FAB
│   ├── services/
│   │   ├── whatsapp_service.dart     ← Integración WhatsApp por url_launcher
│   │   └── lead_service.dart         ← Mock de formulario (listo para Supabase)
│   └── widgets/shared_widgets.dart   ← Componentes reutilizables
└── features/
    ├── splash/splash_screen.dart
    ├── onboarding/onboarding_screen.dart
    ├── home/home_screen.dart
    ├── services/
    │   ├── services_screen.dart
    │   └── service_detail_screen.dart
    ├── portfolio/
    │   ├── portfolio_screen.dart
    │   └── project_detail_screen.dart
    ├── plans/plans_screen.dart
    ├── about/about_screen.dart
    ├── contact/contact_screen.dart
    ├── faq/faq_screen.dart
    └── profile/profile_screen.dart
```

---

## 🎨 Sistema de Diseño

### Colores de Marca
| Token | Hex | Uso |
|---|---|---|
| `background` | `#080B12` | Fondo principal (negro espacial) |
| `surface` | `#0F1420` | Superficies y cards |
| `accent` | `#00B4FF` | Azul eléctrico (color primario) |
| `gold` | `#C9A84C` | Dorado (acento premium) |
| `textPrimary` | `#F0F4FF` | Texto blanco frío |
| `textSecondary` | `#8A95B4` | Texto secundario azul-gris |

### Tipografía
- **Headings**: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — Bold/ExtraBold
- **Body/UI**: [Inter](https://fonts.google.com/specimen/Inter) — Regular/Medium/SemiBold

---

## 🔗 Conectar Backend (Supabase)

El formulario de cotización usa un mock que se puede conectar a Supabase en 3 pasos:

1. Agregar `supabase_flutter` al `pubspec.yaml`
2. Inicializar en `main.dart`:
   ```dart
   await Supabase.initialize(url: 'TU_URL', anonKey: 'TU_ANON_KEY');
   ```
3. Descomentar `_submitSupabase()` en `lib/core/services/lead_service.dart` y comentar `_submitMock()`

---

## 📲 WhatsApp

- **Número**: +57 313 853 7261
- **FAB persistente** en todas las pantallas del shell
- Mensajes contextuales por servicio y por plan
- Configurable desde `lib/core/data/mock_data.dart` → `whatsappNumber`

---

## 🏪 Play Store — Checklist de Publicación

Antes de publicar en Google Play:

- [ ] Generar keystore de firma: `keytool -genkey -v -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`
- [ ] Configurar `key.properties` en `/android/`
- [ ] Actualizar `android/app/build.gradle` con la configuración de firma
- [ ] Cambiar `versionCode` y `versionName` en `pubspec.yaml`
- [ ] Reemplazar ícono de la app en `android/app/src/main/res/`
- [ ] Crear splash screen nativo (`flutter_native_splash`)
- [ ] Build release: `flutter build appbundle` (preferido para Play Store)
- [ ] Configurar [Google Play Console](https://play.google.com/console/)
- [ ] Completar ficha de la tienda: descripción, capturas, ícono, política de privacidad

---

## 📈 Futuras Funcionalidades (V2)

- [ ] Autenticación con Supabase (login, registro)
- [ ] Panel de cliente: estado del proyecto, facturas, mensajes
- [ ] Notificaciones push (Firebase Cloud Messaging)
- [ ] Analytics (Firebase Analytics / Mixpanel)
- [ ] Internacionalización (i18n) multi-idioma
- [ ] Modo claro opcional

---

*AMC Agency · Arquitectura digital de élite para marcas globales.*
