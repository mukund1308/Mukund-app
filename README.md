# Mukund QMS

A development scaffold for a quality management system application for document control, audit trail, workflow approvals, and equipment logs.

This repository contains a backend API foundation and a Flutter app starter that can be adapted into your production project.

## Included

- Backend API in `backend/`
- Database migration examples in `database/`
- Flutter app starter in `flutter/`
- Release verification notes in `VERIFICATION_STATUS_v0.15.md`

## Quick start

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm test
npm start
```

### Flutter

```bash
cd flutter
flutter pub get
flutter analyze
flutter test
```

## Important

- This is a development scaffold, not a validated GMP/GxP production system.
- Review all roles, statuses, and workflows against your approved SOPs before use.
- Do not store production credentials in source control.

## Project structure

```text
backend/
  src/
  test/
  .env.example
  package.json

database/
  schema_base_dev.sql
  schema.sql
  schema_logs.sql

flutter/
  lib/
  test/
  pubspec.yaml
```
