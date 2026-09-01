-- ==============================================================================
-- MediFlow Clinic & Hospital Management ERP - Supabase PostgreSQL Database Setup
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CLINICS TABLE
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tagline TEXT,
    logo_url TEXT,
    address JSONB NOT NULL DEFAULT '{"line1": "", "city": "", "state": "", "pincode": ""}',
    phone TEXT NOT NULL,
    email TEXT,
    gstin TEXT,
    receipt_header TEXT,
    receipt_footer TEXT DEFAULT 'Get well soon! Follow-up valid for 7 days.',
    whatsapp_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    qualification TEXT NOT NULL,
    specialization TEXT NOT NULL,
    registration_no TEXT NOT NULL,
    consultation_fee NUMERIC(10,2) NOT NULL DEFAULT 400.00,
    followup_validity_days INT DEFAULT 7,
    room_no TEXT,
    phone TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PATIENTS TABLE (UHID Registry)
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uhid TEXT UNIQUE NOT NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('MALE', 'FEMALE', 'OTHER')),
    age INT NOT NULL,
    dob DATE,
    blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN')) DEFAULT 'UNKNOWN',
    address TEXT,
    emergency_contact JSONB DEFAULT '{"name": "", "relation": "", "phone": ""}',
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_uhid ON public.patients(uhid);

-- 4. OPD TOKENS QUEUE TABLE (Realtime Waiting Room)
CREATE TABLE IF NOT EXISTS public.tokens_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    token_number INT NOT NULL,
    token_date DATE NOT NULL DEFAULT CURRENT_DATE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    visit_type TEXT CHECK (visit_type IN ('FIRST_VISIT', 'FOLLOW_UP', 'EMERGENCY')) DEFAULT 'FIRST_VISIT',
    priority TEXT CHECK (priority IN ('NORMAL', 'SENIOR_CITIZEN', 'EMERGENCY')) DEFAULT 'NORMAL',
    status TEXT CHECK (status IN ('WAITING', 'WITH_DOCTOR', 'PHARMACY_BILLING', 'COMPLETED', 'CANCELLED')) DEFAULT 'WAITING',
    created_at TIMESTAMPTZ DEFAULT now(),
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tokens_date ON public.tokens_queue(token_date);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON public.tokens_queue(status);

-- 5. VITALS TABLE
CREATE TABLE IF NOT EXISTS public.vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    token_id UUID REFERENCES public.tokens_queue(id) ON DELETE CASCADE,
    bp_systolic INT,
    bp_diastolic INT,
    pulse_bpm INT,
    spo2_percent INT,
    temp_f NUMERIC(4,1),
    weight_kg NUMERIC(5,2),
    height_cm NUMERIC(5,2),
    bmi NUMERIC(4,1),
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 6. PRESCRIPTIONS (E-Prescriptions / Rx)
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    token_id UUID REFERENCES public.tokens_queue(id) ON DELETE SET NULL,
    chief_complaints JSONB DEFAULT '[]'::JSONB,
    diagnosis TEXT[] DEFAULT ARRAY[]::TEXT[],
    clinical_notes TEXT,
    medicines JSONB DEFAULT '[]'::JSONB,
    lab_tests_recommended TEXT[] DEFAULT ARRAY[]::TEXT[],
    dietary_advice TEXT,
    followup_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. PHARMACY ITEMS & BATCHES TABLE
CREATE TABLE IF NOT EXISTS public.pharmacy_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    category TEXT,
    form TEXT CHECK (form IN ('TABLET', 'SYRUP', 'CAPSULE', 'INJECTION', 'DROPS', 'OINTMENT', 'CONSUMABLE')) DEFAULT 'TABLET',
    strength TEXT,
    reorder_level INT DEFAULT 20,
    total_stock INT DEFAULT 0,
    unit TEXT DEFAULT 'Strip',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pharmacy_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES public.pharmacy_items(id) ON DELETE CASCADE,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    purchase_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    mrp NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    stock_qty INT NOT NULL DEFAULT 0,
    rack_location TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_batches_expiry ON public.pharmacy_batches(expiry_date);

-- 8. SERVICES & PROCEDURES MASTER
CREATE TABLE IF NOT EXISTS public.services_procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT CHECK (category IN ('PROCEDURE', 'NURSING', 'DIAGNOSTIC', 'DAYCARE')) DEFAULT 'PROCEDURE',
    rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    doctor_share_percent NUMERIC(5,2) DEFAULT 0.00
);

-- 9. INVOICES & BILLING TABLE
CREATE TABLE IF NOT EXISTS public.invoices_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    invoice_number TEXT UNIQUE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    token_id UUID REFERENCES public.tokens_queue(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
    line_items JSONB NOT NULL DEFAULT '[]'::JSONB,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_mode TEXT CHECK (payment_mode IN ('CASH', 'UPI', 'CARD', 'CREDIT_KHATA', 'SPLIT')) DEFAULT 'UPI',
    split_details JSONB DEFAULT '{"cash": 0, "upi": 0, "card": 0}',
    payment_status TEXT CHECK (payment_status IN ('PAID', 'PARTIALLY_PAID', 'UNPAID')) DEFAULT 'PAID',
    paid_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cashier_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_created ON public.invoices_billing(created_at);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME FOR WAITING QUEUE & BILLING
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices_billing;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pharmacy_batches;

-- ==============================================================================
-- SAMPLE SEED DATA (For Instant Testing)
-- ==============================================================================

-- 1. Seed Clinic
INSERT INTO public.clinics (id, name, tagline, address, phone, email, receipt_header)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Apex Specialty Clinic & Daycare',
    'Modern Multi-Specialty & Family Health Care',
    '{"line1": "Plot 14, Ring Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}',
    '+91 98201 12345',
    'contact@apexclinic.com',
    'APEX SPECIALTY CLINIC & DAYCARE CENTRE'
) ON CONFLICT DO NOTHING;

-- 2. Seed Doctor
INSERT INTO public.doctors (id, clinic_id, name, qualification, specialization, registration_no, consultation_fee, room_no, phone)
VALUES (
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Dr. Ananya Sharma',
    'MBBS, MD (Internal Medicine)',
    'General Physician',
    'MCI-2018-88902',
    400.00,
    'Cabin #1',
    '+91 98201 54321'
) ON CONFLICT DO NOTHING;

-- 3. Seed Procedures
INSERT INTO public.services_procedures (clinic_id, code, name, category, rate)
VALUES 
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PR-ECG', '12-Lead ECG with Doctor Interpretation', 'DIAGNOSTIC', 350.00),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PR-NEB', 'Nebulization Treatment Session', 'PROCEDURE', 150.00),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PR-DRS', 'Sterile Wound Dressing (Small/Medium)', 'NURSING', 200.00),
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'PR-INJ', 'Intramuscular / IV Injection Administration', 'NURSING', 80.00)
ON CONFLICT DO NOTHING;
