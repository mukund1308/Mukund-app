-- Base development schema for a QMS app.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(30) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  status VARCHAR(40) NOT NULL,
  owner_id UUID REFERENCES users(id),
  version_no INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY,
  document_id UUID REFERENCES documents(id),
  version_no INTEGER NOT NULL,
  status VARCHAR(40) NOT NULL,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
