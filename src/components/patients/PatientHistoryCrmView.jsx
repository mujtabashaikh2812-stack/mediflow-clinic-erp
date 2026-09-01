import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Users, 
  Search, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  Share2, 
  ChevronRight 
} from 'lucide-react';
import { sendWhatsAppPrescription } from '../../services/whatsappService';

export const PatientHistoryCrmView = () => {
  const { patients, clinic, showToast } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patients[0] || null);

  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.uhid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div class="space-y-6">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Patient Search & Directory */}
        <div class="lg:col-span-4 glass-card p-5 rounded-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <Users class="w-4 h-4 text-teal-400" />
              <span>Patient Directory</span>
            </h3>
            <span class="text-xs text-slate-400 font-mono">{patients.length} Registered</span>
          </div>

          <div class="relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by UHID, Name, Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <div class="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredPatients.map(pt => {
              const isSelected = selectedPatient?.id === pt.id;
              const hasAllergies = pt.allergies && pt.allergies.length > 0;

              return (
                <div 
                  key={pt.id}
                  onClick={() => setSelectedPatient(pt)}
                  class={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-teal-950/40 border-teal-500/50 shadow-md' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-bold text-white text-xs">{pt.full_name}</h4>
                      <p class="text-[11px] text-slate-400 font-mono mt-0.5">
                        {pt.age} Y / {pt.gender?.charAt(0)} • UHID: {pt.uhid}
                      </p>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400">Ph: {pt.phone}</span>
                  </div>

                  {hasAllergies && (
                    <div class="mt-2">
                      <span class="px-2 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-300 rounded-full">
                        ⚠️ Allergy: {pt.allergies.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Longitudinal Patient Timeline & EMR */}
        <div class="lg:col-span-8 glass-card p-6 rounded-2xl space-y-6">
          {selectedPatient ? (
            <>
              {/* Header Profile Card */}
              <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div class="flex items-center gap-3">
                    <h2 class="text-xl font-extrabold text-white">{selectedPatient.full_name}</h2>
                    <span class="px-2.5 py-0.5 text-xs bg-teal-500/20 text-teal-300 font-mono font-bold rounded-lg border border-teal-500/30">
                      {selectedPatient.uhid}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                    <span>Age: <b class="text-slate-200">{selectedPatient.age} Years</b></span>
                    <span>Gender: <b class="text-slate-200">{selectedPatient.gender}</b></span>
                    <span>Blood: <b class="text-rose-400">{selectedPatient.blood_group || 'O+'}</b></span>
                    <span>Phone: <b class="text-slate-200">{selectedPatient.phone}</b></span>
                  </div>
                </div>

                <button 
                  onClick={() => showToast('Opening WhatsApp Reminder window', 'info')}
                  class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Share2 class="w-3.5 h-3.5" />
                  <span>Send WhatsApp Follow-up</span>
                </button>
              </div>

              {/* Allergy & Chronic Condition Callouts */}
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl">
                  <span class="text-[10px] font-bold text-rose-300 uppercase block mb-1">Registered Drug Allergies</span>
                  <p class="text-xs text-rose-200 font-semibold">
                    {selectedPatient.allergies?.length > 0 ? selectedPatient.allergies.join(', ') : 'No known drug allergies'}
                  </p>
                </div>

                <div class="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span class="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chronic Conditions</span>
                  <p class="text-xs text-slate-200 font-semibold">
                    {selectedPatient.chronic_conditions?.length > 0 ? selectedPatient.chronic_conditions.join(', ') : 'None logged'}
                  </p>
                </div>
              </div>

              {/* Clinical Timeline & Past Visits */}
              <div class="space-y-4 pt-2">
                <h3 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Longitudinal Clinical History</h3>

                <div class="space-y-3">
                  <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                    <div class="flex justify-between items-center text-xs">
                      <span class="font-bold text-teal-300">OPD Consultation • Dr. Ananya Sharma</span>
                      <span class="text-slate-400 font-mono">14 Days Ago (18 Aug 2026)</span>
                    </div>
                    <p class="text-xs text-slate-300"><b>Diagnosis:</b> Acute Viral Upper Respiratory Infection</p>
                    <p class="text-xs text-slate-400"><b>Prescribed:</b> Dolo 650 (1-0-1), Ascoril-D Plus Syrup (1-1-1)</p>
                    <div class="flex items-center gap-3 pt-1 text-[11px] text-teal-400 font-mono font-semibold">
                      <span>BP: 120/80 mmHg</span>
                      <span>•</span>
                      <span>SpO2: 99%</span>
                      <span>•</span>
                      <span>Billed: ₹ 430.00 (PAID)</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div class="text-center py-16 text-slate-400 text-xs">
              Select a patient from the left directory to view full medical history
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
