import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  Activity, 
  Stethoscope, 
  Clock, 
  Cloud, 
  CloudOff, 
  Settings, 
  UserCheck, 
  PlusCircle, 
  FileText, 
  ShoppingBag, 
  BarChart3, 
  Users 
} from 'lucide-react';

import { CustomSelect } from './CustomSelect';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { clinic, doctors, activeDoctor, setActiveDoctor, isCloudConnected, setIsSettingsOpen } = useClinic();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const doctorOptions = doctors.map(doc => ({
    value: doc.id,
    label: `${doc.name} (${doc.room_no || 'OPD'})`,
    subtext: `${doc.specialization} • Fee: ₹${doc.consultation_fee}`
  }));

  const navItems = [
    { id: 'opd', label: 'OPD Queue', icon: Activity, badge: 'Live' },
    { id: 'doctor', label: 'Doctor Desk (Rx)', icon: Stethoscope },
    { id: 'billing', label: 'POS Billing', icon: FileText },
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: ShoppingBag },
    { id: 'patients', label: 'Patient CRM', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header class="sticky top-0 z-30 mb-6 max-w-7xl mx-auto px-4 sm:px-6 pt-4">
      <div class="glass-card rounded-2xl p-3 sm:px-5 sm:py-3.5 flex flex-wrap items-center justify-between gap-4 border border-slate-800 shadow-2xl">
        
        {/* Brand & Clinic Logo */}
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/25">
            <Activity class="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-lg font-extrabold tracking-tight text-white">MediFlow<span class="text-teal-400">.OS</span></h1>
              <span class="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">CLINIC ERP</span>
            </div>
            <p class="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">{clinic?.name || 'Apex Specialty Clinic'}</p>
          </div>
        </div>

        {/* Doctor Selector & Live Clock */}
        <div class="hidden lg:flex items-center gap-4 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <div class="flex items-center gap-2 text-xs min-w-[240px]">
            <CustomSelect
              options={doctorOptions}
              value={activeDoctor?.id || ''}
              onChange={(docId) => {
                const doc = doctors.find(d => d.id === docId);
                if (doc) setActiveDoctor(doc);
              }}
              icon={UserCheck}
              placeholder="Select Doctor"
              size="sm"
              buttonClassName="bg-transparent border-transparent hover:bg-slate-900/80"
              menuClassName="min-w-[280px]"
            />
          </div>

          <div class="h-4 w-px bg-slate-800"></div>

          <div class="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
            <Clock class="w-3.5 h-3.5 text-slate-400" />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        </div>

        {/* Supabase Connection Status Pill & Settings */}
        <div class="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            class={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
              isCloudConnected 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            {isCloudConnected ? <Cloud class="w-3.5 h-3.5 text-emerald-400" /> : <CloudOff class="w-3.5 h-3.5 text-amber-400" />}
            <span>{isCloudConnected ? 'Supabase Connected' : 'Connect Supabase'}</span>
          </button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            class="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
            title="Clinic & Supabase Settings"
          >
            <Settings class="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav class="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              class={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25' 
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
              }`}
            >
              <Icon class={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span class={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded-full ${
                  isActive ? 'bg-slate-950 text-teal-400' : 'bg-teal-500/20 text-teal-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
