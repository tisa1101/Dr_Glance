import React from 'react'
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'

// ─── Error Boundary ─────────────────────────────────────────────────────────
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center'
        }}>
          <AlertTriangle size={40} color="var(--warning)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>Something went wrong</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button className="btn btn-secondary" onClick={() => this.setState({ hasError: false, error: null })}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function Spinner({ size = 32, label = 'Loading…' }) {
  return (
    <div role="status" aria-label={label} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: '1rem', padding: '3rem'
    }}>
      <div style={{
        width: size, height: size,
        border: `3px solid rgba(99,102,241,0.15)`,
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</span>
    </div>
  )
}

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
export function Skeleton({ height = '1rem', width = '100%', radius = '6px', style = {} }) {
  return (
    <div style={{
      height, width, borderRadius: radius,
      background: 'rgba(255,255,255,0.06)',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center'
    }}>
      {Icon && <Icon size={48} color="var(--text-muted)" style={{ marginBottom: '1.25rem', opacity: 0.5 }} />}
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{title}</h3>
      {description && (
        <p style={{ color: 'var(--text-muted)', maxWidth: '360px', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: action ? '1.5rem' : 0 }}>
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────────────
export function ErrorState({ message, onRetry }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '3rem 2rem', textAlign: 'center',
      background: 'rgba(239,68,68,0.05)', borderRadius: '12px',
      border: '1px solid rgba(239,68,68,0.15)'
    }}>
      <WifiOff size={36} color="var(--danger)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Unable to load data</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '300px' }}>
        {message || 'The server could not be reached. Check your connection.'}
      </p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  )
}

// ─── Inline Alert ─────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children }) {
  const colors = {
    info: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', text: '#a5b4fc' },
    success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', text: '#6ee7b7' },
    warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', text: '#fcd34d' },
    danger: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#fca5a5' },
  }
  const c = colors[type] || colors.info
  return (
    <div role="alert" style={{
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
      padding: '0.875rem 1rem', color: c.text, fontSize: '0.875rem', lineHeight: 1.5
    }}>
      {children}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, type = 'default', size = 'md' }) {
  const colors = {
    default: 'rgba(255,255,255,0.08)',
    success: 'rgba(16,185,129,0.15)',
    warning: 'rgba(245,158,11,0.15)',
    danger: 'rgba(239,68,68,0.15)',
    info: 'rgba(6,182,212,0.15)',
    primary: 'rgba(99,102,241,0.15)',
  }
  const text = {
    default: 'var(--text-muted)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    info: 'var(--accent)',
    primary: 'var(--primary)',
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      background: colors[type], color: text[type],
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      borderRadius: '99px', fontSize: size === 'sm' ? '0.72rem' : '0.8rem',
      fontWeight: 600, letterSpacing: '0.01em'
    }}>
      {children}
    </span>
  )
}

// ─── Disclaimer Banner ────────────────────────────────────────────────────────
export function DisclaimerBanner({ text }) {
  return (
    <div role="note" style={{
      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
      background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)',
      borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.82rem',
      color: '#fcd34d', lineHeight: 1.5, marginBottom: '1.5rem'
    }}>
      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
      <span>{text}</span>
    </div>
  )
}
