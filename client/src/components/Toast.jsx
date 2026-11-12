import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

/**
 * Toast Notification Component - SIPEPES v2.0
 * Menggantikan dialog pop-up bawaan browser.
 */
export default function Toast({
  message,
  type = 'success',
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto animate-fade-in">
      <div className="flex items-center gap-3 bg-ink text-white rounded-[18px] px-4.5 py-3.5 shadow-[0_20px_40px_-16px_rgba(18,33,63,0.5)] border border-white/10 text-xs sm:text-sm font-semibold select-none">
        <div className="w-7 h-7 rounded-full bg-toska-400 text-ink flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
        <span className="flex-1 leading-snug">{message}</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

