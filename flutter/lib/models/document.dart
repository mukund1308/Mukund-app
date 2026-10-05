class DocumentModel {
  final String id;
  final String title;
  final String status;
  final int version;

  DocumentModel({
    required this.id,
    required this.title,
    required this.status,
    required this.version,
  });

  factory DocumentModel.fromJson(Map<String, dynamic> json) {
    return DocumentModel(
      id: json['id'] ?? '',
      title: json['title'] ?? 'Untitled',
      status: json['status'] ?? 'DRAFT',
      version: int.tryParse('${json['version']}') ?? 1,
    );
  }
}
