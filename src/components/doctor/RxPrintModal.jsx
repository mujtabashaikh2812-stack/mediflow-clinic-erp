import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Printer, X, Share2 } from 'lucide-react';
import { sendWhatsAppPrescription } from '../../services/whatsappService';

export const RxPrintModal = ({ isOpen, onClose, rxData, patient, vitals }) => {
  const { clinic, activeDoctor } = useClinic();
  if (!isOpen || !rxData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    sendWhatsAppPrescription(patient?.phone, patient?.full_name, rxData, clinic);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="glass-card max-w-3xl w-full rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Modal Controls Top Bar */}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm sm:text-base font-bold text-white">Prescription Preview & Print</h3>
            <button 
              onClick={onClose}
              class="sm:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button 
              onClick={handleWhatsApp}
              class="flex-1 sm:flex-none justify-center px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Share2 class="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={handlePrint}
              class="flex-1 sm:flex-none justify-center px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Print (A4/A5)</span>
            </button>
            <button 
              onClick={onClose}
              class="hidden sm:inline text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 ml-2"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Document Area */}
        <div class="printable-area bg-white text-slate-900 p-8 rounded-xl shadow-inner font-sans text-xs border border-slate-300">
          
          {/* Clinic & Doctor Header */}
          <div class="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-4">
            <div>
              <h1 class="text-xl font-extrabold text-teal-800 tracking-tight">{clinic?.name || 'APEX SPECIALTY CLINIC'}</h1>
              <p class="text-slate-600 font-medium">{clinic?.tagline || 'Modern Multi-Specialty Health Care'}</p>
              <p class="text-[11px] text-slate-500 mt-1">{clinic?.address?.line1}, {clinic?.address?.city} • Ph: {clinic?.phone}</p>
            </div>
            <div class="text-right">
              <h2 class="text-sm font-bold text-slate-900">{rxData.doctor_name || activeDoctor?.name || 'Dr. Ananya Sharma'}</h2>
              <p class="text-[11px] text-slate-600">{activeDoctor?.qualification || 'MBBS, MD'}</p>
              <p class="text-[11px] text-slate-600">{activeDoctor?.specialization || 'General Physician'}</p>
              <p class="text-[10px] text-slate-500 font-mono">Reg No: {activeDoctor?.registration_no || 'MCI-2018-88902'}</p>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 font-mono text-[11px]">
            <div>
              <span class="text-slate-500">Patient:</span> <b class="text-slate-900">{patient?.full_name}</b>
            </div>
            <div>
              <span class="text-slate-500">Age / Gender:</span> <b class="text-slate-900">{patient?.age} Y / {patient?.gender}</b>
            </div>
            <div>
              <span class="text-slate-500">UHID:</span> <b class="text-slate-900">{patient?.uhid}</b>
            </div>
            <div>
              <span class="text-slate-500">Date:</span> <b class="text-slate-900">{new Date().toLocaleDateString()}</b>
            </div>
          </div>

          {/* Vitals Summary Bar */}
          {vitals && (
            <div class="flex flex-wrap gap-4 p-2.5 bg-teal-50/50 rounded-lg border border-teal-100 mb-4 text-[11px]">
              {vitals.bp_systolic && <div><span class="text-slate-500">BP:</span> <b>{vitals.bp_systolic}/{vitals.bp_diastolic} mmHg</b></div>}
              {vitals.pulse_bpm && <div><span class="text-slate-500">Pulse:</span> <b>{vitals.pulse_bpm} bpm</b></div>}
              {vitals.spo2_percent && <div><span class="text-slate-500">SpO2:</span> <b>{vitals.spo2_percent}%</b></div>}
              {vitals.temp_f && <div><span class="text-slate-500">Temp:</span> <b>{vitals.temp_f} °F</b></div>}
              {vitals.weight_kg && <div><span class="text-slate-500">Weight:</span> <b>{vitals.weight_kg} kg</b></div>}
            </div>
          )}

          {/* Clinical Findings & Diagnosis */}
          <div class="space-y-2 mb-5">
            {rxData.chief_complaints?.length > 0 && (
              <div>
                <span class="font-bold text-slate-700">Chief Complaints: </span>
                <span class="text-slate-800">{Array.isArray(rxData.chief_complaints) ? rxData.chief_complaints.join(', ') : rxData.chief_complaints}</span>
              </div>
            )}
            {rxData.diagnosis?.length > 0 && (
              <div>
                <span class="font-bold text-slate-700">Diagnosis: </span>
                <span class="text-slate-900 font-semibold">{Array.isArray(rxData.diagnosis) ? rxData.diagnosis.join(', ') : rxData.diagnosis}</span>
              </div>
            )}
          </div>

          {/* Prescription Medicine Table (Rx Symbol) */}
          <div class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xl font-bold font-serif text-teal-800">℞</span>
              <span class="font-extrabold uppercase tracking-wider text-slate-800 text-xs">Prescribed Medications</span>
            </div>

            <table class="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr class="bg-slate-100 text-slate-700">
                  <th class="border border-slate-300 p-2 text-left">#</th>
                  <th class="border border-slate-300 p-2 text-left">Medicine Name & Form</th>
                  <th class="border border-slate-300 p-2 text-center">Dosage Frequency</th>
                  <th class="border border-slate-300 p-2 text-center">Timing</th>
                  <th class="border border-slate-300 p-2 text-center">Duration</th>
                  <th class="border border-slate-300 p-2 text-left">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {(rxData.medicines || []).map((med, idx) => (
                  <tr key={idx} class="border-b border-slate-200">
                    <td class="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                    <td class="border border-slate-300 p-2">
                      <b>{med.drug_name}</b> <span class="text-slate-500 font-mono text-[10px]">[{med.form}]</span>
                    </td>
                    <td class="border border-slate-300 p-2 text-center font-mono font-bold text-teal-800">{med.dosage_pattern}</td>
                    <td class="border border-slate-300 p-2 text-center">{med.timing?.replace('_', ' ')}</td>
                    <td class="border border-slate-300 p-2 text-center font-mono">{med.duration}</td>
                    <td class="border border-slate-300 p-2 text-slate-600">{med.instructions || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice & Tests */}
          <div class="grid grid-cols-2 gap-4 mb-8 pt-2">
            <div>
              <p class="font-bold text-slate-700 mb-1">Investigations / Tests Advised:</p>
              <p class="text-slate-800">{rxData.lab_tests_recommended?.join(', ') || 'None'}</p>
            </div>
            <div>
              <p class="font-bold text-slate-700 mb-1">Dietary & Lifestyle Advice:</p>
              <p class="text-slate-800">{rxData.dietary_advice || 'Drink plenty of fluids, rest adequately.'}</p>
            </div>
          </div>

          {/* Doctor Signature & Follow-up Footer */}
          <div class="flex justify-between items-end border-t border-slate-300 pt-6">
            <div>
              <p class="text-slate-500 text-[11px]">Follow-up Date: <b class="text-slate-900">{rxData.followup_date || 'Within 7 Days'}</b></p>
              <p class="text-[10px] text-slate-400 mt-1">Generated via MediFlow Medical OS</p>
            </div>
            <div class="text-center">
              <div class="h-10 border-b border-slate-400 w-40 mb-1"></div>
              <p class="font-bold text-slate-800">{activeDoctor?.name || 'Dr. Ananya Sharma'}</p>
              <p class="text-[10px] text-slate-500">Doctor's Signature / Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
