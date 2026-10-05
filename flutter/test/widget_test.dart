import 'package:flutter_test/flutter_test.dart';
import 'package:mukund_qms/main.dart';

void main() {
  testWidgets('app loads home screen', (tester) async {
    await tester.pumpWidget(const MukundQmsApp());
    expect(find.text('Mukund QMS'), findsOneWidget);
  });
}
