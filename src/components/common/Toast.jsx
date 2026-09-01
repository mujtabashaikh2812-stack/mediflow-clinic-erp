import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const { toast } = useClinic();
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div class="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div class={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl ${
        isError 
          ? 'bg-rose-950/90 text-rose-200 border-rose-500/50 shadow-rose-950/50' 
          : isInfo 
            ? 'bg-sky-950/90 text-sky-200 border-sky-500/50 shadow-sky-950/50'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50 shadow-emerald-950/50'
      }`}>
        {isError && <AlertCircle class="w-5 h-5 text-rose-400 flex-shrink-0" />}
        {isInfo && <Info class="w-5 h-5 text-sky-400 flex-shrink-0" />}
        {!isError && !isInfo && <CheckCircle2 class="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        
        <p class="text-xs font-bold">{toast.message}</p>
      </div>
    </div>
  );
};
