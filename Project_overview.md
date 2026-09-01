# Project Overview: MediFlow Clinic & Hospital Management ERP

## 1. Executive Summary
**MediFlow** is a modern, responsive, high-performance Clinic & Hospital Management System (HMS / Clinic ERP). Designed specifically for solo medical practitioners, polyclinics, nursing homes, and daycare medical centres, MediFlow bridges the gap between chaotic paper registers and complex legacy hospital enterprise software.

It delivers a streamlined, 10x faster workflow across reception OPD queues, digital clinical consultations (E-Prescriptions), consolidated multi-service billing, in-house pharmacy stock & batch tracking, and longitudinal patient health records.

---

## 2. Core Value Propositions

* ⚡ **Ultra-Fast OPD Registration & Smart Queue**: Register new patients in under 15 seconds with auto-generated UHID and live token status board.
* 🩺 **Doctor-First E-Prescription Desk**: Rapid vitals logging, one-click diagnosis selection, drug auto-suggestions with frequency presets (1-0-1, SOS), and 1-tap WhatsApp PDF delivery.
* 💳 **Unified Medical Point of Sale (POS)**: Combines consultation charges, surgical procedures, nursing care, lab diagnostics, and pharmacy items onto a single 80mm thermal receipt or A4/A5 GST invoice.
* 💊 **In-House Pharmacy & Batch Expiry Radar**: Track drug inventory by batch numbers, real-time stock auto-deduction on prescription dispensing, and near-expiry warning alerts.
* 📊 **Executive & Financial Analytics**: Daily cash vs UPI collections, doctor revenue-share payouts, department performance, and patient retention analytics.
* 📱 **Patient CRM & WhatsApp Automation**: Automated follow-up visit reminders, medicine refill alerts, and instant receipt dispatch to patient phones.

---

## 3. User Personas & Roles

```
               ┌───────────────────────────────────────────────┐
               │              MEDIFLOW ROLES                   │
               └───────┬──────────────┬──────────────┬─────────┘
                       │              │              │
                       ▼              ▼              ▼
              ┌────────────────┐┌───────────┐┌────────────────┐
              │ 🏢 Receptionist││ 🩺 Doctor  ││ 💊 Pharmacist │
              ├────────────────┤├───────────┤├────────────────┤
              │• Patient Reg   ││• Vitals   ││• Stock Batches │
              │• Token Issue   ││• Diagnosis││• Expiry Alert  │
              │• Fee Billing   ││• Digital Rx││• OTC Fast POS  │
              │• Appointments  ││• Lab Order││• Dispense Rx   │
              └────────────────┘└───────────┘└────────────────┘
```

1. **Receptionist / Front Desk**:
   - Patient check-in, token generation, emergency triage tagging, appointment scheduling, and collection of consultation fees.
2. **Doctor / Specialist**:
   - Live consultation queue, patient medical history review, vitals charting, clinical diagnosis, electronic prescription authoring, and lab order creation.
3. **Pharmacist / Stock Manager**:
   - Prescription fulfillment, direct over-the-counter (OTC) pharmacy billing, purchase order receiving, batch & expiry monitoring.
4. **Clinic Owner / Medical Director**:
   - Real-time revenue insights, doctor-wise patient counts, expense vs collection reports, staff management, and clinic branding configuration.

---

## 4. Key Module Specifications

### Module 1: Patient Registration & OPD Token Queue
- **Unique Healthcare ID (UHID)**: Standardized ID generation (e.g. `MF-2026-0089`).
- **Demographic & Clinical Profile**: Name, Age, Gender, Phone, Blood Group, Guardian/Emergency contact, Known Drug Allergies (e.g., Penicillin, Sulfa).
- **Live Waiting Room Queue**: Real-time token counter board with audio-visual token calling status (*Waiting*, *In Consultation*, *Completed*).

### Module 2: Doctor Consultation & E-Prescription Desk
- **Vitals Matrix**: Blood Pressure (Systolic/Diastolic), Pulse Rate (bpm), SpO2 (%), Temperature (°F), Weight (kg), Height (cm), and auto-calculated Body Mass Index (BMI).
- **Chief Complaints & Diagnosis**: Quick-tag common symptoms (Fever, Cough, Headache, Abdominal pain) + ICD-10 search.
- **Smart Rx Engine**: Preloaded drug formulary (Tablet, Syrup, Drops, Injection, Ointment) with dosage timing (Before/After food), frequency, and duration.
- **Pre-Configured Treatment Kits**: 1-click prescription templates (e.g., *Viral Fever Kit*, *Acute Gastroenteritis*, *Hypertension Maintenance*).

### Module 3: Multi-Head Billing & Digital Invoicing
- **Consolidated Charges**:
  - Consultation (First Visit, Follow-up, Emergency).
  - Procedures & Nursing (ECG, Nebulization, Wound Dressing, IV Fluid, Suture Removal).
  - Diagnostic Labs & Imaging (CBC, Blood Sugar, Urine Analysis, X-Ray).
  - Prescribed Medicines & Medical Consumables.
- **Flexible Payment Methods**: Split tender support (Cash, UPI QR, Credit/Debit Card, Khata/Credit).
- **Dual Output**: 80mm ESC/POS Thermal Slip + Formal A4/A5 Printable Invoice.

### Module 4: Pharmacy Inventory & Expiry Tracking
- **Batch Master**: Batch No, Manufacturing Date, Expiry Date, Purchase Rate, MRP, GST %, Reorder Level.
- **Stock Depletion**: Automated inventory deduction upon billing or dispensing.
- **Expiry Radar**: Color-coded alerts for drugs expiring in 30, 60, or 90 days.

### Module 5: Clinical CRM & Analytics
- **Patient Longitudinal Timeline**: Search by phone or UHID to view every past prescription, diagnosis, vital sign trend, and billing receipt.
- **Financial Dashboard**: Daily revenue ticker, payment mode distribution, top billed procedures, and doctor performance reports.
- **WhatsApp Integrations**: Instant WhatsApp Rx sharing and follow-up appointment reminders.

---

## 5. Technology Stack

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, HTML5 Print.
* **Backend & Database**: Pure **Supabase Cloud (PostgreSQL + Supabase Auth + Supabase Realtime)** with Row-Level Security. (Zero local browser storage for patient medical records).
* **Printing & Docs**: ESC/POS Thermal Format Engine, jsPDF Document Generator.
