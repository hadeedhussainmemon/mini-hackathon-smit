import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import jsPDF from 'jspdf'
import PageTopBar from '@/components/PageTopBar'
import ViewCard from '@/components/ViewCard'

export default function PitchView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = useStore((state) => state.user)
  const [pitch, setPitch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (id && typeof id === 'string') loadPitch(id)
  }, [user, id])

  const loadPitch = async (pitchId) => {
    try {
      const docRef = doc(db, 'pitches', pitchId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) setPitch({ id: docSnap.id, ...docSnap.data() })
      else navigate('/dashboard')
    } catch (error) {
      console.error('Error loading pitch:', error)
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportPDF = () => {
    if (!pitch) return
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    let yPos = 20
    doc.setFontSize(24)
    doc.text(pitch.pitchData.startupName, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15
    doc.setFontSize(14)
    doc.text(pitch.pitchData.tagline, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20
    const sections = [
      { title: 'Elevator Pitch', content: pitch.pitchData.elevatorPitch },
      { title: 'Problem Statement', content: pitch.pitchData.problemStatement },
      { title: 'Solution', content: pitch.pitchData.solutionStatement },
      { title: 'Target Audience', content: pitch.pitchData.targetAudience },
      { title: 'Unique Value Proposition', content: pitch.pitchData.uniqueValueProposition },
      { title: 'Landing Page Hero', content: pitch.pitchData.landingPageHero },
    ]
    doc.setFontSize(10)
    sections.forEach((section) => {
      if (yPos > 250) { doc.addPage(); yPos = 20 }
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 20, yPos)
      yPos += 7
      doc.setFont('helvetica', 'normal')
      const lines = doc.splitTextToSize(section.content, pageWidth - 40)
      doc.text(lines, 20, yPos)
      yPos += lines.length * 5 + 10
    })
    doc.save(`${pitch.pitchData.startupName}-pitch.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading pitch...</p>
        </div>
      </div>
    )
  }

  if (!pitch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-5xl mb-4">🛈</div>
          <p>Pitch not found. Go back to dashboard.</p>
          <a href="/dashboard" className="mt-4 inline-block btn-primary">Dashboard</a>
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
            <h1 className="text-5xl font-bold mb-4">{pitch.pitchData.startupName} ✨</h1>
            <p className="text-2xl opacity-90 mb-6">{pitch.pitchData.tagline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {pitch.pitchData.colorPalette.map((color, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {[
              ['Elevator Pitch 🎯', pitch.pitchData.elevatorPitch],
              ['Problem Statement 🔴', pitch.pitchData.problemStatement],
              ['Solution ✅', pitch.pitchData.solutionStatement],
              ['Target Audience 👥', pitch.pitchData.targetAudience],
              ['Unique Value Proposition 💎', pitch.pitchData.uniqueValueProposition],
              ['Landing Page Hero 🚀', pitch.pitchData.landingPageHero],
            ].map(([title, content]) => (
              <ViewCard key={title} title={title} content={content} onCopy={(t) => handleCopy(t)} copied={copied} />
            ))}

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Logo Ideas 🎨</h3>
              <p className="text-gray-700 whitespace-pre-line">{pitch.pitchData.logoIdeas}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ViewCard moved to shared component
