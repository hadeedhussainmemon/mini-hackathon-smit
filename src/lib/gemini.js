const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export const generatePitch = async (ideaData) => {
  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaData }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Generation failed')
    return json.data
  } catch (error) {
    console.error('generatePitch error:', error)
    throw error
  }
}

export const regeneratePitch = async (ideaData, fieldToRegenerate) => {
  try {
    const res = await fetch(`${API_BASE}/api/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaData, field: fieldToRegenerate }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error || 'Regeneration failed')
    return json.data
  } catch (error) {
    console.error('regeneratePitch error:', error)
    throw error
  }
}
