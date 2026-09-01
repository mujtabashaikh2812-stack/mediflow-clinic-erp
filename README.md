# 🏥 MediFlow - Clinic & Hospital Management ERP

> **Modern, Premium, Cloud-First Clinic & Hospital ERP** built for solo medical practices, polyclinics, day-care surgical centres, and nursing homes. Powered by **React, Vite, Tailwind CSS, and Supabase PostgreSQL**.

---

## ✨ Key Features

1. **🎫 Live Reception OPD Queue & Token Calling**:
   * UHID patient registration in under 15 seconds.
   * Prominent, high-contrast drug allergy warnings (`Penicillin`, `Sulfa`).
   * Live waiting room counter with triage prioritization (*Normal*, *Senior Citizen*, *Emergency*).

2. **🩺 Doctor Consultation & E-Prescription (Rx) Cockpit**:
   * Complete vitals matrix (BP Systolic/Diastolic, Pulse, SpO2, Temp, Weight, Height, and auto-computed BMI).
   * Chief Complaints tags, ICD-10 clinical diagnosis, and 1-click viral/infection treatment kits.
   * Precision drug prescriber with form badges (`[TAB]`, `[SYP]`, `[CAP]`, `[INJ]`), dosage patterns (`1-0-1`, `1-1-1`, `0-0-1`, `SOS`), meal timings, and duration presets.
   * 1-Click printable Rx sheet (A4/A5) & WhatsApp digital prescription dispatch.

3. **💳 Medical Point of Sale (POS) & 80mm Thermal Receipt**:
   * Itemized charges: Consultation fees, diagnostic lab tests, clinical procedures (ECG, Nebulization, Dressing), and pharmacy medicines.
   * Tender modes: UPI QR Code, Counter Cash, Card POS, and Khata / Credit Ledger.
   * Instant 80mm thermal receipt generator (matching Citizen, TVS, Epson, and NGX thermal printers).

4. **💊 In-House Pharmacy & Near-Expiry Radar**:
   * Multi-batch medicine stock tracking with purchase cost vs MRP.
   * Near-expiry warning radar (FIFO prioritized dispensing).
   * Direct stock depletion upon billing.

5. **📊 Financial Analytics & Longitudinal Patient CRM**:
   * Daily collections ticker, Cash vs UPI breakdown, top billed clinical services, and doctor payout summaries.
   * Complete historical patient visit timeline & past prescription lookups.

---

## 🔒 100% Pure Cloud Architecture (Zero Local Storage for PHI)

To uphold strict medical data confidentiality and patient health information (PHI) hygiene:
* **Zero Patient Data on Disk**: No patient records, prescriptions, vitals, or bills are stored in browser `localStorage` or `indexedDB`.
* **Direct Supabase Cloud PostgreSQL**: All operations communicate directly with Supabase cloud database over encrypted TLS.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Connect Supabase (Cloud Database)
1. Open [Supabase.com](https://supabase.com) and create a free project.
2. Go to the **SQL Editor** in Supabase and paste the contents of `supabase_setup.sql`. Click **Run**.
3. Copy your **Project URL** and **Anon Key** from `Project Settings -> API`.
4. Click the **Connect Supabase** button in the MediFlow top navbar to paste your keys, or create a `.env` file from `.env.example`.

---

## 📁 Project Architecture

```
mediflow-clinic-erp/
├── src/
│   ├── components/
│   │   ├── common/         # Navbar, Toast, SupabaseSettingsModal
│   │   ├── opd/            # OpdQueueView, PatientRegistrationModal
│   │   ├── doctor/         # DoctorDeskView, RxPrintModal
│   │   ├── billing/        # BillingPosView
│   │   ├── pharmacy/       # PharmacyInventoryView
│   │   ├── patients/       # PatientHistoryCrmView
│   │   └── analytics/      # AnalyticsView
│   ├── config/             # supabaseClient.js
│   ├── context/            # ClinicContext.jsx (Global State)
│   ├── services/           # apiService.js, thermalPrintService.js, whatsappService.js, starterData.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── Database_schema.md      # Full DB documentation
├── Design.md               # Design system & color tokens
├── Project_overview.md     # Executive roadmap & specs
├── Rules.md                # Clinical data safety rules
├── supabase_setup.sql      # Supabase setup script
└── package.json
```
