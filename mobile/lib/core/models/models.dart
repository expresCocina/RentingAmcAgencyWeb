// AMC Agency Models

/// Service model (Servicios)
class ServiceModel {
  final String id;
  final String title;
  final String subtitle;
  final String description;
  final String icon;
  final List<String> features;
  final String tag;

  const ServiceModel({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.icon,
    required this.features,
    required this.tag,
  });
}

/// Portfolio project model
class ProjectModel {
  final String id;
  final String title;
  final String category;
  final String description;
  final String longDescription;
  final List<String> technologies;
  final String result;
  final String colorHex;
  final String? liveUrl; // URL del sitio en vivo para WebView

  const ProjectModel({
    required this.id,
    required this.title,
    required this.category,
    required this.description,
    required this.longDescription,
    required this.technologies,
    required this.result,
    required this.colorHex,
    this.liveUrl,
  });
}

/// Plan model (Inversión)
class PlanModel {
  final String id;
  final String name;
  final String price;
  final String priceNote;
  final String tagline;
  final List<String> features;
  final bool isPopular;
  final bool includesPrevious;

  const PlanModel({
    required this.id,
    required this.name,
    required this.price,
    required this.priceNote,
    required this.tagline,
    required this.features,
    this.isPopular = false,
    this.includesPrevious = false,
  });
}

/// FAQ model
class FaqModel {
  final String question;
  final String answer;

  const FaqModel({required this.question, required this.answer});
}

/// Lead / quote request model
class LeadModel {
  final String name;
  final String email;
  final String phone;
  final String service;
  final String message;

  const LeadModel({
    required this.name,
    required this.email,
    required this.phone,
    required this.service,
    required this.message,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'phone': phone,
    'service': service,
    'message': message,
    'source': 'app_mobile',
    'status': 'new',
  };
}
