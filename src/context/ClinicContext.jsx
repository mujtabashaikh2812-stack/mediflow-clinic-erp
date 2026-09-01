import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  apiGetClinicProfile, 
  apiGetDoctors, 
  apiGetTodayTokens, 
  apiGetPatients, 
  apiGetMedicines, 
  apiGetProcedures,
  apiGetInvoices,
  apiIssueToken,
  apiUpdateTokenStatus
} from '../services/apiService';
import { isSupabaseConfigured } from '../config/supabaseClient';
import confetti from 'canvas-confetti';

const ClinicContext = createContext();

export const ClinicProvider = ({ children }) => {
  const [clinic, setClinic] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeToken, setActiveToken] = useState(null); // Patient currently in doctor consultation
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [c, d, t, p, m, proc, inv] = await Promise.all([
        apiGetClinicProfile(),
        apiGetDoctors(),
        apiGetTodayTokens(),
        apiGetPatients(),
        apiGetMedicines(),
        apiGetProcedures(),
        apiGetInvoices()
      ]);

      setClinic(c);
      setDoctors(d);
      if (d.length > 0 && !activeDoctor) setActiveDoctor(d[0]);
      setTokens(t);
      setPatients(p);
      setMedicines(m);
      setProcedures(proc);
      setInvoices(inv);

      // Check if there is an active token with doctor
      const activeInCabin = t.find(tok => tok.status === 'WITH_DOCTOR');
      if (activeInCabin) setActiveToken(activeInCabin);
    } catch (err) {
      console.error('Error loading clinic data:', err);
      showToast('Error syncing with database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const issueNewToken = async (payload) => {
    try {
      const newTok = await apiIssueToken(payload);
      setTokens(prev => [...prev, newTok]);
      showToast(`Token #${newTok.token_number} generated successfully!`, 'success');
      return newTok;
    } catch (err) {
      showToast('Failed to issue token', 'error');
      throw err;
    }
  };

  const updateTokenState = async (tokenId, status) => {
    try {
      await apiUpdateTokenStatus(tokenId, status);
      setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status } : t));
      if (status === 'WITH_DOCTOR') {
        const selected = tokens.find(t => t.id === tokenId);
        setActiveToken(selected || null);
      }
      if (status === 'COMPLETED' && activeToken?.id === tokenId) {
        setActiveToken(null);
      }
    } catch (err) {
      showToast('Failed to update token status', 'error');
    }
  };

  return (
    <ClinicContext.Provider value={{
      clinic,
      setClinic,
      doctors,
      activeDoctor,
      setActiveDoctor,
      tokens,
      setTokens,
      patients,
      setPatients,
      medicines,
      setMedicines,
      procedures,
      setProcedures,
      invoices,
      setInvoices,
      activeToken,
      setActiveToken,
      loading,
      toast,
      showToast,
      triggerConfetti,
      loadAllData,
      issueNewToken,
      updateTokenState,
      isSettingsOpen,
      setIsSettingsOpen,
      isCloudConnected: isSupabaseConfigured()
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};
