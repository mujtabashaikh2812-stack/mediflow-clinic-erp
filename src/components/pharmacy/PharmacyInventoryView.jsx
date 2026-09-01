import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { 
  ShoppingBag, 
  AlertTriangle, 
  Plus, 
  Search, 
  Calendar, 
  Package, 
  CheckCircle, 
  TrendingDown, 
  ArrowUpRight 
} from 'lucide-react';

export const PharmacyInventoryView = () => {
  const { medicines, showToast } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDrugName, setNewDrugName] = useState('');
  const [newGeneric, setNewGeneric] = useState('');
  const [newForm, setNewForm] = useState('TABLET');
  const [newStock, setNewStock] = useState(100);
  const [newMrp, setNewMrp] = useState(50);
  const [newExpiry, setNewExpiry] = useState('2027-12-31');

  // Filter medicines
  const filteredMeds = medicines.filter(m => 
    m.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.generic_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div class="space-y-6">
      
      {/* Expiry Warning Radar Banner */}
      <div class="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-amber-300">Near-Expiry Warning Radar (FIFO Priority)</h4>
            <p class="text-xs text-slate-300">Batches expiring within 60-90 days are highlighted below for prioritized dispensing.</p>
          </div>
        </div>

        <button 
          onClick={() => showToast('Filtered near-expiry batches', 'info')}
          class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
        >
          View 2 Expiring Batches
        </button>
      </div>

      {/* Main Pharmacy Inventory Table / Cards */}
      <div class="glass-card p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-5">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag class="w-5 h-5 text-teal-400" />
              <span>In-House Pharmacy & Batch Inventory</span>
            </h3>
            <p class="text-[11px] sm:text-xs text-slate-400">Direct atomic stock depletion on prescription billing</p>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            <div class="relative w-full sm:min-w-[220px]">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search drug or generic..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <button 
              onClick={() => showToast('Stock batch update modal opened', 'info')}
              class="w-full sm:w-auto justify-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Plus class="w-4 h-4" />
              <span>+ Add Medicine Batch</span>
            </button>
          </div>
        </div>

        {/* Mobile View: Responsive Cards (< sm) */}
        <div class="sm:hidden space-y-2.5">
          {filteredMeds.map((med) => {
            const batch = med.batches?.[0] || { batch_number: 'BT-101', expiry_date: '2027-12-31', mrp: 50, purchase_rate: 30 };
            const isLowStock = (med.total_stock || 0) < (med.reorder_level || 20);
            const isNearExpiry = batch.expiry_date && batch.expiry_date.startsWith('2026-10');

            return (
              <div key={med.id} class="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <h4 class="font-bold text-white text-xs">{med.brand_name}</h4>
                      <span class="px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded font-semibold text-[9px]">
                        {med.form}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-0.5">{med.generic_name} ({med.strength || ''})</p>
                  </div>

                  {isNearExpiry ? (
                    <span class="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[9px] font-bold">
                      Near Expiry
                    </span>
                  ) : isLowStock ? (
                    <span class="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full text-[9px] font-bold">
                      Low Stock
                    </span>
                  ) : (
                    <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[9px] font-bold">
                      In Stock
                    </span>
                  )}
                </div>

                <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-800/80">
                  <div>
                    <span class="text-slate-500 block text-[9px] uppercase">Batch / Expiry</span>
                    <span class="text-slate-300">{batch.batch_number} • {batch.expiry_date}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-slate-500 block text-[9px] uppercase">Stock / MRP</span>
                    <span class={`font-bold ${isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>{med.total_stock || 0} units</span>
                    <span class="text-slate-400 text-[10px]"> (₹{batch.mrp})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View (>= sm) */}
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead class="text-slate-400 bg-slate-950 uppercase font-semibold">
              <tr>
                <th class="px-4 py-3 rounded-l-xl">Drug & Generic</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Batch Code</th>
                <th class="px-4 py-3">Expiry Date</th>
                <th class="px-4 py-3">Stock Available</th>
                <th class="px-4 py-3">MRP / Cost</th>
                <th class="px-4 py-3 rounded-r-xl text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 font-mono">
              {filteredMeds.map((med) => {
                const batch = med.batches?.[0] || { batch_number: 'BT-101', expiry_date: '2027-12-31', mrp: 50, purchase_rate: 30 };
                const isLowStock = (med.total_stock || 0) < (med.reorder_level || 20);
                const isNearExpiry = batch.expiry_date && batch.expiry_date.startsWith('2026-10');

                return (
                  <tr key={med.id} class="hover:bg-slate-800/40 transition-colors">
                    <td class="px-4 py-3.5 font-sans">
                      <p class="font-bold text-white text-xs">{med.brand_name}</p>
                      <p class="text-[11px] text-slate-400">{med.generic_name} ({med.strength || ''})</p>
                    </td>
                    <td class="px-4 py-3.5">
                      <span class="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded font-semibold text-[10px]">
                        {med.form}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-slate-300 font-bold">{batch.batch_number}</td>
                    <td class="px-4 py-3.5">
                      <span class={isNearExpiry ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {batch.expiry_date}
                      </span>
                    </td>
                    <td class="px-4 py-3.5">
                      <span class={`font-bold ${isLowStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {med.total_stock || 0} units
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-slate-300">
                      ₹{batch.mrp} / <span class="text-slate-500">₹{batch.purchase_rate}</span>
                    </td>
                    <td class="px-4 py-3.5 text-right font-sans">
                      {isNearExpiry ? (
                        <span class="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold">
                          Near Expiry
                        </span>
                      ) : isLowStock ? (
                        <span class="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-bold">
                          Low Stock
                        </span>
                      ) : (
                        <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold">
                          Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
