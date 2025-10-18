export default function ContentCard({ title, content, onCopy, onRegenerate, isRegenerating, copied }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        <div className="flex gap-2">
          <button onClick={() => onCopy(content)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition" title="Copy to clipboard">
            {copied ? '✓' : 'Copy'}
          </button>
          <button onClick={onRegenerate} disabled={isRegenerating} className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition disabled:opacity-50" title="Regenerate this section">
            {isRegenerating ? '...' : 'Regenerate'}
          </button>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  )
}
