import React from 'react';

/**
 * Stepper Component - SIPEPES v2.0
 * 4 Langkah Form Pelaporan Warga
 */
export default function Stepper({
  currentStep = 1,
  totalSteps = 4,
  steps = [
    'Foto Bukti',
    'Lokasi Sempadan',
    'Detail Laporan',
    'Tinjau & Kirim'
  ],
  className = ''
}) {
  return (
    <div className={`w-full ${className}`}>
      {/* 4 Segmented Progress Bars */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={idx}
              className="flex-1 h-2 rounded-full bg-garis overflow-hidden relative"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ease-halus ${
                  isDone || isActive ? 'bg-ceria-400 w-full' : 'w-0'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Step Label */}
      <div className="flex items-center justify-between mt-2.5 text-xs font-bold text-ink-muted">
        <span className="text-ink">
          Langkah {currentStep} dari {totalSteps}: <span className="text-musi-600 font-extrabold">{steps[currentStep - 1]}</span>
        </span>
        <span className="tabular-nums">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
    </div>
  );
}

