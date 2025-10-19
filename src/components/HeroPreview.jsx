import React from 'react'

function normalizeContent(c) {
  if (!c) return { title: '', subtitle: '', cta: 'Get Started' }
  if (typeof c === 'string') {
    const lines = c.split('\n').map(l => l.trim()).filter(Boolean)
    return { title: lines[0] || '', subtitle: lines.slice(1).join('\n') || '', cta: 'Get Started' }
  }
  if (typeof c === 'object') {
    return {
      title: c.title || c.heading || c.headline || '',
      subtitle: c.subtitle || c.text || c.body || c.description || '',
      cta: c.cta || c.ctaLabel || 'Get Started'
    }
  }
  return { title: String(c), subtitle: '', cta: 'Get Started' }
}

export default function HeroPreview({ content, colors }) {
  const { title, subtitle, cta } = normalizeContent(content)
  // Use first color as background accent if available
  const bg = Array.isArray(colors) && colors[0] ? colors[0] : '#6dd5ed'
  const fg = '#0f172a'

  return (
    <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: `linear-gradient(135deg, ${bg} 0%, #ffffff 100%)` }}>
      <div className="p-12 text-center" style={{ color: fg }}>
        <h2 className="text-4xl font-extrabold mb-4">{title}</h2>
        {subtitle && <p className="text-lg mb-6 text-gray-800 whitespace-pre-line">{subtitle}</p>}
        <div>
          <button className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700">{cta}</button>
        </div>
      </div>
    </div>
  )
}
