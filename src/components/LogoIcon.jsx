import React from 'react';

const LogoIcon = ({ size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer circle arc (teal) */}
    <circle cx="50" cy="50" r="42" stroke="#2dabb9" strokeWidth="3" fill="none"
      strokeDasharray="200 60" strokeLinecap="round" />

    {/* Inner G shape made of dots and lines */}
    {/* Lines */}
    <line x1="30" y1="30" x2="65" y2="25" stroke="#87c7d1" strokeWidth="1.5" />
    <line x1="65" y1="25" x2="75" y2="50" stroke="#4c4eb3" strokeWidth="1.5" />
    <line x1="75" y1="50" x2="60" y2="72" stroke="#87c7d1" strokeWidth="1.5" />
    <line x1="60" y1="72" x2="35" y2="68" stroke="#2dabb9" strokeWidth="1.5" />
    <line x1="35" y1="68" x2="28" y2="50" stroke="#4c4eb3" strokeWidth="1.5" />
    <line x1="28" y1="50" x2="30" y2="30" stroke="#87c7d1" strokeWidth="1.5" />

    {/* Cross connections */}
    <line x1="30" y1="30" x2="75" y2="50" stroke="#4c4eb3" strokeWidth="1" opacity="0.5" />
    <line x1="65" y1="25" x2="35" y2="68" stroke="#2dabb9" strokeWidth="1" opacity="0.5" />
    <line x1="60" y1="72" x2="28" y2="50" stroke="#87c7d1" strokeWidth="1" opacity="0.5" />
    <line x1="50" y1="50" x2="65" y2="25" stroke="#4c4eb3" strokeWidth="1" opacity="0.4" />
    <line x1="50" y1="50" x2="75" y2="50" stroke="#2dabb9" strokeWidth="1" opacity="0.4" />

    {/* Dots - teal */}
    <circle cx="30" cy="30" r="4.5" fill="#2dabb9" />
    <circle cx="65" cy="25" r="4" fill="#87c7d1" />
    <circle cx="75" cy="50" r="4.5" fill="#2dabb9" />
    <circle cx="60" cy="72" r="3.5" fill="#87c7d1" />
    <circle cx="35" cy="68" r="4" fill="#2dabb9" />
    <circle cx="28" cy="50" r="3.5" fill="#87c7d1" />

    {/* Center dot - purple */}
    <circle cx="50" cy="50" r="5" fill="#4c4eb3" />

    {/* Extra small accent dots */}
    <circle cx="48" cy="35" r="2.5" fill="#4c4eb3" />
    <circle cx="62" cy="48" r="2" fill="#2dabb9" />
  </svg>
);

export default LogoIcon;
