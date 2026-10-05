# Mukund QMS

Mukund QMS is a development-ready quality management system scaffold for pharmaceutical and regulated workflow tracking. It includes a Node.js backend API for authentication, documents, quality events, audit trail, and dashboard statistics, plus a Flutter starter app with a responsive login and QMS dashboard.

## Features

- Secure JWT-based authentication
- Document lifecycle and revision management
- Workflow transition validation
- Quality event management (Deviation, CAPA, Change Control, Lab Incident)
- Audit trail capture
- Dashboard summary for compliance monitoring
- Flutter mobile interface starter

## Project structure

```text
backend/
  src/
  test/
  package.json
  .env.example

database/
  schema_base_dev.sql
  schema.sql
  schema_logs.sql

flutter/
  lib/
  test/
  pubspec.yaml
```

## Backend quick start

```bash
cd backend
npm install
cp .env.example .env
npm test
npm start
```

The backend exposes endpoints such as:

- `POST /api/auth/login`
- `GET /api/documents`
- `POST /api/documents/:id/transition`
- `POST /api/documents/:id/create-revision`
- `GET /api/quality-events`
- `GET /api/dashboard/summary`

## Flutter quick start

```bash
cd flutter
flutter pub get
flutter analyze
flutter test
```

## Important

- This is a development scaffold, not a GMP/GxP validated production system.
- Review all workflows, roles, and approval logic against your approved SOPs before operational use.
- Keep secrets and production credentials out of source control.

## Release status

See `VERIFICATION_STATUS_v0.15.md` for the current verification record and limitations.
