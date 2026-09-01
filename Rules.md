# Engineering & Clinical Operation Rules: MediFlow

This document defines the strict engineering, clinical data safety, and UX architecture rules for **MediFlow Clinic & Hospital Management ERP**.

---

## 1. Clinical Data Safety & Patient Privacy Rules

### Rule 1.1: Zero-Loss Drug Allergy Warnings
* **MANDATORY**: Whenever a patient record has registered drug allergies (e.g. *Penicillin*, *Ciprofloxacin*, *Sulfa*), an explicit, persistent, high-contrast visual alert badge (`bg-rose-500 text-white animate-pulse`) must appear across:
  1. The Reception Token Card
  2. The Doctor Consultation Header
  3. The Prescription Drug Selection Dropdown
* Prescribing a drug matching an active allergy requires explicit double-confirmation override.

### Rule 1.2: Immutable Clinical Prescription Logs
* Once a prescription is completed and issued, it cannot be silently edited or overwritten. Any modifications must create a versioned revision or addendum to protect medical-legal audit integrity.

### Rule 1.3: Patient Identifiers & Search Normalization
* Phone numbers must be normalized to standard 10 digits (removing country codes `+91`, spaces, hyphens) to prevent duplicate patient profiles.
* UHIDs must follow an auto-incrementing zero-padded sequence (e.g. `MF-2026-0001`).

---

## 2. Point of Sale & Billing Integrity Rules

### Rule 2.1: Atomic Inventory Depletion
* When a prescription or OTC pharmacy bill is marked as `PAID`, medicine batch stocks must be decremented atomically using FIFO (First-In, First-Out by earliest expiration date).
* System must forbid dispensing expired medication batches. If a batch expiry date `< Today`, the system must lock the batch and trigger an amber alert.

### Rule 2.2: Precision Monetary Calculations
* All currency calculations must be computed in standard float/fixed-point precision (`toFixed(2)`).
* Formula:
  $$\text{Grand Total} = \sum (\text{Line Item Qty} \times \text{Unit Price}) - \text{Discount} + \text{Tax}$$
* Negative invoice totals or unauthorized negative discounts are strictly disallowed.

### Rule 2.3: Split-Tender Payment Reconciliations
* When split payments are enabled (e.g., ₹ 200 Cash + ₹ 300 UPI = ₹ 500 Total), the sum of tender splits must equal `Paid Amount`.
* Partial payments must automatically log the remaining balance under the patient's Khata / Credit Ledger with a payment due timestamp.

---

## 3. UI/UX & Clinical Ergonomics Rules

### Rule 3.1: "Speed Over Clicks" Standard
* Medical staff operate in high-pressure environments. Every primary workflow must be executable with minimal clicks:
  * **New Walk-in Token**: $\le 3$ clicks / inputs.
  * **Add Prescription Medicine**: Keyboard navigable (Search -> Tab -> Frequency Pill -> Enter).
  * **Print Receipt**: 1-click thermal print dialog trigger (`Ctrl + P`).

### Rule 3.2: High Contrast & Readability
* Minimum contrast ratio of 4.5:1 for all normal text and 7:1 for vital signs / drug dosage frequencies.
* Clear visual distinction between dosage forms:
  * `[TAB]` (Teal badge)
  * `[SYP]` (Purple badge)
  * `[INJ]` (Amber badge)
  * `[CAP]` (Sky badge)
  * `[OINT]` (Emerald badge)

### Rule 3.3: Pure Cloud Architecture (Zero LocalStorage for Clinical Data)
* **STRICT MEDICAL DATA HYGIENE**: To protect sensitive Patient Health Information (PHI) and meet clinical data privacy standards, **NO patient records, prescriptions, vitals, bills, or medical histories shall be stored in browser `localStorage` or `indexedDB`**.
* **100% Direct Supabase Persistence**: All CRUD operations (Create, Read, Update, Delete) are performed directly and securely against the **Supabase Cloud Database (PostgreSQL)** over encrypted HTTPS / WSS.
* When a user logs out or closes the tab, no residual patient data remains on the physical browser disk.

---

## 4. Code Architecture & Component Standards

```
frontend/src/
├── components/
│   ├── opd/           # Pure UI for Token & Registration
│   ├── prescription/  # Vitals, Rx Matrix, Print Previews
│   ├── billing/       # POS, Invoices, Thermal Receipt
│   ├── pharmacy/      # Batches, Inventory, Expiry Radar
│   └── analytics/     # Financial & Footfall Charts
├── services/          # Pure calculation & formatting utilities
└── contexts/          # Lightweight global state
```

* **Separation of Concerns**: Clinical business logic, dose calculations, and print formatting utilities must reside in dedicated pure service helper functions, keeping React components clean and focused on rendering.
* **Component Modularity**: All modals, table rows, and status badges must be modular and reusable.
