const { onCall } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY')

// Helper to support both Cloud Secrets and local env for emulator
const getGeminiKey = () => process.env.GEMINI_API_KEY || GEMINI_API_KEY.value()

exports.generatePitch = onCall({ region: 'us-central1', secrets: [GEMINI_API_KEY] }, async (request) => {
  try {
    const ideaData = request.data?.ideaData
    if (!ideaData || !ideaData.idea) {
      return { success: false, error: 'Missing ideaData' }
    }
  const genAI = new GoogleGenerativeAI(getGeminiKey())
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `You are an expert startup consultant and pitch creator. Generate a complete startup pitch based on the following information:\n\n**Idea:** ${ideaData.idea}\n**Industry:** ${ideaData.industry}\n**Tone:** ${ideaData.tone}\n\nPlease provide the following in a structured JSON format:\n1. startupName\n2. tagline\n3. elevatorPitch\n4. problemStatement\n5. solutionStatement\n6. targetAudience\n7. uniqueValueProposition\n8. landingPageHero\n9. colorPalette\n10. logoIdeas\n\nReturn ONLY valid JSON without any markdown formatting or backticks.`
    const result = await model.generateContent(prompt)
    const text = await result.response.text()
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const generatedData = JSON.parse(cleanedText)
    return { success: true, data: generatedData }
  } catch (err) {
    console.error('functions.generatePitch error', err)
    return { success: false, error: err.message || 'Generation failed' }
  }
})

exports.regeneratePitch = onCall({ region: 'us-central1', secrets: [GEMINI_API_KEY] }, async (request) => {
  try {
    const ideaData = request.data?.ideaData
    const field = request.data?.field
    if (!ideaData || !field) {
      return { success: false, error: 'Missing ideaData or field' }
    }
  const genAI = new GoogleGenerativeAI(getGeminiKey())
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Based on this startup idea: "${ideaData.idea}" in the ${ideaData.industry} industry, generate a new ${field} with a ${ideaData.tone} tone. Return ONLY the text content without any JSON formatting or labels.`
    const result = await model.generateContent(prompt)
    const text = await result.response.text()
    return { success: true, data: text.trim() }
  } catch (err) {
    console.error('functions.regeneratePitch error', err)
    return { success: false, error: err.message || 'Regeneration failed' }
  }
})
