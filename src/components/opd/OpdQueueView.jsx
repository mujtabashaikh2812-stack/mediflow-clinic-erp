import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { PatientRegistrationModal } from './PatientRegistrationModal';
import { 
  UserPlus, 
  Search, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Stethoscope, 
  CreditCard, 
  Filter,
  Volume2
} from 'lucide-react';

export const OpdQueueView = ({ onNavigateToDoctor, onNavigateToBilling }) => {
  const { tokens, patients, doctors, updateTokenState, setActiveToken, showToast } = useClinic();
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const waitingCount = tokens.filter(t => t.status === 'WAITING').length;
  const inDoctorCount = tokens.filter(t => t.status === 'WITH_DOCTOR').length;
  const completedCount = tokens.filter(t => t.status === 'COMPLETED').length;

  const filteredTokens = tokens.filter(tok => {
    const matchesSearch = 
      tok.patient?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tok.patient?.phone?.includes(searchQuery) ||
      tok.patient?.uhid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(tok.token_number) === searchQuery;

    if (!matchesSearch) return false;
    if (filterStatus === 'ALL') return true;
    return tok.status === filterStatus;
  });

  const handleStartConsultation = (tok) => {
    updateTokenState(tok.id, 'WITH_DOCTOR');
    setActiveToken(tok);
    showToast(`Token #${tok.token_number} (${tok.patient?.full_name}) called into Doctor Cabin!`, 'info');
    onNavigateToDoctor && onNavigateToDoctor(tok);
  };

  return (
    <div class="space-y-6">
      
      {/* Top Stat Summary Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tokens Today</p>
          <p class="text-3xl font-extrabold text-white mt-1 font-mono">{tokens.length}</p>
          <p class="text-xs text-emerald-400 mt-2">Active OPD Session</p>
        </div>

        <div class="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Waiting Room</p>
          <p class="text-3xl font-extrabold text-amber-400 mt-1 font-mono">{waitingCount}</p>
          <p class="text-xs text-slate-400 mt-2">Average wait: ~10 mins</p>
        </div>

        <div class="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Doctor Cabin</p>
          <p class="text-3xl font-extrabold text-teal-300 mt-1 font-mono">{inDoctorCount}</p>
          <p class="text-xs text-slate-400 mt-2">Active Consultation</p>
        </div>

        <div class="glass-card p-5 rounded-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Consults</p>
          <p class="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{completedCount}</p>
          <p class="text-xs text-slate-400 mt-2">Prescribed & Billed</p>
        </div>
      </div>

      {/* Main OPD Board & Queue Controls */}
      <div class="glass-card p-6 rounded-2xl space-y-6">
        
        {/* Action Header & Search */}
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <span>🎫 Live OPD Token Queue</span>
              <span class="px-2 py-0.5 text-xs bg-teal-500/20 text-teal-300 rounded-full font-bold">Realtime</span>
            </h2>
            <p class="text-xs text-slate-400">Reception triage & patient token calling board</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div class="relative min-w-[240px]">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search patient, phone, UHID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Filter Pills */}
            <div class="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button 
                onClick={() => setFilterStatus('ALL')}
                class={`px-3 py-1 rounded-lg font-semibold transition-all ${filterStatus === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All ({tokens.length})
              </button>
              <button 
                onClick={() => setFilterStatus('WAITING')}
                class={`px-3 py-1 rounded-lg font-semibold transition-all ${filterStatus === 'WAITING' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
              >
                Waiting ({waitingCount})
              </button>
              <button 
                onClick={() => setFilterStatus('WITH_DOCTOR')}
                class={`px-3 py-1 rounded-lg font-semibold transition-all ${filterStatus === 'WITH_DOCTOR' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400 hover:text-white'}`}
              >
                In Cabin ({inDoctorCount})
              </button>
            </div>

            {/* New Patient Registration Button */}
            <button 
              onClick={() => setIsRegModalOpen(true)}
              class="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
            >
              <UserPlus class="w-4 h-4" />
              <span>+ Issue New Token</span>
            </button>
          </div>
        </div>

        {/* Tokens List */}
        {filteredTokens.length === 0 ? (
          <div class="text-center py-12 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Clock class="w-6 h-6" />
            </div>
            <p class="text-sm font-semibold text-slate-300">No patients found in queue</p>
            <button 
              onClick={() => setIsRegModalOpen(true)}
              class="text-xs text-teal-400 font-bold hover:underline"
            >
              + Register a walk-in patient now
            </button>
          </div>
        ) : (
          <div class="space-y-3">
            {filteredTokens.map(tok => {
              const isWaiting = tok.status === 'WAITING';
              const isInCabin = tok.status === 'WITH_DOCTOR';
              const isCompleted = tok.status === 'COMPLETED';
              const hasAllergies = tok.patient?.allergies && tok.patient.allergies.length > 0;

              return (
                <div 
                  key={tok.id}
                  class={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 relative overflow-hidden transition-all ${
                    isInCabin 
                      ? 'bg-teal-950/40 border-teal-500/50 shadow-lg shadow-teal-950/40' 
                      : isWaiting 
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-950/40 border-slate-900 opacity-75'
                  }`}
                >
                  {/* Left Indicator Strip */}
                  <div class={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isInCabin ? 'bg-teal-400' : isWaiting ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}></div>

                  {/* Token Number & Patient Details */}
                  <div class="flex items-center gap-4 pl-2">
                    <div class={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border font-mono ${
                      isInCabin 
                        ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' 
                        : isWaiting 
                          ? 'bg-slate-800 border-slate-700 text-amber-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <span class="text-[9px] font-bold uppercase">TOKEN</span>
                      <span class="text-lg font-extrabold">#{tok.token_number}</span>
                    </div>

                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-bold text-white text-sm">{tok.patient?.full_name || 'Walk-in Patient'}</h3>
                        <span class="text-xs text-slate-400 font-mono">({tok.patient?.age} {tok.patient?.gender?.charAt(0)})</span>
                        
                        {/* Status Chip */}
                        {isInCabin && (
                          <span class="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-full animate-pulse flex items-center gap-1">
                            ● IN DOCTOR CABIN
                          </span>
                        )}
                        {isWaiting && (
                          <span class="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 rounded-full">
                            Waiting
                          </span>
                        )}
                        {isCompleted && (
                          <span class="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded-full flex items-center gap-1">
                            <CheckCircle2 class="w-3 h-3" /> Completed
                          </span>
                        )}

                        {/* Allergy Warning Alert */}
                        {hasAllergies && (
                          <span class="px-2 py-0.5 text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/50 rounded-full flex items-center gap-1">
                            <AlertTriangle class="w-3 h-3 text-rose-400" />
                            ALLERGIC: {tok.patient.allergies.join(', ')}
                          </span>
                        )}
                      </div>

                      <div class="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span>UHID: <span class="text-slate-300">{tok.patient?.uhid || 'MF-2026'}</span></span>
                        <span>•</span>
                        <span>Ph: {tok.patient?.phone}</span>
                        <span>•</span>
                        <span class="text-slate-300">{tok.doctor_name || 'General OPD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div class="flex items-center gap-2">
                    {isWaiting && (
                      <button 
                        onClick={() => handleStartConsultation(tok)}
                        class="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                      >
                        <Stethoscope class="w-3.5 h-3.5" />
                        <span>Call into Cabin</span>
                      </button>
                    )}

                    {isInCabin && (
                      <button 
                        onClick={() => onNavigateToDoctor && onNavigateToDoctor(tok)}
                        class="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
                      >
                        <span>Open Rx Prescriber</span>
                        <ArrowRight class="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button 
                      onClick={() => onNavigateToBilling && onNavigateToBilling(tok)}
                      class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 flex items-center gap-1"
                    >
                      <CreditCard class="w-3.5 h-3.5 text-teal-400" />
                      <span>POS Bill</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Patient Registration Modal */}
      <PatientRegistrationModal 
        isOpen={isRegModalOpen} 
        onClose={() => setIsRegModalOpen(false)} 
      />
    </div>
  );
};
