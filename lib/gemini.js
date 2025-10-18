import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

export const generatePitch = async (ideaData) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an expert startup consultant and pitch creator. Generate a complete startup pitch based on the following information:\n\n**Idea:** ${ideaData.idea}\n**Industry:** ${ideaData.industry}\n**Tone:** ${ideaData.tone}\n\nPlease provide the following in a structured JSON format:\n1. startupName\n2. tagline\n3. elevatorPitch\n4. problemStatement\n5. solutionStatement\n6. targetAudience\n7. uniqueValueProposition\n8. landingPageHero\n9. colorPalette\n10. logoIdeas\n\nReturn ONLY valid JSON without any markdown formatting or backticks.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const generatedData = JSON.parse(cleanedText)
    return generatedData
  } catch (error) {
    console.error('Error generating pitch:', error)
    throw new Error('Failed to generate pitch. Please try again.')
  }
}

export const regeneratePitch = async (ideaData, fieldToRegenerate) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const prompt = `Based on this startup idea: "${ideaData.idea}" in the ${ideaData.industry} industry, generate a new ${fieldToRegenerate} with a ${ideaData.tone} tone. Return ONLY the text content without any JSON formatting or labels.`
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.error('Error regenerating field:', error)
    throw new Error('Failed to regenerate content. Please try again.')
  }
}
