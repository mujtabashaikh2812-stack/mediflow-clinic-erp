import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Find active option object
  const selectedOption = options.find(opt => 
    (typeof opt === 'object' ? opt.value : opt) === value
  );

  const getLabel = (opt) => {
    if (!opt) return '';
    return typeof opt === 'object' ? opt.label : opt;
  };

  const getValue = (opt) => {
    if (!opt) return '';
    return typeof opt === 'object' ? opt.value : opt;
  };

  const getBadge = (opt) => {
    if (typeof opt === 'object') return opt.badge;
    return null;
  };

  const getSubtext = (opt) => {
    if (typeof opt === 'object') return opt.subtext;
    return null;
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-2 text-xs',
    lg: 'px-4 py-2.5 text-sm'
  };

  return (
    <div ref={containerRef} class={`relative inline-block w-full text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        class={`w-full flex items-center justify-between gap-2.5 rounded-xl border font-medium transition-all duration-200 focus:outline-none ${
          sizeClasses[size] || sizeClasses.md
        } ${
          isOpen
            ? 'bg-slate-900 border-teal-400 text-white shadow-lg shadow-teal-500/10'
            : 'bg-slate-950/90 hover:bg-slate-900 border-slate-700/80 hover:border-slate-600 text-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${buttonClassName}`}
      >
        <div class="flex items-center gap-2 truncate">
          {Icon && <Icon class="w-4 h-4 text-teal-400 flex-shrink-0" />}
          <span class={`truncate font-semibold ${selectedOption ? 'text-white' : 'text-slate-400'}`}>
            {selectedOption ? getLabel(selectedOption) : placeholder}
          </span>
        </div>

        <ChevronDown 
          class={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180 text-teal-400' : ''
          }`} 
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div class={`absolute z-50 mt-1.5 w-full min-w-[200px] rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 p-1.5 shadow-2xl shadow-black/80 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}>
          <div class="space-y-0.5">
            {options.length === 0 ? (
              <div class="px-3 py-2 text-xs text-slate-500 text-center">No options available</div>
            ) : (
              options.map((opt, idx) => {
                const optVal = getValue(opt);
                const optLabel = getLabel(opt);
                const optBadge = getBadge(opt);
                const optSubtext = getSubtext(opt);
                const isSelected = optVal === value;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(optVal);
                      setIsOpen(false);
                    }}
                    class={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg transition-all text-left ${
                      isSelected
                        ? 'bg-teal-500/15 text-teal-300 font-bold border-l-2 border-teal-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium'
                    }`}
                  >
                    <div class="truncate flex-1">
                      <div class="flex items-center gap-2 truncate">
                        <span class="truncate">{optLabel}</span>
                        {optBadge && (
                          <span class="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            {optBadge}
                          </span>
                        )}
                      </div>
                      {optSubtext && (
                        <p class="text-[10px] text-slate-400 font-normal truncate mt-0.5">{optSubtext}</p>
                      )}
                    </div>

                    {isSelected && (
                      <Check class="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
