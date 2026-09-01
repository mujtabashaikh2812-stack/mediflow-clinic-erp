// Preloaded Starter Formulary, Clinical Procedures & Medical Presets for MediFlow

export const DEFAULT_CLINIC = {
  id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  name: 'Apex Specialty Clinic & Daycare',
  tagline: 'Modern Multi-Specialty & Family Health Care',
  address: {
    line1: 'Plot 14, Central Medical Arcade',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  },
  phone: '+91 98201 12345',
  email: 'contact@apexclinic.com',
  gstin: '27AABCA1234F1Z9',
  receipt_header: 'APEX SPECIALTY CLINIC & DAYCARE CENTRE',
  receipt_footer: 'Get well soon! Follow-up consultation is valid for 7 days.'
};

export const DEFAULT_DOCTORS = [
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    name: 'Dr. Ananya Sharma',
    qualification: 'MBBS, MD (Internal Medicine)',
    specialization: 'General Physician & Diabetologist',
    registration_no: 'MCI-2018-88902',
    consultation_fee: 400.00,
    followup_validity_days: 7,
    room_no: 'Cabin #1',
    phone: '+91 98201 54321',
    is_active: true
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    name: 'Dr. Rajesh Deshmukh',
    qualification: 'MBBS, MS (General Surgery)',
    specialization: 'Surgeon & Wound Care Specialist',
    registration_no: 'MCI-2014-45210',
    consultation_fee: 500.00,
    followup_validity_days: 5,
    room_no: 'Cabin #2',
    phone: '+91 98201 98765',
    is_active: true
  }
];

export const STARTER_PROCEDURES = [
  { id: 'p1', code: 'PR-ECG', name: '12-Lead Electrocardiogram (ECG)', category: 'DIAGNOSTIC', rate: 350.00 },
  { id: 'p2', code: 'PR-NEB', name: 'Nebulization Treatment Session', category: 'PROCEDURE', rate: 150.00 },
  { id: 'p3', code: 'PR-DRS-S', name: 'Sterile Wound Dressing (Small)', category: 'NURSING', rate: 150.00 },
  { id: 'p4', code: 'PR-DRS-L', name: 'Major Wound Dressing / Burn Care', category: 'NURSING', rate: 350.00 },
  { id: 'p5', code: 'PR-INJ-IM', name: 'Intramuscular (IM) Injection Administration', category: 'NURSING', rate: 80.00 },
  { id: 'p6', code: 'PR-INJ-IV', name: 'IV Cannulation & Infusion (Saline/Dextrose)', category: 'PROCEDURE', rate: 300.00 },
  { id: 'p7', code: 'PR-STITCH', name: 'Minor Suture / Suture Removal', category: 'PROCEDURE', rate: 450.00 },
  { id: 'p8', code: 'PR-BSL', name: 'Random Blood Sugar (Glucometer Strip)', category: 'DIAGNOSTIC', rate: 60.00 }
];

export const STARTER_MEDICINES = [
  {
    id: 'm1',
    brand_name: 'Dolo 650',
    generic_name: 'Paracetamol',
    category: 'Antipyretic / Analgesic',
    form: 'TABLET',
    strength: '650 mg',
    reorder_level: 50,
    total_stock: 450,
    unit: 'Strip of 15',
    batches: [
      { batch_number: 'DL-8902', expiry_date: '2027-11-30', purchase_rate: 18.00, mrp: 30.50, stock_qty: 450, rack_location: 'Rack A-1' }
    ]
  },
  {
    id: 'm2',
    brand_name: 'Augmentin 625 Duo',
    generic_name: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotic',
    form: 'TABLET',
    strength: '625 mg',
    reorder_level: 30,
    total_stock: 60,
    unit: 'Strip of 10',
    batches: [
      { batch_number: 'AG-4410', expiry_date: '2026-10-15', purchase_rate: 145.00, mrp: 204.00, stock_qty: 60, rack_location: 'Rack A-3' }
    ]
  },
  {
    id: 'm3',
    brand_name: 'Ascoril-D Plus',
    generic_name: 'Dextromethorphan + Phenylephrine',
    category: 'Cough Syrup',
    form: 'SYRUP',
    strength: '100 ml Bottle',
    reorder_level: 15,
    total_stock: 12,
    unit: 'Bottle',
    batches: [
      { batch_number: 'AS-9012', expiry_date: '2028-03-31', purchase_rate: 95.00, mrp: 138.00, stock_qty: 12, rack_location: 'Rack B-2' }
    ]
  },
  {
    id: 'm4',
    brand_name: 'Pantocid DSR',
    generic_name: 'Pantoprazole + Domperidone',
    category: 'Antacid / Anti-reflux',
    form: 'CAPSULE',
    strength: '40 mg / 30 mg',
    reorder_level: 40,
    total_stock: 220,
    unit: 'Strip of 15',
    batches: [
      { batch_number: 'PT-2201', expiry_date: '2027-08-30', purchase_rate: 130.00, mrp: 198.00, stock_qty: 220, rack_location: 'Rack A-2' }
    ]
  },
  {
    id: 'm5',
    brand_name: 'Montair-LC',
    generic_name: 'Montelukast + Levocetirizine',
    category: 'Anti-Allergic',
    form: 'TABLET',
    strength: '10 mg / 5 mg',
    reorder_level: 25,
    total_stock: 180,
    unit: 'Strip of 10',
    batches: [
      { batch_number: 'MT-7718', expiry_date: '2027-05-31', purchase_rate: 110.00, mrp: 165.00, stock_qty: 180, rack_location: 'Rack C-1' }
    ]
  },
  {
    id: 'm6',
    brand_name: 'Electral ORS',
    generic_name: 'Oral Rehydration Salts',
    category: 'Electrolyte Replenisher',
    form: 'CONSUMABLE',
    strength: '21.8 gm Sachet',
    reorder_level: 30,
    total_stock: 95,
    unit: 'Sachet',
    batches: [
      { batch_number: 'EL-0091', expiry_date: '2028-01-31', purchase_rate: 16.00, mrp: 23.50, stock_qty: 95, rack_location: 'Rack D-1' }
    ]
  }
];

export const COMMON_COMPLAINTS = [
  'High Fever with Chills',
  'Dry Cough',
  'Productive Cough with Phlegm',
  'Severe Headache',
  'Throat Pain & Difficulty Swallowing',
  'Body Ache & Malaise',
  'Acute Acidity & Heartburn',
  'Abdominal Cramps',
  'Nausea & Vomiting',
  'Loose Stools / Diarrhea',
  'High Blood Pressure Check',
  'Diabetes Routine Review',
  'Minor Cut Injury / Wound',
  'Skin Rash / Itching',
  'Joint Pain & Swelling'
];

export const COMMON_DIAGNOSES = [
  'Acute Viral Upper Respiratory Infection (URTI)',
  'Acute Bacterial Pharyngitis / Tonsillitis',
  'Acute Gastroenteritis with Mild Dehydration',
  'Essential Hypertension (Grade 1)',
  'Type 2 Diabetes Mellitus - Uncontrolled',
  'Gastroesophageal Reflux Disease (GERD)',
  'Acute Bronchitis',
  'Allergic Rhinitis',
  'Urinary Tract Infection (UTI)',
  'Acute Migraine / Tension Headache',
  'Superficial Laceration / Traumatic Wound',
  'Tinea Corporis / Fungal Dermatitis'
];

export const RX_PRESET_TEMPLATES = [
  {
    name: 'Viral Fever & Body Ache Kit',
    medicines: [
      { drug_name: 'Dolo 650 mg', form: 'TABLET', dosage_pattern: '1-0-1', timing: 'AFTER_FOOD', duration: '3 Days', quantity: 6, instructions: 'Take with water after meals' },
      { drug_name: 'Pantocid DSR', form: 'CAPSULE', dosage_pattern: '1-0-0', timing: 'BEFORE_FOOD', duration: '3 Days', quantity: 3, instructions: 'Take 30 mins before breakfast' },
      { drug_name: 'Electral ORS', form: 'CONSUMABLE', dosage_pattern: '1-1-1', timing: 'WITH_FOOD', duration: '3 Days', quantity: 3, instructions: 'Dissolve in 1 liter water and sip' }
    ]
  },
  {
    name: 'Acute Bronchitis & Cough Pack',
    medicines: [
      { drug_name: 'Augmentin 625 Duo', form: 'TABLET', dosage_pattern: '1-0-1', timing: 'AFTER_FOOD', duration: '5 Days', quantity: 10, instructions: 'Complete full 5 days course' },
      { drug_name: 'Ascoril-D Plus Syrup', form: 'SYRUP', dosage_pattern: '1-1-1', timing: 'AFTER_FOOD', duration: '5 Days', quantity: 1, instructions: '5ml after food' },
      { drug_name: 'Montair-LC', form: 'TABLET', dosage_pattern: '0-0-1', timing: 'AT_BEDTIME', duration: '5 Days', quantity: 5, instructions: 'Take at night before sleep' }
    ]
  }
];
