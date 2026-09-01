import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CreditCard, 
  Stethoscope, 
  PieChart 
} from 'lucide-react';

export const AnalyticsView = () => {
  const { invoices, tokens, doctors } = useClinic();

  const totalRevenue = invoices.reduce((sum, inv) => sum + (Number(inv.grand_total) || 0), 0);
  const upiRevenue = invoices.filter(i => i.payment_mode === 'UPI').reduce((s, i) => s + (Number(i.grand_total) || 0), 0);
  const cashRevenue = invoices.filter(i => i.payment_mode === 'CASH').reduce((s, i) => s + (Number(i.grand_total) || 0), 0);

  return (
    <div class="space-y-4 sm:space-y-6">
      
      {/* Top Stat Cards */}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div class="glass-card p-3.5 sm:p-5 rounded-2xl relative overflow-hidden">
          <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
          <p class="text-xl sm:text-3xl font-extrabold text-teal-400 mt-1 font-mono">₹ {totalRevenue.toFixed(2)}</p>
          <div class="flex items-center gap-1 text-[10px] sm:text-xs text-emerald-400 mt-1 sm:mt-2 font-semibold">
            <TrendingUp class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>+18.4% this week</span>
          </div>
        </div>

        <div class="glass-card p-3.5 sm:p-5 rounded-2xl relative overflow-hidden">
          <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Patients Seen</p>
          <p class="text-xl sm:text-3xl font-extrabold text-white mt-1 font-mono">{tokens.length}</p>
          <p class="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">Walk-ins + Queue</p>
        </div>

        <div class="glass-card p-3.5 sm:p-5 rounded-2xl relative overflow-hidden">
          <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">UPI / QR Share</p>
          <p class="text-xl sm:text-3xl font-extrabold text-sky-400 mt-1 font-mono">
            ₹ {upiRevenue.toFixed(2)}
          </p>
          <p class="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">Digital Settlement</p>
        </div>

        <div class="glass-card p-3.5 sm:p-5 rounded-2xl relative overflow-hidden">
          <p class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">Counter Cash</p>
          <p class="text-xl sm:text-3xl font-extrabold text-amber-400 mt-1 font-mono">
            ₹ {cashRevenue.toFixed(2)}
          </p>
          <p class="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">Cash Drawer</p>
        </div>
      </div>

      {/* Analytics Charts & Doctor Performance */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Doctor Performance & Payouts */}
        <div class="glass-card p-4 sm:p-6 rounded-2xl space-y-3 sm:space-y-4">
          <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Stethoscope class="w-4 h-4 text-teal-400" />
            <span>Doctor Performance & OPD Payouts</span>
          </h3>

          <div class="space-y-2.5 sm:space-y-3">
            {doctors.map(doc => (
              <div key={doc.id} class="p-3 sm:p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div class="flex justify-between items-center text-xs">
                  <div>
                    <h4 class="font-bold text-white text-xs">{doc.name}</h4>
                    <p class="text-[10px] sm:text-[11px] text-slate-400">{doc.specialization} • Fee: ₹{doc.consultation_fee}</p>
                  </div>
                  <span class="text-right font-mono font-bold text-emerald-400 text-xs sm:text-sm">
                    ₹ 12,800.00
                  </span>
                </div>
                
                {/* Progress bar */}
                <div class="w-full bg-slate-900 rounded-full h-1.5 sm:h-2">
                  <div class="bg-gradient-to-r from-teal-500 to-emerald-400 h-1.5 sm:h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performed Procedures */}
        <div class="glass-card p-4 sm:p-6 rounded-2xl space-y-3 sm:space-y-4">
          <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <PieChart class="w-4 h-4 text-teal-400" />
            <span>Top Clinical Procedures & Services</span>
          </h3>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center p-2.5 sm:p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span class="font-bold text-white truncate pr-2">12-Lead ECG</span>
              <span class="font-mono text-teal-400 font-bold whitespace-nowrap">14 (₹ 4,900)</span>
            </div>
            <div class="flex justify-between items-center p-2.5 sm:p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span class="font-bold text-white truncate pr-2">Nebulization Treatment</span>
              <span class="font-mono text-teal-400 font-bold whitespace-nowrap">22 (₹ 3,300)</span>
            </div>
            <div class="flex justify-between items-center p-2.5 sm:p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <span class="font-bold text-white truncate pr-2">Sterile Wound Dressing</span>
              <span class="font-mono text-teal-400 font-bold whitespace-nowrap">11 (₹ 1,650)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
