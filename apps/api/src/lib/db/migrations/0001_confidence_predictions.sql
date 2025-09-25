-- Migration number: 0001 	 2025-09-25T10:12:28.970Z
-- Create confidence_predictions table for uncertainty quantification
CREATE TABLE IF NOT EXISTS confidence_predictions (
  -- UUIDv7 for time-ordered primary keys
  id TEXT PRIMARY KEY,

  -- Temporal data
  timestamp TEXT NOT NULL,

  -- Service identification
  service TEXT NOT NULL,

  -- Prediction data (JSON)
  prediction_data TEXT NOT NULL,

  -- Confidence scoring
  confidence REAL NOT NULL,
  method TEXT NOT NULL DEFAULT 'bootstrap',

  -- Context data for ML training (JSON)
  context_data TEXT,
  session_id TEXT,

  -- Validation data (filled later)
  actual_outcome TEXT,
  user_feedback INTEGER,
  validated_at TEXT
);

-- Indexes for efficient time-series queries
CREATE INDEX idx_service_time ON confidence_predictions(service, id);
CREATE INDEX idx_confidence ON confidence_predictions(service, confidence, id);
CREATE INDEX idx_validation ON confidence_predictions(validated_at, id);
CREATE INDEX idx_session ON confidence_predictions(session_id, id);