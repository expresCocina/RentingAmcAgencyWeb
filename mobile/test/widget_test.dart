import 'package:flutter_test/flutter_test.dart';
import 'package:amc_agency_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const AmcAgencyApp());
    expect(find.byType(AmcAgencyApp), findsOneWidget);
  });
}
