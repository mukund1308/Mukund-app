-- Consolidated development schema for document control and quality process support.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(30) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(40) NOT NULL,
  owner_id UUID REFERENCES users(id),
  version_no INTEGER NOT NULL DEFAULT 1,
  effective_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version_no INTEGER NOT NULL,
  status VARCHAR(40) NOT NULL,
  change_reason TEXT,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY,
  entity_type VARCHAR(80) NOT NULL,
  entity_id UUID,
  action VARCHAR(80) NOT NULL,
  actor_id UUID REFERENCES users(id),
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
