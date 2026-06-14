CREATE TABLE organisations (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    pilot_geography text NOT NULL,
    timezone text NOT NULL DEFAULT 'Africa/Lusaka',
    currency_code text NOT NULL DEFAULT 'ZMW',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE roles (
    id uuid PRIMARY KEY,
    key text NOT NULL UNIQUE,
    name text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id uuid PRIMARY KEY,
    organisation_id uuid NOT NULL REFERENCES organisations(id),
    role_id uuid NOT NULL REFERENCES roles(id),
    full_name text NOT NULL,
    email text,
    phone text,
    password_hash text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CHECK (status IN ('active', 'inactive'))
);

CREATE TABLE reference_values (
    id uuid PRIMARY KEY,
    organisation_id uuid NOT NULL REFERENCES organisations(id),
    type text NOT NULL,
    code text NOT NULL,
    label text NOT NULL,
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organisation_id, type, code)
);

CREATE TABLE farmers (
    id uuid PRIMARY KEY,
    organisation_id uuid NOT NULL REFERENCES organisations(id),
    farmer_code text NOT NULL,
    full_name text NOT NULL,
    primary_phone text NOT NULL,
    sex text NOT NULL,
    district_area text NOT NULL,
    registration_date date NOT NULL,
    consent_status text NOT NULL,
    consent_date date,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organisation_id, farmer_code)
);

CREATE TABLE fields (
    id uuid PRIMARY KEY,
    organisation_id uuid NOT NULL REFERENCES organisations(id),
    farmer_id uuid NOT NULL REFERENCES farmers(id),
    field_code text NOT NULL,
    acreage numeric(10, 2) NOT NULL CHECK (acreage >= 0),
    latitude numeric(9, 6) NOT NULL,
    longitude numeric(9, 6) NOT NULL,
    location_label text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (organisation_id, field_code)
);

CREATE TABLE crop_cycles (
    id uuid PRIMARY KEY,
    organisation_id uuid NOT NULL REFERENCES organisations(id),
    field_id uuid NOT NULL REFERENCES fields(id),
    crop_code text NOT NULL,
    variety_code text NOT NULL,
    area_planted numeric(10, 2) NOT NULL CHECK (area_planted >= 0),
    planting_date date NOT NULL,
    expected_harvest_date date NOT NULL,
    stage text NOT NULL,
    expected_yield numeric(12, 2) NOT NULL CHECK (expected_yield >= 0),
    actual_yield numeric(12, 2) CHECK (actual_yield >= 0),
    status text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (status IN ('planned', 'planted', 'growing', 'harvest-ready', 'completed', 'failed', 'cancelled'))
);

CREATE TABLE audit_events (
    id uuid PRIMARY KEY,
    organisation_id uuid NOT NULL REFERENCES organisations(id),
    actor_user_id uuid REFERENCES users(id),
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    changed_at timestamptz NOT NULL DEFAULT now(),
    before_data jsonb,
    after_data jsonb
);

