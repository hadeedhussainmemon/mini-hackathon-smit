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
}

const genAI = new GoogleGenerativeAI(apiKey)

app.post('/api/generate', async (req, res) => {
  try {
    const { ideaData } = req.body
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert startup consultant and pitch creator. Generate a complete startup pitch based on the following information:\n\n**Idea:** ${ideaData.idea}\n**Industry:** ${ideaData.industry}\n**Tone:** ${ideaData.tone}\n\nPlease provide the following in a structured JSON format:\n1. startupName\n2. tagline\n3. elevatorPitch\n4. problemStatement\n5. solutionStatement\n6. targetAudience\n7. uniqueValueProposition\n8. landingPageHero\n9. colorPalette\n10. logoIdeas\n\nReturn ONLY valid JSON without any markdown formatting or backticks.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const generatedData = JSON.parse(cleanedText)
    res.json({ success: true, data: generatedData })
  } catch (error) {
    console.error('Server /api/generate error:', error)
    res.status(500).json({ success: false, error: error.message || 'Generation failed' })
  }
})

app.post('/api/regenerate', async (req, res) => {
  try {
    const { ideaData, field } = req.body
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Based on this startup idea: "${ideaData.idea}" in the ${ideaData.industry} industry, generate a new ${field} with a ${ideaData.tone} tone. Return ONLY the text content without any JSON formatting or labels.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    res.json({ success: true, data: text.trim() })
  } catch (error) {
    console.error('Server /api/regenerate error:', error)
    res.status(500).json({ success: false, error: error.message || 'Regeneration failed' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Gemini proxy server listening on port ${port}`)
})
