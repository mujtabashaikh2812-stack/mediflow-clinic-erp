import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  apiGetVitals, 
  apiSaveVitals, 
  apiSavePrescription 
} from '../../services/apiService';
import { 
  COMMON_COMPLAINTS, 
  COMMON_DIAGNOSES, 
  RX_PRESET_TEMPLATES 
} from '../../services/starterData';
import { RxPrintModal } from './RxPrintModal';
import { CustomSelect } from '../common/CustomSelect';
import { 
  Stethoscope, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  Share2, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  Check,
  User
} from 'lucide-react';

export const DoctorDeskView = ({ onNavigateToBilling }) => {
  const { tokens, activeToken, setActiveToken, activeDoctor, medicines, updateTokenState, showToast, triggerConfetti } = useClinic();

  // Vitals State
  const [vitals, setVitals] = useState({
    bp_systolic: 120,
    bp_diastolic: 80,
    pulse_bpm: 76,
    spo2_percent: 99,
    temp_f: 98.6,
    weight_kg: 70,
    height_cm: 170,
    bmi: 24.2
  });

  // Clinical Rx State
  const [selectedComplaints, setSelectedComplaints] = useState(['High Fever with Chills', 'Dry Cough']);
  const [customComplaint, setCustomComplaint] = useState('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('Acute Viral Upper Respiratory Infection (URTI)');
  const [clinicalNotes, setClinicalNotes] = useState('Throat congestion mild, chest clear, no wheeze.');
  
  // Prescribed Drugs List
  const [prescribedMeds, setPrescribedMeds] = useState([
    {
      drug_name: 'Dolo 650',
      form: 'TABLET',
      dosage_pattern: '1-0-1',
      timing: 'AFTER_FOOD',
      duration: '3 Days',
      quantity: 6,
      instructions: 'Take after food with water'
    },
    {
      drug_name: 'Ascoril-D Plus',
      form: 'SYRUP',
      dosage_pattern: '1-1-1',
      timing: 'AFTER_FOOD',
      duration: '5 Days',
      quantity: 1,
      instructions: '5ml using measuring cup'
    }
  ]);

  // New Drug Input Draft
  const [newDrug, setNewDrug] = useState({
    drug_name: '',
    form: 'TABLET',
    dosage_pattern: '1-0-1',
    timing: 'AFTER_FOOD',
    duration: '5 Days',
    quantity: 10,
    instructions: 'Take after meals'
  });

  const [labTests, setLabTests] = useState(['Complete Blood Count (CBC)']);
  const [newLabTest, setNewLabTest] = useState('');
  const [dietAdvice, setDietAdvice] = useState('Drink boiled warm water, light khichdi diet, avoid cold items.');
  const [followupDays, setFollowupDays] = useState(5);
  
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [savedRx, setSavedRx] = useState(null);

  // Load vitals when activeToken changes
  useEffect(() => {
    if (activeToken) {
      apiGetVitals(activeToken.id).then(res => {
        if (res) setVitals(res);
      });
    }
  }, [activeToken]);

  // Auto-calculate BMI
  const handleVitalsChange = (field, val) => {
    const updated = { ...vitals, [field]: parseFloat(val) || 0 };
    if (updated.weight_kg > 0 && updated.height_cm > 0) {
      const heightInMeters = updated.height_cm / 100;
      updated.bmi = parseFloat((updated.weight_kg / (heightInMeters * heightInMeters)).toFixed(1));
    }
    setVitals(updated);
  };

  const handleSaveVitals = async () => {
    if (!activeToken) return;
    await apiSaveVitals(activeToken.id, vitals);
    showToast('Patient vitals recorded successfully!', 'success');
  };

  const handleAddMed = () => {
    if (!newDrug.drug_name) {
      showToast('Please select or type a drug name', 'error');
      return;
    }
    setPrescribedMeds([...prescribedMeds, { ...newDrug }]);
    setNewDrug({
      drug_name: '',
      form: 'TABLET',
      dosage_pattern: '1-0-1',
      timing: 'AFTER_FOOD',
      duration: '5 Days',
      quantity: 10,
      instructions: 'Take after meals'
    });
  };

  const handleRemoveMed = (index) => {
    setPrescribedMeds(prescribedMeds.filter((_, idx) => idx !== index));
  };

  const applyPresetTemplate = (template) => {
    setPrescribedMeds([...template.medicines]);
    showToast(`Loaded ${template.name}!`, 'info');
  };

  const handleCompletePrescription = async () => {
    if (!activeToken) {
      showToast('No active patient selected in doctor cabin', 'error');
      return;
    }

    const rxPayload = {
      token_id: activeToken.id,
      patient_uhid: activeToken.patient?.uhid,
      doctor_name: activeDoctor?.name || 'Dr. Ananya Sharma',
      chief_complaints: selectedComplaints,
      diagnosis: [selectedDiagnosis],
      clinical_notes: clinicalNotes,
      medicines: prescribedMeds,
      lab_tests_recommended: labTests,
      dietary_advice: dietAdvice,
      followup_date: new Date(Date.now() + followupDays * 86400000).toLocaleDateString()
    };

    try {
      const saved = await apiSavePrescription(rxPayload);
      setSavedRx(saved);
      await handleSaveVitals();
      await updateTokenState(activeToken.id, 'PHARMACY_BILLING');
      triggerConfetti();
      showToast('Prescription generated! Forwarded to Billing & Pharmacy', 'success');
      setIsPrintModalOpen(true);
    } catch (err) {
      showToast('Failed to save prescription', 'error');
    }
  };

  // If no patient is active, show selector from waiting queue
  const waitingTokens = tokens.filter(t => t.status === 'WAITING' || t.status === 'WITH_DOCTOR');

  return (
    <div class="space-y-6">
      
      {/* Active Patient Consultation Banner */}
      <div class="glass-card p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-teal-400">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex flex-col items-center justify-center font-mono text-teal-300">
            <span class="text-[9px] font-bold uppercase">TOKEN</span>
            <span class="text-xl font-extrabold text-white">#{activeToken?.token_number || '--'}</span>
          </div>

          <div>
            <div class="flex items-center gap-3">
              <h2 class="text-lg font-bold text-white">
                {activeToken?.patient?.full_name || 'No Active Patient in Cabin'}
              </h2>
              {activeToken && (
                <>
                  <span class="px-2 py-0.5 text-xs bg-slate-800 text-slate-300 rounded font-mono">
                    {activeToken.patient?.age} Yrs / {activeToken.patient?.gender}
                  </span>
                  <span class="px-2 py-0.5 text-xs bg-teal-500/20 text-teal-300 font-mono rounded">
                    {activeToken.patient?.uhid}
                  </span>
                </>
              )}
            </div>

            {/* Allergy Flag */}
            {activeToken?.patient?.allergies?.length > 0 && (
              <div class="mt-1 flex items-center gap-2">
                <span class="px-2.5 py-0.5 text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/50 rounded-full flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle class="w-3.5 h-3.5 text-rose-400" />
                  CRITICAL ALLERGY ALERT: {activeToken.patient.allergies.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Switch Patient Dropdown / Queue Action */}
        <div class="flex items-center gap-3">
          <div class="text-xs min-w-[260px]">
            <label class="block text-slate-400 text-[10px] uppercase font-semibold mb-1">Switch Patient in Queue</label>
            <CustomSelect
              options={waitingTokens.map(tok => ({
                value: tok.id,
                label: `#${tok.token_number} - ${tok.patient?.full_name}`,
                badge: tok.status,
                subtext: `UHID: ${tok.patient?.uhid} • ${tok.patient?.age} Y (${tok.patient?.gender?.charAt(0)})`
              }))}
              value={activeToken?.id || ''}
              onChange={(tokId) => {
                const tok = tokens.find(t => t.id === tokId);
                if (tok) {
                  updateTokenState(tok.id, 'WITH_DOCTOR');
                  setActiveToken(tok);
                }
              }}
              icon={User}
              placeholder="-- Select Patient Token --"
              size="sm"
            />
          </div>

          <button 
            onClick={handleCompletePrescription}
            class="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all mt-4 sm:mt-0"
          >
            <Save class="w-4 h-4" />
            <span>Finish Rx & Send to Billing</span>
          </button>
        </div>
      </div>

      {/* Vitals Matrix Strip */}
      <div class="glass-card p-4 rounded-2xl space-y-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <div class="flex items-center gap-2">
            <Activity class="w-4 h-4 text-teal-400" />
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Patient Vitals & Biometrics</h3>
          </div>
          <button 
            onClick={handleSaveVitals}
            class="text-[11px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
          >
            <Check class="w-3.5 h-3.5" /> Save Vitals
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* BP Systolic / Diastolic */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">BP (Systolic / Diastolic)</label>
            <div class="flex items-center gap-1 mt-1 font-mono">
              <input 
                type="number" 
                value={vitals.bp_systolic} 
                onChange={(e) => handleVitalsChange('bp_systolic', e.target.value)}
                class="w-12 bg-slate-900 text-white font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
              <span class="text-slate-400 font-bold">/</span>
              <input 
                type="number" 
                value={vitals.bp_diastolic} 
                onChange={(e) => handleVitalsChange('bp_diastolic', e.target.value)}
                class="w-12 bg-slate-900 text-white font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
            </div>
            <span class={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded ${
              vitals.bp_systolic > 140 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {vitals.bp_systolic > 140 ? 'Stage 1 High' : 'Normal'}
            </span>
          </div>

          {/* Pulse Rate */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">Pulse Rate</label>
            <div class="flex items-baseline gap-1 mt-1 font-mono">
              <input 
                type="number" 
                value={vitals.pulse_bpm} 
                onChange={(e) => handleVitalsChange('pulse_bpm', e.target.value)}
                class="w-14 bg-slate-900 text-white font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
              <span class="text-[10px] text-slate-400">bpm</span>
            </div>
            <span class="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              Normal
            </span>
          </div>

          {/* Oxygen SpO2 */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">Oxygen (SpO2)</label>
            <div class="flex items-baseline gap-1 mt-1 font-mono">
              <input 
                type="number" 
                value={vitals.spo2_percent} 
                onChange={(e) => handleVitalsChange('spo2_percent', e.target.value)}
                class="w-14 bg-slate-900 text-teal-300 font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
              <span class="text-[10px] text-teal-400">%</span>
            </div>
            <span class="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300">
              Good
            </span>
          </div>

          {/* Body Temperature */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">Temperature</label>
            <div class="flex items-baseline gap-1 mt-1 font-mono">
              <input 
                type="number" 
                step="0.1"
                value={vitals.temp_f} 
                onChange={(e) => handleVitalsChange('temp_f', e.target.value)}
                class="w-16 bg-slate-900 text-amber-300 font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
              <span class="text-[10px] text-slate-400">°F</span>
            </div>
            <span class={`inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded ${
              vitals.temp_f > 99.5 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {vitals.temp_f > 99.5 ? 'Febrile' : 'Afebrile'}
            </span>
          </div>

          {/* Weight */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">Weight</label>
            <div class="flex items-baseline gap-1 mt-1 font-mono">
              <input 
                type="number" 
                value={vitals.weight_kg} 
                onChange={(e) => handleVitalsChange('weight_kg', e.target.value)}
                class="w-14 bg-slate-900 text-white font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
              <span class="text-[10px] text-slate-400">kg</span>
            </div>
          </div>

          {/* Height */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">Height</label>
            <div class="flex items-baseline gap-1 mt-1 font-mono">
              <input 
                type="number" 
                value={vitals.height_cm} 
                onChange={(e) => handleVitalsChange('height_cm', e.target.value)}
                class="w-14 bg-slate-900 text-white font-bold text-sm px-1 py-0.5 rounded border border-slate-700 text-center" 
              />
              <span class="text-[10px] text-slate-400">cm</span>
            </div>
          </div>

          {/* BMI */}
          <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <label class="block text-[10px] text-slate-400 uppercase font-semibold">Body Mass Index</label>
            <p class="text-base font-extrabold text-white font-mono mt-1">{vitals.bmi || '--'}</p>
            <span class="inline-block text-[9px] font-semibold text-slate-400">Normal Range</span>
          </div>
        </div>
      </div>

      {/* Clinical Notes & Interactive Prescriber Matrix */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Complaints, Diagnosis, Tests (5 cols) */}
        <div class="lg:col-span-5 space-y-5">
          
          {/* Chief Complaints Tag Matrix */}
          <div class="glass-card p-5 rounded-2xl space-y-3">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">Chief Complaints</label>
            
            <div class="flex flex-wrap gap-1.5">
              {selectedComplaints.map((c, idx) => (
                <span 
                  key={idx} 
                  class="px-2.5 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-lg border border-teal-500/40 flex items-center gap-1.5"
                >
                  {c}
                  <button 
                    onClick={() => setSelectedComplaints(selectedComplaints.filter((_, i) => i !== idx))}
                    class="text-teal-400 hover:text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div class="flex gap-2 pt-1">
              <input 
                type="text" 
                placeholder="+ Add symptom..." 
                value={customComplaint}
                onChange={(e) => setCustomComplaint(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customComplaint.trim()) {
                    setSelectedComplaints([...selectedComplaints, customComplaint.trim()]);
                    setCustomComplaint('');
                  }
                }}
                class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
              />
              <button 
                onClick={() => {
                  if (customComplaint.trim()) {
                    setSelectedComplaints([...selectedComplaints, customComplaint.trim()]);
                    setCustomComplaint('');
                  }
                }}
                class="px-3 py-1.5 bg-slate-800 text-teal-300 font-bold text-xs rounded-xl"
              >
                Add
              </button>
            </div>

            {/* Quick Symptom Chips */}
            <div class="pt-2">
              <p class="text-[10px] text-slate-400 uppercase font-semibold mb-1">Quick Select Symptoms:</p>
              <div class="flex flex-wrap gap-1">
                {COMMON_COMPLAINTS.slice(0, 6).map((comp, idx) => (
                  <button 
                    key={idx}
                    onClick={() => !selectedComplaints.includes(comp) && setSelectedComplaints([...selectedComplaints, comp])}
                    class="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-800"
                  >
                    + {comp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Diagnosis & Notes */}
          <div class="glass-card p-5 rounded-2xl space-y-3">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider">Clinical Diagnosis</label>
            
            <CustomSelect
              options={COMMON_DIAGNOSES.map(diag => ({
                value: diag,
                label: diag
              }))}
              value={selectedDiagnosis}
              onChange={(diag) => setSelectedDiagnosis(diag)}
              placeholder="Select Diagnosis..."
              size="md"
            />

            <div>
              <label class="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Examination Findings / Doctor Notes</label>
              <textarea 
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Dietary Advice & Follow-up */}
          <div class="glass-card p-5 rounded-2xl space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Follow-up In</label>
                <div class="flex items-center gap-2">
                  <input 
                    type="number" 
                    value={followupDays} 
                    onChange={(e) => setFollowupDays(parseInt(e.target.value) || 0)}
                    class="w-16 bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono text-center" 
                  />
                  <span class="text-xs text-slate-300">Days</span>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 uppercase mb-1">Follow-up Date</label>
                <p class="text-xs font-mono font-bold text-teal-400 pt-1.5">
                  {new Date(Date.now() + followupDays * 86400000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Dietary / Lifestyle Advice</label>
              <input 
                type="text" 
                value={dietAdvice}
                onChange={(e) => setDietAdvice(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: E-Prescription Prescriber Matrix (7 cols) */}
        <div class="lg:col-span-7 glass-card p-6 rounded-2xl space-y-5">
          
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-bold font-serif text-teal-400">℞</span>
              <div>
                <h3 class="text-base font-extrabold text-white">Prescribed Medications</h3>
                <p class="text-xs text-slate-400">{prescribedMeds.length} drugs in current prescription</p>
              </div>
            </div>

            {/* Quick 1-Click Treatment Kits */}
            <div class="flex items-center gap-2">
              {RX_PRESET_TEMPLATES.map((tmpl, idx) => (
                <button 
                  key={idx}
                  onClick={() => applyPresetTemplate(tmpl)}
                  class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-bold rounded-lg border border-slate-700 flex items-center gap-1"
                >
                  <Sparkles class="w-3 h-3 text-teal-400" />
                  <span>{tmpl.name.split(' ')[0]} Kit</span>
                </button>
              ))}
            </div>
          </div>

          {/* List of Prescribed Medicines */}
          <div class="space-y-3">
            {prescribedMeds.map((med, idx) => (
              <div 
                key={idx}
                class="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div class="flex items-center gap-3">
                  <span class="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded">
                    {med.form}
                  </span>
                  <div>
                    <h4 class="text-xs font-bold text-white">{med.drug_name}</h4>
                    <p class="text-[11px] text-slate-400">{med.instructions}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2 text-xs font-mono">
                  <span class="px-2 py-1 bg-slate-900 text-teal-400 font-bold rounded-lg border border-slate-800">
                    {med.dosage_pattern}
                  </span>
                  <span class="px-2 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-800">
                    {med.timing.replace('_', ' ')}
                  </span>
                  <span class="px-2 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-800">
                    {med.duration}
                  </span>
                  <button 
                    onClick={() => handleRemoveMed(idx)}
                    class="p-1 text-slate-500 hover:text-rose-400 ml-1 rounded"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Medicine Interactive Row */}
          <div class="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3">
            <p class="text-xs font-bold text-slate-300 uppercase tracking-wider">+ Add Medicine to Rx</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="sm:col-span-2">
                <input 
                  type="text" 
                  placeholder="Type or select drug (e.g. Dolo 650, Augmentin, Pantocid)..." 
                  value={newDrug.drug_name}
                  onChange={(e) => setNewDrug({ ...newDrug, drug_name: e.target.value })}
                  list="medicine-options"
                  class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-400"
                />
                <datalist id="medicine-options">
                  {medicines.map(m => (
                    <option key={m.id} value={m.brand_name}>{m.generic_name} ({m.form})</option>
                  ))}
                </datalist>
              </div>

              <div>
                <CustomSelect
                  options={[
                    { value: 'TABLET', label: 'Tablet', badge: 'TAB' },
                    { value: 'SYRUP', label: 'Syrup', badge: 'SYP' },
                    { value: 'CAPSULE', label: 'Capsule', badge: 'CAP' },
                    { value: 'INJECTION', label: 'Injection', badge: 'INJ' },
                    { value: 'DROPS', label: 'Drops', badge: 'DRP' },
                    { value: 'OINTMENT', label: 'Ointment', badge: 'OINT' },
                    { value: 'CONSUMABLE', label: 'Consumable', badge: 'CON' }
                  ]}
                  value={newDrug.form}
                  onChange={(form) => setNewDrug({ ...newDrug, form })}
                  size="sm"
                />
              </div>
            </div>

            {/* Dosage Pattern Buttons */}
            <div class="space-y-1.5">
              <label class="block text-[10px] text-slate-400 uppercase font-semibold">Dosage Frequency Preset:</label>
              <div class="flex flex-wrap gap-1.5">
                {['1-0-1', '1-1-1', '0-0-1', '1-0-0', '0-1-0', 'SOS (As Needed)'].map((pattern) => (
                  <button 
                    key={pattern}
                    type="button"
                    onClick={() => setNewDrug({ ...newDrug, dosage_pattern: pattern })}
                    class={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      newDrug.dosage_pattern === pattern 
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md' 
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Timing & Duration */}
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <CustomSelect
                  options={[
                    { value: 'AFTER_FOOD', label: 'After Meal 🍽️' },
                    { value: 'BEFORE_FOOD', label: 'Before Meal (Empty Stomach) 🥣' },
                    { value: 'WITH_FOOD', label: 'With Meal 🍲' },
                    { value: 'AT_BEDTIME', label: 'At Bedtime 🌙' }
                  ]}
                  value={newDrug.timing}
                  onChange={(timing) => setNewDrug({ ...newDrug, timing })}
                  size="sm"
                />
              </div>

              <div>
                <CustomSelect
                  options={[
                    { value: '3 Days', label: '3 Days' },
                    { value: '5 Days', label: '5 Days' },
                    { value: '7 Days', label: '7 Days' },
                    { value: '10 Days', label: '10 Days' },
                    { value: '15 Days', label: '15 Days' },
                    { value: '1 Month', label: '1 Month' }
                  ]}
                  value={newDrug.duration}
                  onChange={(duration) => setNewDrug({ ...newDrug, duration })}
                  size="sm"
                />
              </div>

              <div class="col-span-2 sm:col-span-1">
                <button 
                  type="button"
                  onClick={handleAddMed}
                  class="w-full py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>+ Add Drug</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div class="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button 
              onClick={() => setIsPrintModalOpen(true)}
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
            >
              <Printer class="w-3.5 h-3.5 text-teal-400" />
              <span>Preview / Print Rx</span>
            </button>

            <button 
              onClick={handleCompletePrescription}
              class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              <span>Save & Complete Consultation</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Prescription Printable Modal */}
      <RxPrintModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        rxData={savedRx || {
          doctor_name: activeDoctor?.name,
          chief_complaints: selectedComplaints,
          diagnosis: [selectedDiagnosis],
          medicines: prescribedMeds,
          lab_tests_recommended: labTests,
          dietary_advice: dietAdvice,
          followup_date: new Date(Date.now() + followupDays * 86400000).toLocaleDateString()
        }}
        patient={activeToken?.patient}
        vitals={vitals}
      />
    </div>
  );
};
