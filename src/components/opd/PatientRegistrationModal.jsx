import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { apiCreatePatient } from '../../services/apiService';
import { UserPlus, X, AlertTriangle, Check } from 'lucide-react';

export const PatientRegistrationModal = ({ isOpen, onClose, onRegistered }) => {
  const { doctors, activeDoctor, issueNewToken, showToast, triggerConfetti } = useClinic();
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    gender: 'MALE',
    age: '',
    blood_group: 'O+',
    address: '',
    emergency_phone: '',
    allergies: '',
    chronic_conditions: '',
    doctorId: activeDoctor?.id || doctors[0]?.id || '',
    visitType: 'FIRST_VISIT',
    priority: 'NORMAL'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || !formData.age) {
      showToast('Please fill required fields (Name, Phone, Age)', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const cleanAllergies = formData.allergies 
        ? formData.allergies.split(',').map(a => a.trim()).filter(Boolean)
        : [];
      
      const cleanConditions = formData.chronic_conditions
        ? formData.chronic_conditions.split(',').map(c => c.trim()).filter(Boolean)
        : [];

      // 1. Create Patient in Supabase
      const patient = await apiCreatePatient({
        full_name: formData.full_name,
        phone: formData.phone.trim(),
        gender: formData.gender,
        age: parseInt(formData.age),
        blood_group: formData.blood_group,
        address: formData.address,
        emergency_contact: { phone: formData.emergency_phone },
        allergies: cleanAllergies,
        chronic_conditions: cleanConditions
      });

      // 2. Issue Daily OPD Token
      const token = await issueNewToken({
        patientId: patient.id,
        doctorId: formData.doctorId || doctors[0]?.id,
        visitType: formData.visitType,
        priority: formData.priority
      });

      triggerConfetti();
      showToast(`Patient ${patient.full_name} registered! Token #${token.token_number} Issued`, 'success');
      onRegistered && onRegistered(patient, token);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div class="glass-card max-w-2xl w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative my-8">
        
        <button 
          onClick={onClose}
          class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center">
            <UserPlus class="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 class="text-lg font-extrabold text-white">New Patient Registration & OPD Token</h3>
            <p class="text-xs text-slate-400">Generates unique UHID & adds patient to doctor queue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Ramesh Patil" 
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone (10 Digits) *</label>
              <input 
                type="tel" 
                placeholder="9876543210" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Age (Years) *</label>
              <input 
                type="number" 
                placeholder="32" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
                min="0"
                max="120"
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
              <select 
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="O+">O +ve</option>
                <option value="O-">O -ve</option>
                <option value="A+">A +ve</option>
                <option value="A-">A -ve</option>
                <option value="B+">B +ve</option>
                <option value="B-">B -ve</option>
                <option value="AB+">AB +ve</option>
                <option value="AB-">AB -ve</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>
          </div>

          <div class="p-3 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
            <div class="flex items-center gap-2">
              <AlertTriangle class="w-4 h-4 text-rose-400" />
              <label class="text-xs font-bold text-rose-300">Known Drug Allergies (High Clinical Alert)</label>
            </div>
            <input 
              type="text" 
              placeholder="e.g. Penicillin, Sulfa, Paracetamol (Comma separated)" 
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              class="w-full bg-slate-950 border border-rose-900/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Consulting Doctor</label>
              <select 
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              >
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - ₹{doc.consultation_fee} ({doc.room_no || 'OPD'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-300 mb-1">Priority / Triage</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="NORMAL">Standard Queue</option>
                <option value="SENIOR_CITIZEN">Senior Citizen / Fast-track</option>
                <option value="EMERGENCY">Emergency / Immediate</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              class="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2"
            >
              {isSubmitting ? 'Registering...' : '✓ Register & Issue Token'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
