import React from 'react';

const colorMap = {
  primary: { bg: '#3F1470', text: '#fff' },
  gold: { bg: '#FFA301', text: '#18122B' },
  default: { bg: '#e5e7eb', text: '#374151' },
};

const Tag = ({ color = 'default', text }) => {
  const { bg, text: textColor } = colorMap[color] || colorMap.default;
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold mr-1"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {text}
    </span>
  );
};

export default Tag; 