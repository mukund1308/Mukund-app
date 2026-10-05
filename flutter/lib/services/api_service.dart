import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl;

  ApiService({this.baseUrl = 'http://10.0.2.2:3000'});

  Future<List<Map<String, dynamic>>> fetchDocuments() async {
    final uri = Uri.parse('$baseUrl/api/documents');
    final response = await http.get(uri, headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer demo-token'
    });

    if (response.statusCode != 200) {
      throw Exception('Failed to load documents');
    }

    final decoded = jsonDecode(response.body);
    if (decoded is List) {
      return decoded.cast<Map<String, dynamic>>();
    }
    return <Map<String, dynamic>>[];
  }
}
