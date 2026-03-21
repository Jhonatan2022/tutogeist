import React from 'react';

const NetworkDecoration = () => (
  <svg
    className="chat-decoration"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer ring */}
    <circle cx="200" cy="200" r="160" stroke="#4c4eb3" strokeWidth="1" fill="none" />

    {/* Nodes */}
    <circle cx="200" cy="40" r="10" fill="#87c7d1" />
    <circle cx="340" cy="120" r="12" fill="#4c4eb3" />
    <circle cx="340" cy="280" r="8" fill="#2dabb9" />
    <circle cx="200" cy="360" r="11" fill="#87c7d1" />
    <circle cx="60" cy="280" r="9" fill="#4c4eb3" />
    <circle cx="60" cy="120" r="13" fill="#2dabb9" />

    {/* Inner nodes */}
    <circle cx="200" cy="130" r="7" fill="#4c4eb3" />
    <circle cx="280" cy="180" r="6" fill="#87c7d1" />
    <circle cx="250" cy="290" r="8" fill="#2dabb9" />
    <circle cx="140" cy="280" r="6" fill="#4c4eb3" />
    <circle cx="120" cy="180" r="7" fill="#87c7d1" />
    <circle cx="200" cy="200" r="9" fill="#4c4eb3" />

    {/* Lines - outer ring connections */}
    <line x1="200" y1="40" x2="340" y2="120" stroke="#4c4eb3" strokeWidth="1" />
    <line x1="340" y1="120" x2="340" y2="280" stroke="#87c7d1" strokeWidth="1" />
    <line x1="340" y1="280" x2="200" y2="360" stroke="#2dabb9" strokeWidth="1" />
    <line x1="200" y1="360" x2="60" y2="280" stroke="#4c4eb3" strokeWidth="1" />
    <line x1="60" y1="280" x2="60" y2="120" stroke="#87c7d1" strokeWidth="1" />
    <line x1="60" y1="120" x2="200" y2="40" stroke="#2dabb9" strokeWidth="1" />

    {/* Inner connections */}
    <line x1="200" y1="40" x2="200" y2="130" stroke="#87c7d1" strokeWidth="1" />
    <line x1="340" y1="120" x2="280" y2="180" stroke="#4c4eb3" strokeWidth="1" />
    <line x1="340" y1="280" x2="250" y2="290" stroke="#2dabb9" strokeWidth="1" />
    <line x1="60" y1="280" x2="140" y2="280" stroke="#87c7d1" strokeWidth="1" />
    <line x1="60" y1="120" x2="120" y2="180" stroke="#4c4eb3" strokeWidth="1" />

    {/* Center connections */}
    <line x1="200" y1="130" x2="200" y2="200" stroke="#4c4eb3" strokeWidth="1" />
    <line x1="280" y1="180" x2="200" y2="200" stroke="#2dabb9" strokeWidth="1" />
    <line x1="250" y1="290" x2="200" y2="200" stroke="#87c7d1" strokeWidth="1" />
    <line x1="140" y1="280" x2="200" y2="200" stroke="#4c4eb3" strokeWidth="1" />
    <line x1="120" y1="180" x2="200" y2="200" stroke="#2dabb9" strokeWidth="1" />
  </svg>
);

export default NetworkDecoration;
