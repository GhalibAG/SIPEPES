import React, { useState } from 'react';
import { monthlyStats } from '../../data/mockReports';

export default function PollutionBarChart() {
  const [activeBar, setActiveBar] = useState(null);

  // Cari nilai tertinggi untuk kalkulasi tinggi persentase
  const maxTotal = Math.max(
    ...monthlyStats.map(item => item.berat + item.sedang + item.ringan)
  );

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Tren Laporan Pencemaran Sungai Musi
          </h3>
          <p className="text-xs text-slate-500">
            Aktivitas 6 bulan terakhir berdasarkan tingkat keparahan
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span>
            <span>Berat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
            <span>Sedang</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span>Ringan</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100">
        {monthlyStats.map((item, idx) => {
          const total = item.berat + item.sedang + item.ringan;
          const heightPercent = (total / maxTotal) * 100;

          // Proporsi segmen
          const beratH = (item.berat / total) * 100;
          const sedangH = (item.sedang / total) * 100;
          const ringanH = (item.ringan / total) * 100;

          const isHovered = activeBar === idx;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              onMouseEnter={() => setActiveBar(idx)}
              onMouseLeave={() => setActiveBar(null)}
            >
              {/* Tooltip Float */}
              {isHovered && (
                <div className="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap flex flex-col gap-0.5 pointer-events-none transition-all">
                  <span className="font-bold text-sky-400">{item.month} 2026: {total} Laporan</span>
                  <div className="flex gap-2 text-[10px]">
                    <span className="text-red-300">🔴 {item.berat}</span>
                    <span className="text-amber-300">🟡 {item.sedang}</span>
                    <span className="text-emerald-300">🟢 {item.ringan}</span>
                  </div>
                </div>
              )}

              {/* Stacked Bar with Animation */}
              <div
                className={`w-full max-w-[42px] rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-300 ${
                  isHovered ? 'scale-105 shadow-md brightness-105' : 'opacity-90'
                }`}
                style={{ height: `${heightPercent}%` }}
              >
                {/* Segmen Berat (Bawah) */}
                <div
                  className="w-full bg-red-500 transition-all"
                  style={{ height: `${beratH}%` }}
                  title={`Berat: ${item.berat}`}
                ></div>

                {/* Segmen Sedang (Tengah) */}
                <div
                  className="w-full bg-amber-500 transition-all"
                  style={{ height: `${sedangH}%` }}
                  title={`Sedang: ${item.sedang}`}
                ></div>

                {/* Segmen Ringan (Atas) */}
                <div
                  className="w-full bg-emerald-500 transition-all"
                  style={{ height: `${ringanH}%` }}
                  title={`Ringan: ${item.ringan}`}
                ></div>
              </div>

              {/* Label Bulan */}
              <span className={`mt-2 text-xs font-medium transition ${
                isHovered ? 'text-river-600 font-bold' : 'text-slate-500'
              }`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Rata-rata 12 laporan/bulan</span>
        <span className="text-river-600 font-semibold cursor-pointer hover:underline">
          Lihat Analisis Detail &rarr;
        </span>
      </div>
    </div>
  );
}

