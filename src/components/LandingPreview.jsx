import React from 'react'
import HeroPreview from './HeroPreview'

function FeatureBlock({ title, content }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  )
}

export default function LandingPreview({ pitch }) {
  const colors = Array.isArray(pitch.colorPalette) ? pitch.colorPalette : []
  const accent = colors[0] || '#6dd5ed'

  const features = [
    { title: 'Elevator Pitch', content: pitch.elevatorPitch || '' },
    { title: 'Problem', content: pitch.problemStatement || '' },
    { title: 'Solution', content: pitch.solutionStatement || '' },
  ]

  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ background: `linear-gradient(90deg, ${accent} 0%, #ffffff 100%)` }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-extrabold text-xl">{pitch.startupName || 'Startup'}</div>
            <div className="text-sm text-gray-800 opacity-80">{pitch.tagline || ''}</div>
          </div>
          <div>
            <button className="px-4 py-2 bg-white rounded shadow">Get Started</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <HeroPreview content={pitch.landingPageHero || ''} colors={colors} />

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {features.map((f, i) => (
              <FeatureBlock key={i} title={f.title} content={f.content} />
            ))}
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded">
            <h4 className="font-bold mb-3">Logo Ideas</h4>
            <p className="text-sm text-gray-700">{pitch.logoIdeas || ''}</p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <div className="font-bold">{pitch.startupName || 'Startup'}</div>
          <div className="text-sm opacity-80">{pitch.tagline || ''}</div>
        </div>
      </footer>
    </div>
  )
}
