import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { SupabaseSettingsModal } from './components/common/SupabaseSettingsModal';
import { OpdQueueView } from './components/opd/OpdQueueView';
import { DoctorDeskView } from './components/doctor/DoctorDeskView';
import { BillingPosView } from './components/billing/BillingPosView';
import { PharmacyInventoryView } from './components/pharmacy/PharmacyInventoryView';
import { PatientHistoryCrmView } from './components/patients/PatientHistoryCrmView';
import { AnalyticsView } from './components/analytics/AnalyticsView';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('opd');
  const { setActiveToken } = useClinic();

  const handleNavigateToDoctor = (token) => {
    setActiveToken(token);
    setActiveTab('doctor');
  };

  const handleNavigateToBilling = (token) => {
    setActiveTab('billing');
  };

  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 pb-24 lg:pb-12">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main class="max-w-7xl mx-auto px-3 sm:px-6">
        {activeTab === 'opd' && (
          <OpdQueueView 
            onNavigateToDoctor={handleNavigateToDoctor}
            onNavigateToBilling={handleNavigateToBilling}
          />
        )}
        
        {activeTab === 'doctor' && (
          <DoctorDeskView 
            onNavigateToBilling={handleNavigateToBilling}
          />
        )}
        
        {activeTab === 'billing' && (
          <BillingPosView />
        )}
        
        {activeTab === 'pharmacy' && (
          <PharmacyInventoryView />
        )}
        
        {activeTab === 'patients' && (
          <PatientHistoryCrmView />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}
      </main>

      <Toast />
      <SupabaseSettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <MainLayout />
    </ClinicProvider>
  );
}
