-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contacts table
CREATE TABLE contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT,
  source TEXT DEFAULT 'Unknown',
  stage TEXT DEFAULT 'New Lead' CHECK (stage IN ('New Lead','Contacted','Negotiating','Won','Lost')),
  value NUMERIC DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes / activity log
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'Note' CHECK (type IN ('Note','Call','Message','Meeting')),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks / follow-ups
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date DATE,
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook log (for debugging)
CREATE TABLE webhook_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source TEXT,
  raw_payload JSONB,
  extracted_data JSONB,
  status TEXT DEFAULT 'received',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on contacts
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON contacts FOR ALL USING (true);
CREATE POLICY "Allow all" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all" ON webhook_events FOR ALL USING (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
