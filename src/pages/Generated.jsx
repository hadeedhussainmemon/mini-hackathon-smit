import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { regeneratePitch } from '@/lib/gemini'
import jsPDF from 'jspdf'
import PageTopBar from '@/components/PageTopBar'
import ContentCard from '@/components/ContentCard'
import HeroPreview from '@/components/HeroPreview'
import LandingPreview from '@/components/LandingPreview'

export default function Generated() {
  const navigate = useNavigate()
  const user = useStore((s) => s.user)
  const currentIdea = useStore((s) => s.currentIdea)
  const currentPitch = useStore((s) => s.currentPitch)
  const setCurrentIdea = useStore((s) => s.setCurrentIdea)
  const setCurrentPitch = useStore((s) => s.setCurrentPitch)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(null)

  useEffect(() => {
    if (!user) return navigate('/login')
    // If store is empty try to hydrate from localStorage (helpful during dev/hot reload)
    if ((!currentPitch || !currentIdea)) {
      try {
        const raw = localStorage.getItem('lastPitch')
        if (raw) {
          const obj = JSON.parse(raw)
          if (obj && obj.ideaData && obj.pitchData) {
            setCurrentPitch(obj.pitchData)
            // also restore the idea so the Generated page has both pieces of state
            try { setCurrentIdea(obj.ideaData) } catch (e) {}
          }
        }
      } catch (e) {
        console.warn('Failed to hydrate pitch from localStorage', e)
      }
      // After attempting hydration, only redirect if we still don't have both pieces
      if (!currentPitch || !currentIdea) navigate('/create')
    }
    // Debug: expose currentPitch for inspection in browser console
    try { window.__currentPitch = currentPitch } catch (e) {}
  }, [user, currentPitch, currentIdea])

  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Clipboard write failed', e)
    }
  }

  const handleRegenerate = async (field) => {
    if (!currentIdea || !currentPitch) return
    setRegenerating(field)
    try {
      const newValue = await regeneratePitch(currentIdea, field)
      setCurrentPitch({ ...currentPitch, [field]: newValue })
    } catch (e) {
      console.error('Regeneration failed:', e)
    }
    setRegenerating(null)
  }

  const handleExportPDF = () => {
    if (!currentPitch) return
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    let yPos = 20
    doc.setFontSize(24)
    doc.text(currentPitch.startupName || 'Startup', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15
    doc.setFontSize(14)
    doc.text(currentPitch.tagline || '', pageWidth / 2, yPos, { align: 'center' })
    yPos += 20
    const sections = [
      { title: 'Elevator Pitch', content: currentPitch.elevatorPitch || '' },
      { title: 'Problem Statement', content: currentPitch.problemStatement || '' },
      { title: 'Solution', content: currentPitch.solutionStatement || '' },
      { title: 'Target Audience', content: currentPitch.targetAudience || '' },
      { title: 'Unique Value Proposition', content: currentPitch.uniqueValueProposition || '' },
      { title: 'Landing Page Hero', content: currentPitch.landingPageHero || '' },
    ]
    doc.setFontSize(10)
    sections.forEach((section) => {
      if (yPos > 250) { doc.addPage(); yPos = 20 }
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 20, yPos)
      yPos += 7
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(section.content || '', pageWidth - 40)
      if (lines && lines.length) {
        doc.text(lines, 20, yPos)
        yPos += lines.length * 5 + 10
      }
    })
    doc.save(`${(currentPitch.startupName || 'startup').replace(/[^a-z0-9-_ ]/gi, '')}-pitch.pdf`)
  }

  if (!currentPitch || !currentIdea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-5xl mb-4">🛈</div>
          <p>Please create a pitch first.</p>
          <Link to="/create" className="mt-4 inline-block btn-primary">Go to Create</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <PageTopBar leftTo="/dashboard" leftLabel="Dashboard" right={<button onClick={handleExportPDF} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold">Export PDF</button>} />

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-12 mb-8 text-center shadow-2xl">
            <h1 className="text-5xl font-bold mb-4">{currentPitch.startupName || 'Unnamed Startup'} ✨</h1>
            <p className="text-2xl opacity-90 mb-6">{currentPitch.tagline || ''}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {(Array.isArray(currentPitch.colorPalette) ? currentPitch.colorPalette : []).map((color, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} title={String(color)} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {[
              ['Elevator Pitch 🎯', 'elevatorPitch'],
              ['Problem Statement 🔴', 'problemStatement'],
              ['Solution ✅', 'solutionStatement'],
              ['Target Audience 👥', 'targetAudience'],
              ['Unique Value Proposition 💎', 'uniqueValueProposition'],
            ].map(([title, key]) => (
              <ContentCard key={key} title={title} content={String(currentPitch[key] || '')} onCopy={handleCopy} onRegenerate={() => handleRegenerate(key)} isRegenerating={regenerating === key} copied={copied} />
            ))}

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Logo Ideas 🎨</h3>
              <p className="text-gray-700 whitespace-pre-line">{currentPitch.logoIdeas || ''}</p>
            </div>
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-3">Landing Page Preview</h3>
                <LandingPreview pitch={currentPitch} />
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ContentCard moved to shared component
