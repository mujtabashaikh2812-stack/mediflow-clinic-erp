# Design System & UI/UX Guidelines: MediFlow

## 1. Aesthetic Philosophy: "Modern Clinical Precision"
The MediFlow interface is designed with a **modern, premium, explicit, and fresh** medical aesthetic. It replaces cluttered, sterile, boxy legacy clinical software with an interface that feels like high-end fintech meets precision digital healthcare.

### Core Visual Pillars
* **High Information Density with Breathing Room**: Doctors and clinic staff need fast access to patient data without cognitive fatigue.
* **Instant Visual Triage**: Critical clinical states (abnormal BP, severe allergies, urgent queue tokens) stand out unmistakably via semantic color accents.
* **Tactile Interactions**: Micro-animations, pill toggles, keyboard shortcuts, and haptic feedback on actions like token dispensing and bill printing.
* **Dual Theme Excellence**: Seamless light & dark modes optimized for bright clinic reception desks and low-light doctor examination rooms.

---

## 2. Color Palette & Semantic Tokens

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PRIMARY PALETTES                                │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│ Medical Teal      │ Emerald Mint      │ Deep Slate/Navy   │ Radiant Rose    │
│ #0EA5E9 / #0D9488 │ #10B981 / #059669 │ #0F172A / #1E293B │ #F43F5E         │
│ (Primary Brand)   │ (Success/Healthy) │ (Surfaces/Text)   │ (Alert/Allergy) │
└───────────────────┴───────────────────┴───────────────────┴─────────────────┘
```

### Color Variables & Tailwind Classes

| Semantic Token | Light Mode (CSS / Tailwind) | Dark Mode (CSS / Tailwind) | Use Case |
|---|---|---|---|
| **Primary Accent** | `#0D9488` (`teal-600`) | `#14B8A6` (`teal-500`) | Key CTAs, active tabs, doctor header accents |
| **Secondary Accent** | `#0284C7` (`sky-600`) | `#38BDF8` (`sky-400`) | Token numbers, patient UHID badges, info pills |
| **Success / Normal** | `#059669` (`emerald-600`) | `#10B981` (`emerald-500`) | Normal vitals, paid bills, completed consults |
| **Warning / Pending** | `#D97706` (`amber-600`) | `#F59E0B` (`amber-500`) | Near-expiry stock, waiting room patients |
| **Danger / High Risk** | `#E11D48` (`rose-600`) | `#FB7185` (`rose-400`) | Drug allergies, hypertensive BP, low stock |
| **Background** | `#F8FAFC` (`slate-50`) | `#0B0F17` (Deep Obsidian) | Main application canvas background |
| **Surface / Card** | `#FFFFFF` (`white` + shadow-sm) | `#131B2E` (`slate-900/80` + blur)| Data cards, modal windows, table panels |
| **Border / Divider** | `#E2E8F0` (`slate-200`) | `#1E293B` (`slate-800`) | Clean 1px card borders and subtle dividers |

---

## 3. Typography & Numerical Precision

* **Primary Body & Display**: `Plus Jakarta Sans` / `Inter`, system-ui fallback.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).
* **Medical Numbers & Metrics**: `JetBrains Mono` / `Fira Code` tabular numbers for Vitals (BP `120/80`, SpO2 `99%`), Token numbers (`#04`), and Currency (`₹ 450.00`).

---

## 4. UI Components Specification

### 1. 🎫 OPD Smart Token Card
```
┌────────────────────────────────────────────────────────┐
│  #14   Rahul Verma (34 M)        [🟡 Waiting - 8m]     │
│  UHID: MF-2026-0129  •  Dr. Sharma (Gen. Medicine)     │
│  [🩺 Start Consult]  [💳 Quick Bill]  [⚠️ Penicillin]   │
└────────────────────────────────────────────────────────┘
```
- **Visuals**: Left colored indicator bar based on status (*Amber = Waiting, Emerald = In Cabin, Sky = Paid*).
- **Allergy Tag**: Flashing soft red badge if patient has known adverse drug reactions.

### 2. 🩺 Vitals Matrix Bar
- Multi-metric responsive grid with auto-coloring:
  - **BP**: `< 120/80` (Green), `120-139/80-89` (Amber), `>= 140/90` (Rose alert).
  - **SpO2**: `>= 95%` (Green), `< 95%` (Rose alert).
  - **BMI**: Auto-computed with indicator chip (*Underweight, Normal, Overweight, Obese*).

### 3. 💊 Smart E-Prescription (Rx) Drug Row
- **Drug Search Input**: Predictive search dropdown with dosage form tags (`[TAB]`, `[SYP]`, `[INJ]`, `[CAP]`).
- **Dosage Quick Buttons**:
  - `[ 1 - 0 - 1 ]` `[ 1 - 1 - 1 ]` `[ 0 - 0 - 1 ]` `[ 1 - 0 - 0 ]` `[ S.O.S ]`
- **Meal Timing Toggle**:
  - `[ 🍽️ After Meal ]` `[ 🥣 Before Meal ]` `[ 🌙 At Bedtime ]`
- **Duration Selector**:
  - `[ 3 Days ]` `[ 5 Days ]` `[ 7 Days ]` `[ 15 Days ]` `[ Custom... ]`

### 4. 🧾 80mm Thermal Receipt Generator
- Ultra-crisp monochrome layout matching standard thermal POS receipt printers (Citizen, Epson, TVS, Xprinter, NGX).
- Clear breakdown: Clinic Header -> Patient UHID -> Doctor Name -> Itemized Fees (Consultation + Tests + Pharmacy) -> Split Payment breakdown -> QR Code for WhatsApp summary.

---

## 5. Micro-Interactions & Transitions
* **Smooth Elevations**: Cards feature `transition-all duration-200 hover:shadow-md hover:border-teal-500/40`.
* **Confetti & Feedback**: Delightful visual celebration on bill payment completion and new patient onboarding.
* **Keyboard First Shortcuts**:
  - `Ctrl + N`: New Patient Token
  - `Ctrl + K`: Universal Search (UHID / Phone / Patient Name)
  - `Ctrl + P`: Instant Print Prescription / Receipt
  - `Ctrl + B`: Open Quick Billing POS
