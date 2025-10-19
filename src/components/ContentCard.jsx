export default function ContentCard({ title, content, onCopy, onRegenerate, isRegenerating, copied }) {
  const stringifyContent = (c) => {
    if (c == null) return ''
    if (typeof c === 'string') return c
    if (typeof c === 'number' || typeof c === 'boolean') return String(c)
    if (Array.isArray(c)) return c.map(item => stringifyContent(item)).join('\n\n')
    if (typeof c === 'object') {
      // Common structured shapes: { title, subtitle, text }
      const parts = []
      if (c.title) parts.push(String(c.title))
      if (c.subtitle) parts.push(String(c.subtitle))
      if (c.text) parts.push(String(c.text))
      if (parts.length) return parts.join('\n\n')
      try {
        return JSON.stringify(c, null, 2)
      } catch (e) {
        return String(c)
      }
    }
    return String(c)
  }

  const safeContent = stringifyContent(content)

  const handleCopy = () => {
    try {
      if (typeof onCopy === 'function') onCopy(safeContent)
      else if (navigator && navigator.clipboard) navigator.clipboard.writeText(safeContent)
    } catch (e) {
      console.error('Copy failed', e)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Copy to clipboard">
            {copied ? '✓' : 'Copy'}
          </button>
          <button onClick={onRegenerate} disabled={isRegenerating} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition disabled:opacity-50" title="Regenerate this section">
            {isRegenerating ? '...' : 'Regenerate'}
          </button>
        </div>
      </div>
      <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{safeContent}</pre>
      {/* Dev debug: show content type and keys to help diagnose [object Object] issues */}
      <div className="mt-3 text-xs text-gray-500">
        <div>Type: {typeof content}{Array.isArray(content) ? ' (array)' : ''}</div>
        {content && typeof content === 'object' && !Array.isArray(content) && (
          <div>Keys: {Object.keys(content).join(', ')}</div>
        )}
      </div>
    </div>
  )
}
