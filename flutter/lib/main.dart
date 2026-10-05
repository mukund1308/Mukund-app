import 'package:flutter/material.dart';
import 'package:mukund_qms/services/api_service.dart';

void main() {
  runApp(const MukundQmsApp());
}

class MukundQmsApp extends StatefulWidget {
  const MukundQmsApp({super.key});

  @override
  State<MukundQmsApp> createState() => _MukundQmsAppState();
}

class _MukundQmsAppState extends State<MukundQmsApp> {
  String? authToken;
  String? username;
  String? role;

  void setSession(String token, String userName, String userRole) {
    setState(() {
      authToken = token;
      username = userName;
      role = userRole;
    });
  }

  void clearSession() {
    setState(() {
      authToken = null;
      username = null;
      role = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mukund QMS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: authToken == null
          ? LoginScreen(onLogin: setSession)
          : HomeShell(
              token: authToken!,
              username: username ?? 'user',
              role: role ?? 'USER',
              onLogout: clearSession,
            ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  final void Function(String token, String username, String role) onLogin;

  const LoginScreen({super.key, required this.onLogin});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final usernameController = TextEditingController(text: 'admin');
  final passwordController = TextEditingController(text: 'Admin@1234');
  bool _loading = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _loading = true);
    try {
      final api = ApiService();
      final result = await api.login(usernameController.text.trim(), passwordController.text);
      widget.onLogin(
        result['token'] as String,
        result['user']['username'] as String,
        result['user']['role'] as String,
      );
    } catch (_) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login failed. Check credentials and backend status.')),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 420),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const Text(
                        'Mukund QMS',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Login',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 18),
                      ),
                      const SizedBox(height: 24),
                      TextFormField(
                        controller: usernameController,
                        decoration: const InputDecoration(labelText: 'Username'),
                        validator: (value) => value == null || value.trim().isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: passwordController,
                        decoration: const InputDecoration(labelText: 'Password'),
                        obscureText: true,
                        validator: (value) => value == null || value.isEmpty ? 'Required' : null,
                      ),
                      const SizedBox(height: 20),
                      FilledButton.icon(
                        onPressed: _loading ? null : _submit,
                        icon: const Icon(Icons.login),
                        label: Text(_loading ? 'Signing in...' : 'Login'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class HomeShell extends StatefulWidget {
  final String token;
  final String username;
  final String role;
  final VoidCallback onLogout;

  const HomeShell({
    super.key,
    required this.token,
    required this.username,
    required this.role,
    required this.onLogout,
  });

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      DashboardTab(token: widget.token),
      DocumentsTab(token: widget.token),
      QualityEventsTab(token: widget.token),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mukund QMS'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Center(
              child: Text(widget.username, style: const TextStyle(fontWeight: FontWeight.w600)),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: widget.onLogout,
          ),
        ],
      ),
      body: pages[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.article_outlined), label: 'Documents'),
          NavigationDestination(icon: Icon(Icons.warning_amber_outlined), label: 'Quality'),
        ],
      ),
    );
  }
}

class DashboardTab extends StatefulWidget {
  final String token;

  const DashboardTab({super.key, required this.token});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> {
  bool _loading = true;
  DashboardSummaryModel? summary;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final api = ApiService();
      final result = await api.fetchDashboard(widget.token);
      setState(() => summary = result);
    } catch (_) {
      setState(() => summary = DashboardSummaryModel(
        documents: 0,
        openQualityEvents: 0,
        overdueTraining: 0,
        overdueCalibration: 0,
        activeUsers: 0,
      ));
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    final summaryData = summary ?? DashboardSummaryModel(
      documents: 0,
      openQualityEvents: 0,
      overdueTraining: 0,
      overdueCalibration: 0,
      activeUsers: 0,
    );

    final cards = [
      _MetricCard(title: 'Documents', value: '${summaryData.documents}'),
      _MetricCard(title: 'Open Quality Events', value: '${summaryData.openQualityEvents}'),
      _MetricCard(title: 'Overdue Training', value: '${summaryData.overdueTraining}'),
      _MetricCard(title: 'Overdue Calibration', value: '${summaryData.overdueCalibration}'),
      _MetricCard(title: 'Active Users', value: '${summaryData.activeUsers}'),
    ];

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.6,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: cards,
          )
        ],
      ),
    );
  }
}

class DocumentsTab extends StatefulWidget {
  final String token;

  const DocumentsTab({super.key, required this.token});

  @override
  State<DocumentsTab> createState() => _DocumentsTabState();
}

class _DocumentsTabState extends State<DocumentsTab> {
  List<DocumentModel> documents = const [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final api = ApiService();
      final result = await api.fetchDocuments(widget.token);
      setState(() => documents = result);
    } catch (_) {
      setState(() => documents = const []);
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (documents.isEmpty) {
      return const Center(child: Text('No documents found'));
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        itemCount: documents.length,
        itemBuilder: (context, index) {
          final doc = documents[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: ListTile(
              title: Text(doc.title),
              subtitle: Text('Status: ${doc.status} • Version ${doc.version}'),
              trailing: const Icon(Icons.chevron_right),
            ),
          );
        },
      ),
    );
  }
}

class QualityEventsTab extends StatefulWidget {
  final String token;

  const QualityEventsTab({super.key, required this.token});

  @override
  State<QualityEventsTab> createState() => _QualityEventsTabState();
}

class _QualityEventsTabState extends State<QualityEventsTab> {
  List<QualityEventModel> events = const [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => loading = true);
    try {
      final api = ApiService();
      final result = await api.fetchQualityEvents(widget.token);
      setState(() => events = result);
    } catch (_) {
      setState(() => events = const []);
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (events.isEmpty) {
      return const Center(child: Text('No quality events found'));
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.builder(
        itemCount: events.length,
        itemBuilder: (context, index) {
          final event = events[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: ListTile(
              title: Text(event.title),
              subtitle: Text('${event.type} • ${event.status}'),
              trailing: const Icon(Icons.arrow_forward_ios),
            ),
          );
        },
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;

  const _MetricCard({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
            const Spacer(),
            Text(value, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }
}
