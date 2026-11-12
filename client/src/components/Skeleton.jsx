import React from 'react';

/**
 * Skeleton Component - SIPEPES v2.0
 */
export default function Skeleton({
  className = '',
  count = 1,
  height = 'h-4'
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-shimmer rounded-xl bg-garis/60 ${height} ${className}`}
        />
      ))}
    </>
  );
}

