import React from 'react'

/**
 * DrGlanceLogo — Ultra-precision Clinical Biometric Vector Logo
 * Features concentric biometric iris aperture blades, telemetry calibration ticks,
 * a medical cross core, and radiant teal-cyan gradient styling.
 */
export default function DrGlanceLogo({
  size = 'md',
  variant = 'horizontal',
  glow = true,
  className = '',
  style = {},
}) {
  const sizeMap = {
    sm: { mark: 26, title: '0.95rem', subtitle: '0.62rem', gap: '0.65rem' },
    md: { mark: 36, title: '1.15rem', subtitle: '0.68rem', gap: '0.85rem' },
    lg: { mark: 48, title: '1.45rem', subtitle: '0.74rem', gap: '1rem' },
    xl: { mark: 64, title: '1.9rem', subtitle: '0.82rem', gap: '1.2rem' },
  }

  const currentSize = typeof size === 'number'
    ? { mark: size, title: `${size * 0.32}px`, subtitle: `${size * 0.18}px`, gap: '0.75rem' }
    : (sizeMap[size] || sizeMap.md)

  const markSvg = (
    <div
      style={{
        width: currentSize.mark,
        height: currentSize.mark,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        filter: glow ? 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.35))' : 'none',
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={currentSize.mark}
        height={currentSize.mark}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="dg-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <radialGradient id="dg-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="65%" stopColor="#10b981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#090a0f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="32" cy="32" r="30" fill="url(#dg-halo)" />

        {/* Outer Telemetry Calibration Track */}
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="url(#dg-cyan-grad)"
          strokeWidth="1.25"
          strokeOpacity="0.4"
        />

        {/* 4 Cardinal Calibration Notches */}
        <line x1="32" y1="2" x2="32" y2="6" stroke="url(#dg-cyan-grad)" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="32" y1="58" x2="32" y2="62" stroke="url(#dg-cyan-grad)" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="2" y1="32" x2="6" y2="32" stroke="url(#dg-cyan-grad)" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="58" y1="32" x2="62" y2="32" stroke="url(#dg-cyan-grad)" strokeWidth="1.75" strokeLinecap="round" />

        {/* Biometric Aperture Segmented Iris Orbit */}
        <circle
          cx="32"
          cy="32"
          r="21"
          stroke="url(#dg-cyan-grad)"
          strokeWidth="1.8"
          strokeDasharray="9 4 2 4"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Inner Laser Reticle Target */}
        <circle
          cx="32"
          cy="32"
          r="14"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeOpacity="0.25"
        />

        {/* Crosshair Hairlines */}
        <path
          d="M32 17 V47 M17 32 H47"
          stroke="url(#dg-cyan-grad)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />

        {/* Central Precision Medical Cross Core */}
        <path
          d="M30 25 H34 V30 H39 V34 H34 V39 H30 V34 H25 V30 H30 Z"
          fill="url(#dg-cyan-grad)"
        />

        {/* Focal Laser Pip */}
        <circle cx="32" cy="32" r="2.2" fill="#ffffff" />
        <circle cx="32" cy="32" r="0.9" fill="#090a0f" />
      </svg>
    </div>
  )

  if (variant === 'mark') {
    return (
      <div className={`drglance-logo-mark ${className}`} style={{ display: 'inline-flex', ...style }}>
        {markSvg}
      </div>
    )
  }

  const isVertical = variant === 'vertical'

  return (
    <div
      className={`drglance-logo-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: isVertical ? 'center' : 'center',
        flexDirection: isVertical ? 'column' : 'row',
        gap: currentSize.gap,
        textAlign: isVertical ? 'center' : 'left',
        ...style,
      }}
    >
      {markSvg}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <div
          style={{
            fontSize: currentSize.title,
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#ffffff',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span>DR</span>
          <span style={{ color: 'var(--oura-cyan, #38bdf8)', opacity: 0.9 }}>•</span>
          <span>GLANCE</span>
        </div>
        <div
          style={{
            fontSize: currentSize.subtitle,
            fontWeight: 600,
            letterSpacing: '0.14em',
            color: 'var(--text-3, #94a3b8)',
            textTransform: 'uppercase',
            marginTop: '0.2rem',
          }}
        >
          CLINICAL AI BIOMETRICS
        </div>
      </div>
    </div>
  )
}
