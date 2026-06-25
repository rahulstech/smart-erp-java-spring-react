import React from 'react';
import { CardProps } from '../types/component.types';

export default function Card({
  cornerRadius = 12,
  elevation = 0,
  borderThickness = 2,
  borderColor,
  className = '',
  style,
  children
}: CardProps) {
  const getShadow = (elev: number) => {
    if (elev <= 0) return 'none';
    if (elev === 1) return '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
    if (elev === 2) return '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)';
    return '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)';
  };

  // Border color default is theme default border color
  const finalBorderColor = borderColor || 'var(--erp-main-border, #b1b5bd)';

  const cardStyle: React.CSSProperties = {
    borderRadius: `${cornerRadius}px`,
    boxShadow: getShadow(elevation),
    borderWidth: `${borderThickness}px`,
    borderStyle: borderThickness > 0 ? 'solid' : 'none',
    borderColor: finalBorderColor,
    padding: '1.25rem', // p-5
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    ...style
  };

  return (
    <div className={className} style={cardStyle}>
      {children}
    </div>
  );
}
