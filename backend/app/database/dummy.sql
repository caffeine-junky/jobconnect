-- Insert Admins
INSERT INTO admin (fullname, email, phone, hashed_password, role)
VALUES 
  ('Thabo Maseko', 'admin1@jobconnect.com', '+27810000001', 'p-w-here', 'SUPPORT_ADMIN'),
  ('Lerato Nkosi', 'admin2@jobconnect.com', '+27810000002', 'p-w-here', 'CONTENT_ADMIN'),
  ('Sipho Dlamini', 'admin3@jobconnect.com', '+27810000003', 'p-w-here', 'SUPPORT_ADMIN'),
  ('Nomsa Khumalo', 'admin4@jobconnect.com', '+27810000004', 'p-w-here', 'CONTENT_ADMIN'),
  ('Mandla Zulu', 'admin5@jobconnect.com', '+27810000005', 'p-w-here', 'SUPPORT_ADMIN'),
  ('Zanele Sithole', 'admin6@jobconnect.com', '+27810000006', 'p-w-here', 'CONTENT_ADMIN'),
  ('Kabelo Mokoena', 'admin7@jobconnect.com', '+27810000007', 'p-w-here', 'SUPPORT_ADMIN'),
  ('Refilwe Molefe', 'admin8@jobconnect.com', '+27810000008', 'p-w-here', 'CONTENT_ADMIN'),
  ('Andile Mbatha', 'admin9@jobconnect.com', '+27810000009', 'p-w-here', 'SUPPORT_ADMIN'),
  ('Boitumelo Ndlovu', 'admin10@jobconnect.com', '+27810000010', 'p-w-here', 'CONTENT_ADMIN');

-- Insert Clients
INSERT INTO client (fullname, email, phone, hashed_password, location_name, location)
VALUES
  ('Kea Motlhabane', 'client1@gmail.com', '+27820000001', 'p-w-here', 'Pretoria', ST_SetSRID(ST_MakePoint(28.2293, -25.7479), 4326)),
  ('Jabu Shongwe', 'client2@gmail.com', '+27820000002', 'p-w-here', 'Soshanguve', ST_SetSRID(ST_MakePoint(28.1136, -25.5383), 4326)),
  ('Naledi Mthembu', 'client3@gmail.com', '+27820000003', 'p-w-here', 'Pretoria', ST_SetSRID(ST_MakePoint(28.2184, -25.7475), 4326)),
  ('Simphiwe Zwane', 'client4@gmail.com', '+27820000004', 'p-w-here', 'Soshanguve', ST_SetSRID(ST_MakePoint(28.1200, -25.5300), 4326)),
  ('Lungelo Mabuza', 'client5@gmail.com', '+27820000005', 'p-w-here', 'Pretoria', ST_SetSRID(ST_MakePoint(28.1900, -25.7400), 4326)),
  ('Tumi Mokoena', 'client6@gmail.com', '+27820000006', 'p-w-here', 'Pretoria', ST_SetSRID(ST_MakePoint(28.2100, -25.7300), 4326)),
  ('Sizwe Dube', 'client7@gmail.com', '+27820000007', 'p-w-here', 'Soshanguve', ST_SetSRID(ST_MakePoint(28.1100, -25.5400), 4326)),
  ('Nokuthula Mhlongo', 'client8@gmail.com', '+27820000008', 'p-w-here', 'Pretoria', ST_SetSRID(ST_MakePoint(28.2200, -25.7500), 4326)),
  ('Karabo Ncube', 'client9@gmail.com', '+27820000009', 'p-w-here', 'Soshanguve', ST_SetSRID(ST_MakePoint(28.1150, -25.5350), 4326)),
  ('Palesa Madonsela', 'client10@gmail.com', '+27820000010', 'p-w-here', 'Pretoria', ST_SetSRID(ST_MakePoint(28.2300, -25.7450), 4326));

-- Insert Technicians (10 Soshanguve, 10 Pretoria)
DO $$
DECLARE
  i INT;
  name TEXT;
  email TEXT;
  phone TEXT;
  location GEOGRAPHY;
BEGIN
  FOR i IN 1..20 LOOP
    name := CASE 
      WHEN i <= 10 THEN 'Technician Sosha ' || i
      ELSE 'Technician PTA ' || (i - 10)
    END;
    email := 'technician' || i || '@tech.com';
    phone := '+278300000' || LPAD(i::TEXT, 2, '0');
    location := ST_SetSRID(ST_MakePoint(
      CASE WHEN i <= 10 THEN 28.1100 + random() * 0.01 ELSE 28.2100 + random() * 0.01 END,
      CASE WHEN i <= 10 THEN -25.5300 + random() * 0.01 ELSE -25.7400 + random() * 0.01 END
    ), 4326);

    INSERT INTO technician (fullname, email, phone, hashed_password, location_name, location)
    VALUES (name, email, phone, 'p-w-here', 
      CASE WHEN i <= 10 THEN 'Soshanguve' ELSE 'Pretoria' END, 
      location);
  END LOOP;
END$$;