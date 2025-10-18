import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { generatePitch } from '@/lib/gemini'
import { savePitch } from '@/lib/database'

export default function CreatePitch() {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const setCurrentIdea = useStore((s) => s.setCurrentIdea)
  const setCurrentPitch = useStore((s) => s.setCurrentPitch)
  const setIsLoading = useStore((s) => s.setIsLoading)

  const [idea, setIdea] = useState('')
  const [industry, setIndustry] = useState('')
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setIsLoading(true)
    const ideaData = { idea, industry, tone }
    try {
      const pitchData = await generatePitch(ideaData)
      if (user) await savePitch(user.uid, ideaData, pitchData)
      setCurrentIdea(ideaData)
      setCurrentPitch(pitchData)
      navigate('/generated')
    } catch (err) {
      // Show full error details for debugging
      let details = err.message || 'Failed to generate pitch. Please try again.'
      if (err && err.stack) details += '\n' + err.stack
      if (err && err.response && err.response.data) details += '\n' + JSON.stringify(err.response.data)
      setError(details)
    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0f2027] via-[#2c5364] to-[#f7971e]">
      <nav className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-yellow-200/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/90 hover:text-yellow-200 font-semibold text-lg">
            <span className="text-2xl">←</span>
            <span>Dashboard</span>
          </Link>
          <span className="text-yellow-200 font-extrabold text-xl tracking-wide drop-shadow">PitchCraft</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-yellow-200">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2 tracking-tight">Create Your Pitch</h1>
              <p className="text-lg text-yellow-100">Apna startup idea batao, aur <span className="font-bold text-yellow-300">AI</span> se magic karwao!</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl shadow animate-pulse">{error}</div>
              )}

              <div>
                <label htmlFor="idea" className="block text-lg font-bold text-yellow-900 mb-2">Startup Idea <span className="ml-1">💡</span></label>
                <textarea
                  id="idea"
                  required
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition resize-none bg-yellow-50 placeholder-yellow-300"
                  placeholder="Describe your startup idea..."
                />
                <p className="mt-2 text-sm text-yellow-900/70">Apne idea ko detail mein likho (2-5 sentences)</p>
              </div>

              <div>
                <label htmlFor="industry" className="block text-lg font-bold text-yellow-900 mb-2">Industry <span className="ml-1">🏭</span></label>
                <select
                  id="industry"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-3 text-lg bg-yellow-50"
                >
                  <option value="">Select Industry</option>
                  {['Education','Healthcare','E-commerce','Fintech','Social Media','Transportation','Entertainment','Food & Beverage','Real Estate','Technology','Other'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-yellow-900 mb-2">Tone / لہجہ <span className="ml-1">🎭</span></label>
                <div className="flex gap-4 justify-center">
                  {['formal','professional','fun'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`px-6 py-3 rounded-xl font-bold text-lg transition border-2 shadow-sm ${
                        tone === t
                          ? 'border-orange-500 bg-orange-100 text-orange-700 scale-105'
                          : 'border-yellow-200 bg-white/90 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 shadow-lg hover:from-orange-400 hover:to-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="animate-pulse">Generating... AI kaam kar rahi hai ✨</span>
                ) : (
                  <span>Generate Pitch 🚀</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
