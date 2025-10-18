(async () => {
  try {
    const body = { ideaData: { idea: 'Test idea for Gemini', industry: 'Education', tone: 'fun' } }
    const res = await fetch('http://localhost:4000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    console.log('STATUS:', res.status)
    console.log('RESPONSE BODY:\n', text)
  } catch (err) {
    console.error('Test request failed:', err)
  }
})()
