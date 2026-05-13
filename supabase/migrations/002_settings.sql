-- Site-wide settings (single row, id=1)
CREATE TABLE site_settings (
  id              INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp_number TEXT NOT NULL DEFAULT '',
  phone_number    TEXT,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Insert default row
INSERT INTO site_settings (id, whatsapp_number) VALUES (1, '');

-- Auto-update updated_at trigger
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
