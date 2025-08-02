'use client'
import { useEffect, useState } from 'react'
const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface StatusData {
  status: 'ok' | 'error' | 'loading'
  timestamp: string
}

export default function StatusMonitor() {
  const [status, setStatus] = useState<StatusData>({ 
    status: 'loading', 
    timestamp: new Date().toISOString() 
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          apiUrl + '/status',
          { signal: controller.signal }
        )

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        
        const data = await response.json()
        
        if (isMounted) {
          setStatus({
            status: data.status || 'ok',
            timestamp: data.timestamp || new Date().toISOString()
          })
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setStatus(prev => ({ ...prev, status: 'error' }))
          setError(err instanceof Error ? err.message : 'Failed to fetch status')
        }
      } finally {
        if (isMounted) {
          timeoutId = setTimeout(fetchStatus, 30000)
        }
      }
    }

    fetchStatus()

    return () => {
      isMounted = false
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [])

  const statusColors = {
    ok: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    loading: 'bg-blue-100 text-blue-800'
  }

  return (
    <div className="status-container">
      <h1 className="status-title">System Status Monitor</h1>

      {error && (
        <div className="status-error">
          Error: {error}
        </div>
      )}

      <div className="status-card">
        <div className="status-header">
          <span>Overall Status:</span>
          <span className={`status-pill ${statusColors[status.status]}`}>
            {status.status.toUpperCase()}
          </span>
        </div>

        <div className="status-grid">
          <div className="status-item">
            <h3>Last Updated</h3>
            <p>{new Date(status.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="status-refresh">
          <div className="refresh-indicator" />
          Auto-refreshing every 30 seconds
        </div>
      </div>
    </div>
  )
}
