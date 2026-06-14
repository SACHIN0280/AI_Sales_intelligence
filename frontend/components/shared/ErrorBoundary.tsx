'use client'

import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          background: '#141414', color: '#e0e0e0', 
          minHeight: '100dvh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 12, padding: 24,
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <p style={{ color: '#f87171', fontSize: 14 }}>Something went wrong</p>
          <p style={{ color: '#555', fontSize: 12 }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{ 
              background: '#4f7bff', border: 'none', borderRadius: 7,
              padding: '8px 16px', color: 'white', cursor: 'pointer',
              fontSize: 13, marginTop: 8
            }}
          >
            Go to Login
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
