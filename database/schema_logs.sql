-- Equipment and fumigation log tables for development and validation review.
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY,
  asset_tag VARCHAR(80) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(40) NOT NULL,
  calibration_due_at TIMESTAMPTZ,
  last_calibrated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS equipment_calibration (
  id UUID PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  recorded_by UUID,
  verified_by UUID,
  result VARCHAR(30) NOT NULL,
  remarks TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fumigation_records (
  id UUID PRIMARY KEY,
  equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
  recorded_by UUID,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  outcome VARCHAR(30) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
