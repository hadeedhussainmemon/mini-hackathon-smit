import { Link } from 'react-router-dom'

export default function PageTopBar({ leftTo = '/', leftLabel = 'Home', right }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={leftTo} className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold">
          ← {leftLabel}
        </Link>
        <div className="flex items-center gap-2">
          {right}
        </div>
      </div>
    </nav>
  )
}
