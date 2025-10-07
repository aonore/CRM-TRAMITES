import React from 'react';

function Badge({ children, className = "", color = "blue", ...props }) {
  const colors = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colors[color] || colors.blue} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;