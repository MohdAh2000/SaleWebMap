-- تفعيل PostGIS extension (إذا كان متاحاً)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create properties table
CREATE TABLE properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner TEXT NOT NULL,
    phone TEXT NOT NULL,
    normalized_phone TEXT,
    price DECIMAL(10,2) NOT NULL,
    area DECIMAL(8,2),
    type TEXT CHECK (type IN ('ارض','منزل', 'حاصل')) DEFAULT 'منزل',
    region TEXT NOT NULL,
    location TEXT,
    photo_url TEXT NOT NULL,
    lat DECIMAL(10,8) NOT NULL,
    lng DECIMAL(11,8) NOT NULL,
    dedupe_key TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_hidden BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX idx_properties_region ON properties(region);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_created_at ON properties(created_at);

-- Create spatial index if PostGIS is available
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
        EXECUTE 'CREATE INDEX idx_properties_location ON properties USING GIST (ST_SetSRID(ST_MakePoint(lng, lat), 4326))';
    ELSE
        -- Fallback index without PostGIS
        CREATE INDEX idx_properties_coordinates ON properties(lat, lng);
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON properties
    FOR SELECT USING (is_hidden = FALSE);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to normalize phone numbers
CREATE OR REPLACE FUNCTION normalize_phone(phone_input TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN regexp_replace(regexp_replace(phone_input, '\D+', '', 'g'), '^0+', '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to build dedupe key
CREATE OR REPLACE FUNCTION build_dedupe_key(phone_input TEXT, owner_input TEXT)
RETURNS TEXT AS $$
BEGIN
    IF phone_input IS NULL AND owner_input IS NULL THEN
        RETURN NULL;
    END IF;
    
    RETURN 'ph:' || COALESCE(normalize_phone(phone_input), '') || '|own:' || 
           COALESCE(lower(trim(regexp_replace(owner_input, '\s+', ' ', 'g'))), '');
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set dedupe_key and normalized_phone
CREATE OR REPLACE FUNCTION set_property_metadata()
RETURNS TRIGGER AS $$
BEGIN
    NEW.normalized_phone = normalize_phone(NEW.phone);
    NEW.dedupe_key = build_dedupe_key(NEW.phone, NEW.owner);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_property_metadata
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION set_property_metadata();
