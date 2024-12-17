-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.matching_results;
DROP TABLE IF EXISTS public.donors;
DROP TABLE IF EXISTS public.recipients;
DROP TABLE IF EXISTS public.employees;

-- Create employees table
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Administrator')),
    employee_code VARCHAR(20) NOT NULL UNIQUE
);

-- Create donors table
CREATE TABLE public.donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mrn VARCHAR(50) NOT NULL UNIQUE,
    national_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18),
    blood_type VARCHAR(3) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    hla_typing JSONB NOT NULL,
    high_res_typing TEXT,
    donor_antibodies TEXT,
    antigen_mismatch INTEGER,
    crossmatch_result VARCHAR(20) NOT NULL,
    serum_creatinine DECIMAL(4,2) NOT NULL,
    egfr INTEGER NOT NULL,
    blood_pressure VARCHAR(20) NOT NULL,
    viral_screening TEXT NOT NULL,
    cmv_status VARCHAR(20) NOT NULL,
    medical_conditions TEXT,
    notes TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Utilized'))
);

-- Create recipients table
CREATE TABLE public.recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    mrn VARCHAR(50) NOT NULL UNIQUE,
    national_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    blood_type VARCHAR(3) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    hla_typing JSONB NOT NULL,
    unacceptable_antigens TEXT,
    pra INTEGER NOT NULL CHECK (pra >= 0 AND pra <= 100),
    crossmatch_requirement VARCHAR(20) NOT NULL,
    donor_antibodies TEXT,
    serum_creatinine DECIMAL(4,2) NOT NULL,
    egfr INTEGER NOT NULL,
    blood_pressure VARCHAR(20) NOT NULL,
    viral_screening TEXT NOT NULL,
    cmv_status VARCHAR(20) NOT NULL,
    medical_history TEXT,
    notes TEXT
);

-- Create matching_results table
CREATE TABLE public.matching_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    recipient_id UUID NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    compatibility_score DECIMAL(5,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
    match_details JSONB NOT NULL,
    exclusion_reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected'))
);

-- Create indexes
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_code ON employees(employee_code);
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_status ON donors(status);
CREATE INDEX idx_recipients_blood_type ON recipients(blood_type);
CREATE INDEX idx_matching_recipient ON matching_results(recipient_id);
CREATE INDEX idx_matching_donor ON matching_results(donor_id);
CREATE INDEX idx_matching_score ON matching_results(compatibility_score);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE matching_results ENABLE ROW LEVEL SECURITY;

-- Create policies for employees
CREATE POLICY "Allow administrators full access to employees"
ON public.employees
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = auth.uid() 
    AND e.role = 'Administrator'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM employees e 
    WHERE e.id = auth.uid() 
    AND e.role = 'Administrator'
  )
);

CREATE POLICY "Allow all employees to view their own record"
ON public.employees
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Create policies for donors
CREATE POLICY "Allow all authenticated users to view donors"
ON public.donors
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all authenticated users to insert donors"
ON public.donors
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update donors"
ON public.donors
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to delete donors"
ON public.donors
FOR DELETE
TO authenticated
USING (true);

-- Create policies for recipients
CREATE POLICY "Allow all authenticated users to view recipients"
ON public.recipients
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all authenticated users to insert recipients"
ON public.recipients
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update recipients"
ON public.recipients
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to delete recipients"
ON public.recipients
FOR DELETE
TO authenticated
USING (true);

-- Create policies for matching_results
CREATE POLICY "Allow all authenticated users to view matching results"
ON public.matching_results
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow all authenticated users to insert matching results"
ON public.matching_results
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update matching results"
ON public.matching_results
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to delete matching results"
ON public.matching_results
FOR DELETE
TO authenticated
USING (true);