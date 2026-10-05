export const db = {
  users: [
    { id: '11111111-1111-4111-8111-111111111111', username: 'jdoe', password: 'Password123!', role: 'QA', active: true },
    { id: '22222222-2222-4222-8222-222222222222', username: 'mike', password: 'Password123!', role: 'AUTHOR', active: true },
    { id: '33333333-3333-4333-8333-333333333333', username: 'rachel', password: 'Password123!', role: 'APPROVER', active: true }
  ],
  documents: [
    {
      id: 'doc-001',
      title: 'SOP-001: Document Control',
      status: 'DRAFT',
      owner: 'mike',
      version: 1,
      versions: [
        { version: 1, status: 'DRAFT', updatedAt: '2026-01-01T00:00:00.000Z' }
      ]
    },
    {
      id: 'doc-002',
      title: 'Equipment Calibration Log',
      status: 'EFFECTIVE',
      owner: 'jdoe',
      version: 3,
      versions: [
        { version: 1, status: 'DRAFT', updatedAt: '2025-01-01T00:00:00.000Z' },
        { version: 2, status: 'EFFECTIVE', updatedAt: '2025-03-01T00:00:00.000Z' },
        { version: 3, status: 'EFFECTIVE', updatedAt: '2025-06-01T00:00:00.000Z' }
      ]
    }
  ]
};

export function seedData() {
  return db;
}
