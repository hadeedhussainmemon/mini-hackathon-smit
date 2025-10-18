import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

function App() {
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/hello`)
      .then(r => r.json())
      .then(d => setMsg(d.message || 'no message'))
      .catch(() => setMsg('API unreachable'))
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Vite + React (Frontend)</h1>
      <p>API Base: {API_BASE}</p>
      <p>API message: {msg || 'loading...'}</p>

      <div style={{ marginTop: 16 }}>
        <button onClick={() => setCount(c => c + 1)}>count is {count}</button>
      </div>
    </div>
  )
}

export default App
