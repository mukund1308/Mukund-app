import 'dart:convert';
import 'package:http/http.dart' as http;

class UserModel {
  final String id;
  final String username;
  final String fullName;
  final String role;

  UserModel({
    required this.id,
    required this.username,
    required this.fullName,
    required this.role,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      fullName: json['fullName'] ?? json['name'] ?? '',
      role: json['role'] ?? 'USER',
    );
  }
}

class DocumentModel {
  final String id;
  final String title;
  final String status;
  final String ownerId;
  final int version;

  DocumentModel({
    required this.id,
    required this.title,
    required this.status,
    required this.ownerId,
    required this.version,
  });

  factory DocumentModel.fromJson(Map<String, dynamic> json) {
    return DocumentModel(
      id: json['id'] ?? '',
      title: json['title'] ?? 'Untitled document',
      status: json['status'] ?? 'DRAFT',
      ownerId: json['ownerId'] ?? '',
      version: json['version'] is int ? json['version'] : int.tryParse('${json['version']}') ?? 1,
    );
  }
}

class QualityEventModel {
  final String id;
  final String type;
  final String title;
  final String description;
  final String status;

  QualityEventModel({
    required this.id,
    required this.type,
    required this.title,
    required this.description,
    required this.status,
  });

  factory QualityEventModel.fromJson(Map<String, dynamic> json) {
    return QualityEventModel(
      id: json['id'] ?? '',
      type: json['type'] ?? 'DEVIATION',
      title: json['title'] ?? 'Untitled event',
      description: json['description'] ?? '',
      status: json['status'] ?? 'OPEN',
    );
  }
}

class DashboardSummaryModel {
  final int documents;
  final int openQualityEvents;
  final int overdueTraining;
  final int overdueCalibration;
  final int activeUsers;

  DashboardSummaryModel({
    required this.documents,
    required this.openQualityEvents,
    required this.overdueTraining,
    required this.overdueCalibration,
    required this.activeUsers,
  });

  factory DashboardSummaryModel.fromJson(Map<String, dynamic> json) {
    return DashboardSummaryModel(
      documents: json['documents'] ?? 0,
      openQualityEvents: json['openQualityEvents'] ?? 0,
      overdueTraining: json['overdueTraining'] ?? 0,
      overdueCalibration: json['overdueCalibration'] ?? 0,
      activeUsers: json['activeUsers'] ?? 0,
    );
  }
}

class ApiService {
  final String baseUrl;

  ApiService({this.baseUrl = 'http://10.0.2.2:3000'});

  Map<String, String> _authHeaders(String? token) => {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  Future<Map<String, dynamic>> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode != 200) {
      throw Exception('Login failed');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<List<DocumentModel>> fetchDocuments(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/documents'),
      headers: _authHeaders(token),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch documents');
    }

    final body = jsonDecode(response.body) as List;
    return body.map((item) => DocumentModel.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<List<QualityEventModel>> fetchQualityEvents(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/quality-events'),
      headers: _authHeaders(token),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch quality events');
    }

    final body = jsonDecode(response.body) as List;
    return body.map((item) => QualityEventModel.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<DashboardSummaryModel> fetchDashboard(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/dashboard/summary'),
      headers: _authHeaders(token),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch dashboard');
    }

    return DashboardSummaryModel.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
}
