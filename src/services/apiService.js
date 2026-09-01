import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DEFAULT_CLINIC, DEFAULT_DOCTORS, STARTER_PROCEDURES, STARTER_MEDICINES } from './starterData';

// In-RAM Session Store (Active tab memory only - strict ZERO localStorage on disk)
let sessionState = {
  clinic: { ...DEFAULT_CLINIC },
  doctors: [...DEFAULT_DOCTORS],
  procedures: [...STARTER_PROCEDURES],
  medicines: [...STARTER_MEDICINES],
  patients: [
    {
      id: 'pt-1',
      uhid: 'MF-2026-0042',
      full_name: 'Rahul Verma',
      phone: '9820112345',
      gender: 'MALE',
      age: 34,
      blood_group: 'O+',
      allergies: ['Penicillin'],
      chronic_conditions: ['Hypertension'],
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'pt-2',
      uhid: 'MF-2026-0043',
      full_name: 'Sneha Kulkarni',
      phone: '9820199482',
      gender: 'FEMALE',
      age: 29,
      blood_group: 'B+',
      allergies: ['Sulfa'],
      chronic_conditions: [],
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'pt-3',
      uhid: 'MF-2026-0044',
      full_name: 'Vikram Malhotra',
      phone: '9845012890',
      gender: 'MALE',
      age: 42,
      blood_group: 'B+',
      allergies: [],
      chronic_conditions: ['Diabetes Type 2'],
      created_at: new Date().toISOString()
    }
  ],
  tokens: [
    {
      id: 'tok-1',
      token_number: 1,
      patient_id: 'pt-1',
      patient: { full_name: 'Rahul Verma', uhid: 'MF-2026-0042', age: 34, gender: 'MALE', phone: '9820112345', allergies: ['Penicillin'] },
      doctor_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      doctor_name: 'Dr. Ananya Sharma',
      visit_type: 'FIRST_VISIT',
      priority: 'NORMAL',
      status: 'COMPLETED',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'tok-2',
      token_number: 2,
      patient_id: 'pt-2',
      patient: { full_name: 'Sneha Kulkarni', uhid: 'MF-2026-0043', age: 29, gender: 'FEMALE', phone: '9820199482', allergies: ['Sulfa'] },
      doctor_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      doctor_name: 'Dr. Ananya Sharma',
      visit_type: 'FIRST_VISIT',
      priority: 'NORMAL',
      status: 'WAITING',
      created_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'tok-3',
      token_number: 3,
      patient_id: 'pt-3',
      patient: { full_name: 'Vikram Malhotra', uhid: 'MF-2026-0044', age: 42, gender: 'MALE', phone: '9845012890', allergies: [] },
      doctor_id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
      doctor_name: 'Dr. Ananya Sharma',
      visit_type: 'FIRST_VISIT',
      priority: 'NORMAL',
      status: 'WITH_DOCTOR',
      created_at: new Date(Date.now() - 900000).toISOString()
    }
  ],
  vitals: {
    'tok-3': {
      bp_systolic: 124,
      bp_diastolic: 82,
      pulse_bpm: 76,
      spo2_percent: 99,
      temp_f: 100.4,
      weight_kg: 74,
      height_cm: 172,
      bmi: 25.0
    }
  },
  prescriptions: [
    {
      id: 'rx-1',
      token_id: 'tok-1',
      patient_uhid: 'MF-2026-0042',
      doctor_name: 'Dr. Ananya Sharma',
      chief_complaints: ['Headache (2 Days)', 'Mild Fever'],
      diagnosis: ['Tension Headache with Mild Viral Prodrome'],
      medicines: [
        { drug_name: 'Dolo 650 mg', form: 'TABLET', dosage_pattern: '1-0-1', timing: 'AFTER_FOOD', duration: '3 Days', quantity: 6, instructions: 'Take with warm water' }
      ],
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ],
  invoices: [
    {
      id: 'inv-1',
      invoice_number: 'INV-2026-0001',
      patient_uhid: 'MF-2026-0042',
      patient_name: 'Rahul Verma',
      doctor_name: 'Dr. Ananya Sharma',
      line_items: [
        { name: 'OPD Consultation Fee', qty: 1, unit_price: 400, total_amount: 400 },
        { name: 'Dolo 650 mg (6 Tabs)', qty: 1, unit_price: 30, total_amount: 30 }
      ],
      subtotal: 430,
      discount_amount: 30,
      tax_amount: 0,
      grand_total: 400,
      payment_mode: 'UPI',
      payment_status: 'PAID',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]
};

// ==========================================
// 1. CLINIC & DOCTORS API
// ==========================================
export const apiGetClinicProfile = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('clinics').select('*').limit(1).single();
    if (!error && data) return data;
  }
  return sessionState.clinic;
};

export const apiGetDoctors = async () => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('doctors').select('*').eq('is_active', true);
    if (!error && data?.length) return data;
  }
  return sessionState.doctors;
};

// ==========================================
// 2. PATIENTS & UHID API
// ==========================================
export const apiGetPatients = async (searchTerm = '') => {
  if (isSupabaseConfigured()) {
    let query = supabase.from('patients').select('*').order('created_at', { ascending: false });
    if (searchTerm) {
      query = query.or(`full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,uhid.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (!error && data) return data;
  }

  if (!searchTerm) return sessionState.patients;
  const term = searchTerm.toLowerCase();
  return sessionState.patients.filter(p => 
    p.full_name.toLowerCase().includes(term) || 
    p.phone.includes(term) || 
    p.uhid.toLowerCase().includes(term)
  );
};

export const apiCreatePatient = async (patientData) => {
  const nextSeq = sessionState.patients.length + 45;
  const uhid = `MF-2026-${String(nextSeq).padStart(4, '0')}`;
  const newPatient = {
    ...patientData,
    uhid,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('patients').insert([newPatient]).select().single();
    if (!error && data) return data;
  }

  const inMemoryPatient = { id: `pt-${Date.now()}`, ...newPatient };
  sessionState.patients.unshift(inMemoryPatient);
  return inMemoryPatient;
};

// ==========================================
// 3. OPD QUEUE & TOKENS API
// ==========================================
export const apiGetTodayTokens = async () => {
  if (isSupabaseConfigured()) {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('tokens_queue')
      .select('*, patient:patients(*), doctor:doctors(*)')
      .eq('token_date', today)
      .order('token_number', { ascending: true });
    if (!error && data) return data;
  }
  return sessionState.tokens;
};

export const apiIssueToken = async ({ patientId, doctorId, visitType = 'FIRST_VISIT', priority = 'NORMAL' }) => {
  const patient = sessionState.patients.find(p => p.id === patientId || p.uhid === patientId);
  const doctor = sessionState.doctors.find(d => d.id === doctorId) || sessionState.doctors[0];
  const nextTokenNum = sessionState.tokens.length + 1;

  const newToken = {
    id: `tok-${Date.now()}`,
    token_number: nextTokenNum,
    token_date: new Date().toISOString().split('T')[0],
    patient_id: patient?.id || patientId,
    patient: patient || { full_name: 'Patient', uhid: 'MF-TEMP' },
    doctor_id: doctor.id,
    doctor_name: doctor.name,
    visit_type: visitType,
    priority,
    status: 'WAITING',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('tokens_queue').insert([{
      token_number: nextTokenNum,
      patient_id: patient?.id,
      doctor_id: doctor.id,
      visit_type: visitType,
      priority,
      status: 'WAITING'
    }]).select('*, patient:patients(*), doctor:doctors(*)').single();
    if (!error && data) return data;
  }

  sessionState.tokens.push(newToken);
  return newToken;
};

export const apiUpdateTokenStatus = async (tokenId, newStatus) => {
  if (isSupabaseConfigured()) {
    const updatePayload = { status: newStatus };
    if (newStatus === 'WITH_DOCTOR') updatePayload.called_at = new Date().toISOString();
    if (newStatus === 'COMPLETED') updatePayload.completed_at = new Date().toISOString();
    await supabase.from('tokens_queue').update(updatePayload).eq('id', tokenId);
  }

  const tok = sessionState.tokens.find(t => t.id === tokenId);
  if (tok) tok.status = newStatus;
  return tok;
};

// ==========================================
// 4. VITALS & PRESCRIPTION (Rx) API
// ==========================================
export const apiSaveVitals = async (tokenId, vitalsData) => {
  if (isSupabaseConfigured()) {
    await supabase.from('vitals').upsert({ token_id: tokenId, ...vitalsData });
  }
  sessionState.vitals[tokenId] = { ...vitalsData, recorded_at: new Date().toISOString() };
  return sessionState.vitals[tokenId];
};

export const apiGetVitals = async (tokenId) => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('vitals').select('*').eq('token_id', tokenId).single();
    if (data) return data;
  }
  return sessionState.vitals[tokenId] || null;
};

export const apiSavePrescription = async (prescriptionData) => {
  const rxRecord = {
    id: `rx-${Date.now()}`,
    ...prescriptionData,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('prescriptions').insert([prescriptionData]).select().single();
    if (!error && data) return data;
  }

  sessionState.prescriptions.unshift(rxRecord);
  return rxRecord;
};

export const apiGetPrescriptionsByPatient = async (patientUhid) => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase
      .from('prescriptions')
      .select('*, doctor:doctors(*)')
      .eq('patient_uhid', patientUhid)
      .order('created_at', { ascending: false });
    if (data) return data;
  }
  return sessionState.prescriptions.filter(r => r.patient_uhid === patientUhid);
};

// ==========================================
// 5. INVOICES & BILLING API
// ==========================================
export const apiCreateInvoice = async (invoicePayload) => {
  const nextInvNum = `INV-2026-${String(sessionState.invoices.length + 1).padStart(4, '0')}`;
  const newInvoice = {
    id: `inv-${Date.now()}`,
    invoice_number: nextInvNum,
    ...invoicePayload,
    payment_status: 'PAID',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.from('invoices_billing').insert([newInvoice]).select().single();
    if (!error && data) return data;
  }

  sessionState.invoices.unshift(newInvoice);
  return newInvoice;
};

export const apiGetInvoices = async () => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('invoices_billing').select('*').order('created_at', { ascending: false });
    if (data) return data;
  }
  return sessionState.invoices;
};

// ==========================================
// 6. PHARMACY INVENTORY & PROCEDURES API
// ==========================================
export const apiGetMedicines = async () => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('pharmacy_items').select('*, batches:pharmacy_batches(*)');
    if (data?.length) return data;
  }
  return sessionState.medicines;
};

export const apiGetProcedures = async () => {
  if (isSupabaseConfigured()) {
    const { data } = await supabase.from('services_procedures').select('*');
    if (data?.length) return data;
  }
  return sessionState.procedures;
};
