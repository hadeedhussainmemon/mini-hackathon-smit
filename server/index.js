// Load local .env for development so GEMINI_API_KEY in project root is picked up automatically
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { GoogleGenerativeAI } from '@google/generative-ai'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const apiKey = process.env.GEMINI_API_KEY || ''
if (!apiKey) {
  console.error('GEMINI_API_KEY not set in environment. The server will not be able to call Gemini.')
} else {
  // Print a masked version (only last 4 chars) to confirm the key was loaded without exposing it
  const masked = apiKey.length > 4 ? '*'.repeat(Math.max(0, apiKey.length - 4)) + apiKey.slice(-4) : '****'
  console.log(`GEMINI_API_KEY loaded (masked): ${masked}`)
}

const genAI = new GoogleGenerativeAI(apiKey)
// Default to a supported model returned by the API list to avoid 404s.
// You can override by setting the GEMINI_MODEL environment variable (exact value returned by /api/models).
const modelName = process.env.GEMINI_MODEL || 'models/gemini-2.5-flash'
console.log(`Using Gemini model: ${modelName} (override with GEMINI_MODEL env var)`) 

// Function to list available models and print a concise summary to the server console.
// Called after the server starts so any runtime initialization issues won't crash module load.
async function logAvailableModels() {
  try {
    let listResult = null
    if (typeof genAI.listModels === 'function') {
      // Some SDK versions expose listModels
      listResult = await genAI.listModels()
      console.log('Available models (from SDK):')
      if (Array.isArray(listResult?.models)) {
        listResult.models.forEach(m => console.log(' -', m.name || JSON.stringify(m)))
      } else {
        console.log(JSON.stringify(listResult, null, 2))
      }
    } else {
      // Fallback: call REST list endpoint directly
      const resp = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + apiKey)
      const json = await resp.json()
      console.log('Available models (from REST):')
      if (Array.isArray(json?.models)) {
        json.models.forEach(m => console.log(' -', m.name || JSON.stringify(m)))
      } else if (json?.model) {
        console.log(' -', json.model)
      } else {
        console.log(JSON.stringify(json, null, 2))
      }
    }
  } catch (err) {
    console.error('Unable to list models at startup (this is non-fatal):', err?.message || err)
  }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { ideaData } = req.body
  const model = genAI.getGenerativeModel({ model: modelName })

    const prompt = `You are an expert startup consultant and pitch creator. Generate a complete startup pitch based on the following information:\n\n**Idea:** ${ideaData.idea}\n**Industry:** ${ideaData.industry}\n**Tone:** ${ideaData.tone}\n\nPlease provide the following in a structured JSON format:\n1. startupName\n2. tagline\n3. elevatorPitch\n4. problemStatement\n5. solutionStatement\n6. targetAudience\n7. uniqueValueProposition\n8. landingPageHero\n9. colorPalette\n10. logoIdeas\n\nReturn ONLY valid JSON without any markdown formatting or backticks.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const generatedData = JSON.parse(cleanedText)
    res.json({ success: true, data: generatedData })
  } catch (error) {
    console.error('Server /api/generate error:', error)
    const hint = 'If you see a "model not found" error, call GET /api/models to list supported models and set GEMINI_MODEL to a supported model name.'
    res.status(500).json({ success: false, error: error.message || 'Generation failed', hint })
  }
})

app.post('/api/regenerate', async (req, res) => {
  try {
    const { ideaData, field } = req.body
  const model = genAI.getGenerativeModel({ model: modelName })
    const prompt = `Based on this startup idea: "${ideaData.idea}" in the ${ideaData.industry} industry, generate a new ${field} with a ${ideaData.tone} tone. Return ONLY the text content without any JSON formatting or labels.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    res.json({ success: true, data: text.trim() })
  } catch (error) {
    console.error('Server /api/regenerate error:', error)
    const hint = 'If you see a "model not found" error, call GET /api/models to list supported models and set GEMINI_MODEL to a supported model name.'
    res.status(500).json({ success: false, error: error.message || 'Regeneration failed', hint })
  }
})

// Debug endpoint: list available models (helps determine correct model name/version)
app.get('/api/models', async (req, res) => {
  try {
    // The SDK may offer a listModels method; try it first
    if (typeof genAI.listModels === 'function') {
      const models = await genAI.listModels()
      return res.json({ success: true, models })
    }

    // Fallback: call the REST list endpoint directly
    const fetchRes = await fetch('https://generativelanguage.googleapis.com/v1/models?key=' + apiKey)
    const json = await fetchRes.json()
    return res.json({ success: true, models: json })
  } catch (err) {
    console.error('Failed to list models:', err)
    return res.status(500).json({ success: false, error: err.message || 'Failed to list models' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Gemini proxy server listening on port ${port}`)
  // List available models after server starts (non-blocking)
  logAvailableModels()
})
