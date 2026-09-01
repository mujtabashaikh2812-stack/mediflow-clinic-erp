import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { getSupabaseConfig, updateSupabaseConfig } from '../../config/supabaseClient';
import { Database, ShieldCheck, ExternalLink, X, Check, Copy } from 'lucide-react';

export const SupabaseSettingsModal = () => {
  const { isSettingsOpen, setIsSettingsOpen, isCloudConnected, showToast } = useClinic();
  const config = getSupabaseConfig();
  
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.startsWith('https://')) {
      showToast('Supabase URL must start with https://', 'error');
      return;
    }
    updateSupabaseConfig(url, anonKey);
    showToast('Supabase configuration saved! Reloading connection...', 'success');
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div class="glass-card max-w-lg w-full rounded-2xl p-6 border border-slate-700 shadow-2xl relative">
        <button 
          onClick={() => setIsSettingsOpen(false)}
          class="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Database class="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 class="text-base font-bold text-white">Supabase Cloud Database Settings</h3>
            <p class="text-xs text-slate-400">Direct PostgreSQL Cloud Persistence (Zero Local Storage)</p>
          </div>
        </div>

        <div class="mb-5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400">Connection Status:</span>
            <span class={`font-bold px-2 py-0.5 rounded-full ${
              isCloudConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {isCloudConnected ? '● Connected to Supabase' : '○ RAM Session Mode (Ready for Setup)'}
            </span>
          </div>
          <p class="text-[11px] text-slate-400">
            Paste your Supabase credentials below. All patient records, prescriptions, and bills will be securely written directly to your cloud PostgreSQL database.
          </p>
        </div>

        <form onSubmit={handleSave} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Project URL</label>
            <input 
              type="url" 
              placeholder="https://xyzcompany.supabase.co" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Anon / Public API Key</label>
            <textarea 
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              required
              class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400 font-mono"
            />
          </div>

          <div class="p-3 bg-teal-950/30 border border-teal-500/30 rounded-xl text-xs space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-teal-300">Database SQL Setup Script</span>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer"
                class="flex items-center gap-1 text-[11px] text-teal-400 hover:underline font-semibold"
              >
                Supabase Dashboard <ExternalLink class="w-3 h-3" />
              </a>
            </div>
            <p class="text-[11px] text-slate-300">
              Run the generated <code class="text-teal-300 font-mono">supabase_setup.sql</code> inside your Supabase SQL Editor to create all tables and realtime listeners.
            </p>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsSettingsOpen(false)}
              class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
            >
              Close
            </button>
            <button 
              type="submit" 
              class="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20"
            >
              Save & Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
