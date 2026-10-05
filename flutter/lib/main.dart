import 'package:flutter/material.dart';
import 'package:mukund_qms/services/api_service.dart';

void main() {
  runApp(const MukundQmsApp());
}

class MukundQmsApp extends StatelessWidget {
  const MukundQmsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mukund QMS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService apiService = ApiService();
  List<Map<String, dynamic>> documents = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadDocuments();
  }

  Future<void> _loadDocuments() async {
    try {
      final result = await apiService.fetchDocuments();
      setState(() {
        documents = result;
        loading = false;
      });
    } catch (_) {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mukund QMS'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : documents.isEmpty
              ? const Center(child: Text('No documents found'))
              : ListView.builder(
                  itemCount: documents.length,
                  itemBuilder: (context, index) {
                    final item = documents[index];
                    return ListTile(
                      title: Text(item['title'] ?? 'Untitled'),
                      subtitle: Text('Status: ${item['status'] ?? 'Unknown'}'),
                      trailing: Text('v${item['version'] ?? 1}'),
                    );
                  },
                ),
    );
  }
}
