CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE IF NOT EXISTS admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NULL CHECK (role IN ('SUPER_ADMIN', 'SUPPORT_ADMIN', 'CONTENT_ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS technician (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL,
    technician_id UUID NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('REQUESTED', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (client_id) REFERENCES client (id),
    FOREIGN KEY (technician_id) REFERENCES technician (id)
);

CREATE TABLE IF NOT EXISTS review (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    technician_id UUID NOT NULL,
    client_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (technician_id) REFERENCES technician (id),
    FOREIGN KEY (client_id) REFERENCES client (id)
);

CREATE TABLE IF NOT EXISTS service (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS notification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID,
    technician_id UUID,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    -- Foreign key constraints are typically defined separately or using simpler inline syntax
    FOREIGN KEY (client_id) REFERENCES client (id),
    FOREIGN KEY (technician_id) REFERENCES technician (id)
);


CREATE TABLE IF NOT EXISTS favorite_technician (
    client_id UUID NOT NULL,
    technician_id UUID NOT NULL,
    PRIMARY KEY (client_id, technician_id),
    FOREIGN KEY (client_id) REFERENCES client (id),
    FOREIGN KEY (technician_id) REFERENCES technician (id)
);

CREATE TABLE IF NOT EXISTS technician_service (
    service_id UUID NOT NULL,
    technician_id UUID NOT NULL,
    experience_years SMALLINT NOT NULL DEFAULT 0,
    price NUMERIC NOT NULL DEFAULT 1.0,
    PRIMARY KEY (service_id, technician_id),
    FOREIGN KEY (service_id) REFERENCES service (id),
    FOREIGN KEY (technician_id) REFERENCES technician (id)
);

CREATE TABLE IF NOT EXISTS verified_technician (
    technician_id UUID NOT NULL,
    admin_id UUID NOT NULL, -- Admin who verified the technician
    PRIMARY KEY (technician_id, admin_id),
    FOREIGN KEY (technician_id) REFERENCES technician (id),
    FOREIGN KEY (admin_id) REFERENCES admin (id)
);

CREATE TABLE IF NOT EXISTS technician_availability (
    technician_id UUID NOT NULL,
    day SMALLINT NOT NULL CHECK (day >= 0 AND day <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    active boolean NOT NULL DEFAULT TRUE,
    PRIMARY KEY (technician_id, day),
    FOREIGN KEY (technician_id) REFERENCES technician (id)
);

-- Indexes
-- 1. Add `search_vector` column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'service'
          AND column_name = 'search_vector'
    ) THEN
        ALTER TABLE service ADD COLUMN search_vector tsvector;
    END IF;
END$$;

-- 2. Populate `search_vector` with initial data
UPDATE service
SET search_vector = to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''));

-- 3. Create a GIN index on `search_vector` if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'service'
          AND indexname = 'idx_service_search_vector'
    ) THEN
        CREATE INDEX idx_service_search_vector ON service USING GIN (search_vector);
    END IF;
END$$;

-- 4. Create the trigger function to update `search_vector`
CREATE OR REPLACE FUNCTION update_service_search_vector() RETURNS trigger AS $$
BEGIN
    NEW.search_vector :=
        to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- 5. Create the trigger itself (will replace if it already exists)
DROP TRIGGER IF EXISTS trg_update_service_search_vector ON service;

CREATE TRIGGER trg_update_service_search_vector
BEFORE INSERT OR UPDATE ON service
FOR EACH ROW
EXECUTE FUNCTION update_service_search_vector();
