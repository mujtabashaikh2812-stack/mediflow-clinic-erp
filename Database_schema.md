# Database Schema Specification: MediFlow

This document outlines the complete relational and document-oriented data model for **MediFlow Clinic & Hospital Management ERP**. It supports high-speed relational integrity, flexible JSON sub-documents for medical prescriptions, and fast indexed queries for patient lookups.

---

## Entity Relationship Overview

```
 ┌──────────────┐          1:N          ┌───────────────────┐
 │   Clinics    ├──────────────────────►│     Doctors       │
 └──────┬───────┘                       └─────────┬─────────┘
        │                                         │
        │ 1:N                                     │ 1:N
        ▼                                         ▼
 ┌──────────────┐          1:N          ┌───────────────────┐
 │   Patients   ├──────────────────────►│    Tokens/OPD     │
 └──────┬───────┘                       └─────────┬─────────┘
        │                                         │
        │ 1:N                  1:1                │ 1:1
        ├─────────────────────────────────────────┼──────────────┐
        │                                         │              │
        ▼                                         ▼              ▼
 ┌──────────────┐                       ┌───────────────────┐ ┌─────────────┐
 │Prescriptions │                       │     Vitals        │ │ Invoices    │
 └──────┬───────┘                       └───────────────────┘ └──────┬──────┘
        │                                                            │
        │ (Refs Medicine Items)                                      │ (Line items)
        ▼                                                            ▼
 ┌──────────────┐          1:N          ┌───────────────────┐ ┌─────────────┐
 │Pharmacy Items├──────────────────────►│ Pharmacy Batches  │ │  Procedures │
 └──────────────┘                       └───────────────────┘ └─────────────┘
```

---

## 1. Schema Definitions

### 1.1 `clinics` (Clinic Profile & Settings)
Stores clinic branding, legal headers, and operational configurations.

| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `_id` / `id` | String / UUID | PRIMARY KEY | Unique Clinic Identifier |
| `name` | String | NOT NULL | Clinic / Hospital Display Name |
| `tagline` | String | NULLABLE | e.g. "Total Healthcare & Day Care Centre" |
| `logo_url` | String | NULLABLE | URL/Base64 of clinic logo |
| `address` | Object | NOT NULL | `{ line1, line2, city, state, pincode }` |
| `phone` | String | NOT NULL | Clinic primary contact number |
| `email` | String | NULLABLE | Official email address |
| `gstin` | String | NULLABLE | Tax / GST Identification Number |
| `receipt_header`| String | NULLABLE | Custom text displayed on thermal receipts |
| `receipt_footer`| String | NULLABLE | e.g. "Get well soon! Follow-up valid for 7 days" |
| `whatsapp_config`| Object | `{ enabled: Boolean, senderPhone: String }` | WhatsApp automation parameters |

---

### 1.2 `doctors` (Doctor Master)
Physicians, surgeons, and specialists operating within the facility.

| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | String / UUID | PRIMARY KEY | Unique Doctor ID |
| `clinic_id` | String | FOREIGN KEY -> clinics.id | Clinic Reference |
| `name` | String | NOT NULL | Full Name (e.g. "Dr. Ananya Iyer") |
| `qualification` | String | NOT NULL | e.g. "MBBS, MD (Internal Medicine)" |
| `specialization`| String | NOT NULL | e.g. "General Physician", "Pediatrics" |
| `registration_no`| String | NOT NULL | State Medical Council Reg No. |
| `consultation_fee`| Number | NOT NULL, Default: 400 | Standard OPD consultation rate |
| `followup_validity_days`| Number | Default: 7 | Free or discounted follow-up duration |
| `room_no` | String | NULLABLE | Room / Cabin Number |
| `phone` | String | NOT NULL | Direct contact number |
| `is_active` | Boolean | Default: `true` | Active status indicator |

---

### 1.3 `patients` (Patient Master / UHID Registry)
Comprehensive demographic and baseline medical record.

| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `uhid` | String | PRIMARY KEY, UNIQUE | Unique Healthcare ID (e.g. `MF-2026-0042`) |
| `full_name` | String | NOT NULL | Patient Full Name |
| `phone` | String | NOT NULL, INDEXED | 10-digit mobile number |
| `gender` | Enum | `MALE`, `FEMALE`, `OTHER` | Gender |
| `age` | Number | NOT NULL | Age in years |
| `dob` | Date | NULLABLE | Date of Birth |
| `blood_group` | Enum | `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `UNKNOWN` | Blood Group |
| `address` | String | NULLABLE | Residential address / Area |
| `emergency_contact` | Object | `{ name: String, relation: String, phone: String }` | Next of kin contact |
| `allergies` | Array[String]| Default: `[]` | Known drug allergies (e.g. `["Penicillin", "Sulfa"]`) |
| `chronic_conditions` | Array[String]| Default: `[]` | e.g. `["Diabetes Type 2", "Hypertension"]` |
| `created_at` | Timestamp | Default: `now()` | Registration timestamp |

---

### 1.4 `tokens_queue` (Daily OPD Consultation Queue)
Manages the daily workflow and token board.

| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | String / UUID | PRIMARY KEY | Unique Token Record ID |
| `token_number` | Number | NOT NULL | Daily sequential token (e.g. `1`, `2`, `3`...) |
| `token_date` | Date | NOT NULL, INDEXED | Date of visit (YYYY-MM-DD) |
| `patient_uhid` | String | FOREIGN KEY -> patients.uhid | Patient reference |
| `doctor_id` | String | FOREIGN KEY -> doctors.id | Assigned Doctor |
| `visit_type` | Enum | `FIRST_VISIT`, `FOLLOW_UP`, `EMERGENCY` | Consultation type |
| `priority` | Enum | `NORMAL`, `SENIOR_CITIZEN`, `EMERGENCY` | Queue priority tier |
| `status` | Enum | `WAITING`, `WITH_DOCTOR`, `PHARMACY_BILLING`, `COMPLETED`, `CANCELLED` | Real-time queue status |
| `created_at` | Timestamp | Default: `now()` | Token issue time |
| `called_at` | Timestamp | NULLABLE | Time doctor opened consult |
| `completed_at` | Timestamp | NULLABLE | Time consultation/bill finished |

---

### 1.5 `vitals` (Clinical Vitals Log)
Tracks diagnostic measurements taken at triage or in cabin.

| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | String / UUID | PRIMARY KEY | Unique Vitals Record ID |
| `patient_uhid` | String | FOREIGN KEY -> patients.uhid | Patient reference |
| `token_id` | String | FOREIGN KEY -> tokens_queue.id | Associated token visit |
| `bp_systolic` | Number | Range: 50 - 260 | Systolic Blood Pressure (mmHg) |
| `bp_diastolic`| Number | Range: 30 - 160 | Diastolic Blood Pressure (mmHg) |
| `pulse_bpm` | Number | Range: 30 - 220 | Pulse / Heart rate in bpm |
| `spo2_percent`| Number | Range: 50 - 100 | Oxygen saturation percentage |
| `temp_f` | Number | Range: 90.0 - 108.0 | Body Temperature in Fahrenheit |
| `weight_kg` | Number | Range: 1.0 - 300.0 | Weight in Kilograms |
| `height_cm` | Number | Range: 30.0 - 250.0 | Height in Centimeters |
| `bmi` | Number | Auto-calculated | Body Mass Index ($kg/m^2$) |
| `recorded_at` | Timestamp | Default: `now()` | Measurement timestamp |

---

### 1.6 `prescriptions` (Electronic Medical Prescription - Rx)
Structured clinical record generated by the physician.

| Field Name | Data Type | Constraints / Description |
|---|---|---|
| `id` | String / UUID | PRIMARY KEY |
| `patient_uhid` | String | FOREIGN KEY -> patients.uhid |
| `doctor_id` | String | FOREIGN KEY -> doctors.id |
| `token_id` | String | FOREIGN KEY -> tokens_queue.id |
| `chief_complaints`| Array[Object] | `[{ symptom: "Fever", duration: "3 days", severity: "Moderate" }]` |
| `diagnosis` | Array[String] | e.g. `["Acute Upper Respiratory Tract Infection", "Mild Bronchospasm"]` |
| `clinical_notes` | String | Doctor's private or public clinical findings |
| `medicines` | Array[Object] | Nested array of prescribed drugs:<br>• `drug_name`: String<br>• `form`: Enum (`TAB`, `SYP`, `CAP`, `INJ`, `OINT`, `DROPS`)<br>• `dosage_pattern`: String (e.g. `1-0-1`, `1-1-1`, `0-0-1`, `SOS`)<br>• `timing`: Enum (`AFTER_FOOD`, `BEFORE_FOOD`, `WITH_FOOD`, `AT_BEDTIME`)<br>• `duration`: String (e.g. `5 Days`)<br>• `quantity`: Number<br>• `instructions`: String (e.g. "Take with lukewarm water") |
| `lab_tests_recommended` | Array[String] | e.g. `["CBC", "Widal Test", "Chest X-Ray PA View"]` |
| `dietary_advice` | String | e.g. "Avoid oily/spicy foods, drink plenty of fluids" |
| `followup_date` | Date | Scheduled follow-up date |
| `created_at` | Timestamp | Prescription timestamp |

---

### 1.7 `pharmacy_items` & `pharmacy_batches` (Inventory)
Master catalog and multi-batch stock tracking.

#### `pharmacy_items`
| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | String / UUID | PRIMARY KEY | Unique Item ID |
| `brand_name` | String | NOT NULL, INDEXED | e.g. "Dolo 650" |
| `generic_name` | String | NOT NULL | e.g. "Paracetamol" |
| `category` | String | e.g. "Antipyretic", "Antibiotic", "Analgesic" |
| `form` | Enum | `TABLET`, `SYRUP`, `CAPSULE`, `INJECTION`, `DROPS`, `OINTMENT`, `CONSUMABLE` |
| `strength` | String | e.g. "650 mg", "500 mg / 5 ml" |
| `reorder_level`| Number | Default: 20 | Minimum stock alert threshold |
| `total_stock` | Number | Default: 0 (Computed from batches) | Aggregate available quantity |
| `unit` | String | e.g. "Strip of 15", "Bottle 100ml", "Vial" |

#### `pharmacy_batches`
| Field Name | Data Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | String / UUID | PRIMARY KEY | Unique Batch ID |
| `item_id` | String | FOREIGN KEY -> pharmacy_items.id | Medicine Reference |
| `batch_number`| String | NOT NULL | Manufacturer Batch Code (e.g. `DL-9082`) |
| `expiry_date` | Date | NOT NULL, INDEXED | Expiration Date (YYYY-MM-DD) |
| `purchase_rate`| Number | NOT NULL | Cost Price per unit |
| `mrp` | Number | NOT NULL | Maximum Retail Price |
| `stock_qty` | Number | NOT NULL | Current batch inventory |
| `rack_location`| String | NULLABLE (e.g. "Rack B-3") | Storage shelf locator |

---

### 1.8 `invoices_billing` (Point of Sale & Invoices)
Comprehensive financial transaction ledger.

| Field Name | Data Type | Constraints / Description |
|---|---|---|
| `id` | String / UUID | PRIMARY KEY |
| `invoice_number`| String | UNIQUE (e.g. `INV-2026-0814`) |
| `patient_uhid` | String | FOREIGN KEY -> patients.uhid |
| `token_id` | String | NULLABLE (for walk-in pharmacy sales) |
| `doctor_id` | String | NULLABLE |
| `line_items` | Array[Object] | Array of billed items:<br>• `item_type`: `CONSULTATION`, `PROCEDURE`, `MEDICINE`, `LAB_TEST`<br>• `name`: String (e.g. "General Consultation", "ECG", "Dolo 650")<br>• `qty`: Number<br>• `unit_price`: Number<br>• `tax_percent`: Number (0, 5, 12, 18)<br>• `total_amount`: Number |
| `subtotal` | Number | Sum of all line items |
| `discount_amount`| Number | Default: 0 |
| `tax_amount` | Number | Total tax computed |
| `grand_total` | Number | `subtotal - discount + tax` |
| `payment_mode`| Enum | `CASH`, `UPI`, `CARD`, `CREDIT_KHATA`, `SPLIT` |
| `split_details`| Object | `{ cash: Number, upi: Number, card: Number }` |
| `payment_status`| Enum | `PAID`, `PARTIALLY_PAID`, `UNPAID` |
| `paid_amount` | Number | Amount collected |
| `balance_due` | Number | Outstanding credit |
| `cashier_name` | String | Staff member who received payment |
| `created_at` | Timestamp | Invoice generation time |

---

### 1.9 `services_procedures` (Clinical Services Catalog)
Standard procedure price list for dressings, tests, and minor operations.

| Field Name | Data Type | Default | Description |
|---|---|---|---|
| `id` | String / UUID | PRIMARY KEY | Unique Service ID |
| `code` | String | UNIQUE | Short Code (e.g. `PR-ECG`, `PR-DRS-1`) |
| `name` | String | NOT NULL | e.g. "12-Lead Electrocardiogram (ECG)", "Nebulization Session" |
| `category` | Enum | `PROCEDURE`, `NURSING`, `DIAGNOSTIC`, `DAYCARE` | Category |
| `rate` | Number | NOT NULL | Standard fee (e.g. ₹ 350.00) |
| `doctor_share_percent`| Number | Default: 0 | Split percentage for performing doctor |
