import 'package:flutter/material.dart';
import 'package:mukund_qms/main.dart';

void main() {
  testWidgets('login screen loads with app title', (tester) async {
    await tester.pumpWidget(const MukundQmsApp());
    expect(find.text('Mukund QMS'), findsWidgets);
    expect(find.text('Login'), findsOneWidget);
  });
}
