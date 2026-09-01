import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { apiCreateInvoice } from '../../services/apiService';
import { triggerThermalPrint } from '../../services/thermalPrintService';
import { sendWhatsAppInvoice } from '../../services/whatsappService';
import { CustomSelect } from '../common/CustomSelect';
import { 
  CreditCard, 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  Share2, 
  QrCode, 
  DollarSign, 
  Percent, 
  Check, 
  Sparkles,
  User
} from 'lucide-react';

export const BillingPosView = () => {
  const { clinic, doctors, activeDoctor, tokens, patients, procedures, medicines, showToast, triggerConfetti } = useClinic();

  const [selectedTokenId, setSelectedTokenId] = useState('');
  const [selectedPatientUhid, setSelectedPatientUhid] = useState('');
  const [patientName, setPatientName] = useState('Walk-in Patient');
  const [patientPhone, setPatientPhone] = useState('');

  // Bill Line Items
  const [lineItems, setLineItems] = useState([
    { id: '1', name: 'Doctor Consultation Fee', qty: 1, unit_price: activeDoctor?.consultation_fee || 400, total_amount: activeDoctor?.consultation_fee || 400 }
  ]);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [lastInvoice, setLastInvoice] = useState(null);

  // Handle selecting a token from queue
  const handleSelectToken = (tokenId) => {
    setSelectedTokenId(tokenId);
    const tok = tokens.find(t => t.id === tokenId);
    if (tok && tok.patient) {
      setSelectedPatientUhid(tok.patient.uhid);
      setPatientName(tok.patient.full_name);
      setPatientPhone(tok.patient.phone || '');
    }
  };

  const handleAddProcedure = (proc) => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: proc.name,
      qty: 1,
      unit_price: proc.rate,
      total_amount: proc.rate
    };
    setLineItems([...lineItems, newItem]);
    showToast(`Added ${proc.name}!`, 'info');
  };

  const handleAddMedicine = (med) => {
    const defaultBatch = med.batches?.[0];
    const rate = defaultBatch ? defaultBatch.mrp : 50;
    const newItem = {
      id: `item-${Date.now()}`,
      name: `${med.brand_name} (${med.form})`,
      qty: 1,
      unit_price: rate,
      total_amount: rate
    };
    setLineItems([...lineItems, newItem]);
    showToast(`Added ${med.brand_name}!`, 'info');
  };

  const handleUpdateQty = (idx, newQty) => {
    const updated = [...lineItems];
    const qty = parseInt(newQty) || 1;
    updated[idx].qty = qty;
    updated[idx].total_amount = qty * updated[idx].unit_price;
    setLineItems(updated);
  };

  const handleRemoveItem = (idx) => {
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  // Computations
  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.total_amount) || 0), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount);

  const handleGenerateInvoice = async () => {
    if (lineItems.length === 0) {
      showToast('Please add at least one billed service or medicine', 'error');
      return;
    }

    const payload = {
      patient_uhid: selectedPatientUhid || 'MF-WALKIN',
      patient_name: patientName,
      token_id: selectedTokenId || null,
      doctor_name: activeDoctor?.name || 'Dr. Ananya Sharma',
      line_items: lineItems,
      subtotal,
      discount_amount: discountAmount,
      tax_amount: taxAmount,
      grand_total: grandTotal,
      paid_amount: grandTotal,
      payment_mode: paymentMode
    };

    try {
      const inv = await apiCreateInvoice(payload);
      setLastInvoice(inv);
      triggerConfetti();
      showToast(`Invoice #${inv.invoice_number} created successfully!`, 'success');
      
      // Auto-trigger Thermal Receipt Print
      triggerThermalPrint(inv, clinic);
    } catch (err) {
      showToast('Failed to create invoice', 'error');
    }
  };

  return (
    <div class="space-y-6">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Billing Engine & Service Pickers */}
        <div class="lg:col-span-7 space-y-5">
          
          {/* Patient Header & Token Selection */}
          <div class="glass-card p-5 rounded-2xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard class="w-4 h-4 text-teal-400" />
                <span>Patient Billing Counter</span>
              </h3>
              <span class="px-2 py-0.5 text-xs font-bold bg-teal-500/20 text-teal-300 rounded-full font-mono">
                POS ACTIVE
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Link Queue Token</label>
                <CustomSelect
                  options={[
                    { value: '', label: '-- Direct Walk-in (No Token) --' },
                    ...tokens.map(tok => ({
                      value: tok.id,
                      label: `Token #${tok.token_number} - ${tok.patient?.full_name}`,
                      badge: tok.status,
                      subtext: `UHID: ${tok.patient?.uhid || 'MF'} • Ph: ${tok.patient?.phone || ''}`
                    }))
                  ]}
                  value={selectedTokenId}
                  onChange={(tokId) => handleSelectToken(tokId)}
                  placeholder="Select Token or Direct Walk-in"
                  icon={User}
                  size="md"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Patient Name</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Procedure & Medicine Shortcut Bar */}
          <div class="glass-card p-4 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold text-slate-300 uppercase tracking-wider">Quick Add Clinical Services & Tests</p>
            </div>
            
            <div class="flex flex-wrap gap-1.5">
              {procedures.map(proc => (
                <button
                  key={proc.id}
                  onClick={() => handleAddProcedure(proc)}
                  class="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all"
                >
                  <span>+ {proc.name}</span>
                  <b class="text-teal-400 font-mono">₹{proc.rate}</b>
                </button>
              ))}
            </div>

            <div class="pt-2 border-t border-slate-800">
              <p class="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Quick Add Pharmacy Drugs</p>
              <div class="flex flex-wrap gap-1.5">
                {medicines.map(med => (
                  <button
                    key={med.id}
                    onClick={() => handleAddMedicine(med)}
                    class="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 flex items-center gap-1.5"
                  >
                    <span>+ {med.brand_name}</span>
                    <span class="text-[10px] text-teal-400 font-mono">[{med.form}]</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div class="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
            <h4 class="text-xs font-bold text-white uppercase tracking-wider">Invoice Line Items</h4>
            
            <div class="space-y-2">
              <div class="hidden sm:grid grid-cols-12 text-slate-400 text-xs font-semibold px-3 py-1 bg-slate-950 rounded-lg">
                <span class="col-span-6">Description</span>
                <span class="col-span-2 text-center">Qty</span>
                <span class="col-span-2 text-right">Rate</span>
                <span class="col-span-2 text-right">Total</span>
              </div>

              {lineItems.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  class="p-3 sm:p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-0"
                >
                  <div class="sm:col-span-6 flex items-center justify-between sm:pr-2">
                    <p class="font-bold text-white truncate">{item.name}</p>
                    <button 
                      onClick={() => handleRemoveItem(idx)}
                      class="sm:hidden text-slate-500 hover:text-rose-400 text-xs p-1"
                    >
                      ✕ Remove
                    </button>
                  </div>
                  
                  <div class="flex items-center justify-between sm:contents pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <div class="sm:col-span-2 sm:text-center flex items-center gap-1.5 sm:justify-center">
                      <span class="sm:hidden text-slate-400 text-[10px]">Qty:</span>
                      <input 
                        type="number" 
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleUpdateQty(idx, e.target.value)}
                        class="w-12 bg-slate-900 text-white font-mono text-center font-bold px-1 py-0.5 rounded border border-slate-700"
                      />
                    </div>

                    <span class="sm:col-span-2 sm:text-right font-mono text-slate-300">
                      <span class="sm:hidden text-slate-400 text-[10px]">Rate: </span>
                      ₹{Number(item.unit_price).toFixed(2)}
                    </span>

                    <div class="sm:col-span-2 flex items-center justify-end gap-2 font-mono font-bold text-white">
                      <span>₹{Number(item.total_amount).toFixed(2)}</span>
                      <button 
                        onClick={() => handleRemoveItem(idx)}
                        class="hidden sm:inline text-slate-500 hover:text-rose-400 text-xs ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Calculations, Payment Modes & Live Thermal Slip */}
        <div class="lg:col-span-5 space-y-5">
          
          {/* Bill Calculation Card */}
          <div class="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Payment Breakdown</h3>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span class="font-mono font-bold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div class="flex justify-between items-center text-slate-300">
                <span>Discount (₹)</span>
                <input 
                  type="number" 
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  class="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-right font-mono text-emerald-400 font-bold text-xs"
                />
              </div>

              <div class="border-t border-slate-800 pt-3 flex justify-between items-center">
                <span class="text-sm font-bold text-white">Net Payable Amount</span>
                <span class="text-xl sm:text-2xl font-extrabold text-teal-400 font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div class="space-y-2 pt-2 border-t border-slate-800">
              <label class="block text-[10px] text-slate-400 uppercase font-semibold">Tender Mode</label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: '📱 UPI QR' },
                  { id: 'CASH', label: '💵 Cash' },
                  { id: 'CARD', label: '💳 Card' },
                  { id: 'CREDIT_KHATA', label: '📒 Due' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id)}
                    class={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                      paymentMode === mode.id 
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md' 
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerateInvoice}
              class="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Receipt class="w-4 h-4" />
              <span>Complete Payment & Print Slip (₹{grandTotal.toFixed(2)})</span>
            </button>
          </div>

          {/* Thermal Receipt Live Mockup */}
          <div class="flex flex-col items-center">
            <div class="w-full max-w-sm thermal-slip text-slate-900 p-5 rounded-lg text-xs font-mono space-y-2.5">
              <div class="text-center space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <h4 class="font-extrabold text-sm tracking-tight">{clinic?.name || 'APEX SPECIALTY CLINIC'}</h4>
                <p class="text-[10px] text-slate-600">{clinic?.address?.line1}, {clinic?.address?.city}</p>
                <p class="text-[10px] text-slate-600">Ph: {clinic?.phone}</p>
              </div>

              <div class="text-[11px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <div class="flex justify-between">
                  <span>Pt: <b>{patientName}</b></span>
                  <span>UHID: {selectedPatientUhid || 'MF-2026'}</span>
                </div>
                <div>Dr: {activeDoctor?.name || 'Dr. Ananya Sharma'}</div>
              </div>

              <div class="space-y-1 border-b border-dashed border-slate-400 pb-2 text-[11px]">
                <div class="flex justify-between font-bold">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                {lineItems.map((it, i) => (
                  <div key={i} class="flex justify-between">
                    <span class="truncate max-w-[140px]">{it.name}</span>
                    <span>{it.qty}</span>
                    <span>₹{Number(it.total_amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div class="space-y-0.5 text-[11px] border-b border-dashed border-slate-400 pb-2">
                <div class="flex justify-between font-bold text-sm">
                  <span>TOTAL:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-[10px] text-slate-600">
                  <span>Paid ({paymentMode}):</span>
                  <span>₹{grandTotal.toFixed(2)} [PAID]</span>
                </div>
              </div>

              <div class="text-center text-[10px] text-slate-600 pt-1">
                <p class="font-bold">*** GET WELL SOON ***</p>
                <p>Follow-up consultation valid for 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
