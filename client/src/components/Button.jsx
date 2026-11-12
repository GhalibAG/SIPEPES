import React from 'react';

/**
 * Button Component - SIPEPES v2.0
 * Varian:
 * - 'utama': Biru Musi (#1D6FF2) untuk aksi utama
 * - 'ajakan': Koral (#FF6B57) untuk CTA utama warga ("Laporkan Pencemaran")
 * - 'lembut': Biru Musi Muda (#E3EEFF) untuk aksi sekunder
 * - 'garis': Putih border garis tipis untuk aksi netral / Kembali
 * - 'valid': Toska (#19D3BD) untuk aksi Tandai Valid
 * - 'tolak': Putih border merah (#B4232A) untuk Tolak
 */
export default function Button({
  variant = 'utama',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-150 ease-halus select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none active:scale-[0.97]';

  const sizeStyles = {
    sm: 'h-10 px-4 text-xs min-w-[40px]',
    md: 'h-11 sm:h-12 px-5 sm:px-6 text-sm min-w-[44px]',
    lg: 'h-13 sm:h-14 px-7 sm:px-8 text-base font-bold min-w-[48px]'
  };

  const variantStyles = {
    utama: 'bg-musi-600 text-white hover:bg-musi-700 hover:-translate-y-0.5 shadow-lembut hover:shadow-angkat',
    ajakan: 'bg-koral-500 text-ink hover:bg-[#ff5842] hover:-translate-y-0.5 shadow-lembut hover:shadow-angkat font-bold',
    lembut: 'bg-musi-100 text-musi-800 hover:bg-[#d4e4fc] hover:-translate-y-0.5',
    garis: 'bg-white text-ink border border-garis hover:bg-slate-50 hover:border-slate-300 shadow-xs',
    valid: 'bg-toska-400 text-ink hover:bg-[#15bfa9] hover:-translate-y-0.5 shadow-lembut',
    tolak: 'bg-white text-tingkat-berat-tx border border-tingkat-berat-tx hover:bg-tingkat-berat-bg hover:-translate-y-0.5'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.utama} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

