import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { logoutUser } from '@/lib/auth'
import { getUserPitches, deletePitch } from '@/lib/database'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useStore((state) => state.user)
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadPitches()
  }, [user])

  const loadPitches = async () => {
    if (!user) return
    setLoading(true)
    const userPitches = await getUserPitches(user.uid)
    setPitches(userPitches)
    setLoading(false)
  }

  const handleLogout = async () => {
    await logoutUser()
    navigate('/')
  }

  const handleDelete = async (pitchId) => {
    if (!confirm('Are you sure you want to delete this pitch?')) return
    const result = await deletePitch(pitchId)
    if (result.success) setPitches(pitches.filter((p) => p.id !== pitchId))
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0f2027] via-[#2c5364] to-[#f7971e]">
      <nav className="sticky top-0 z-10 bg-white/10 backdrop-blur-md border-b border-yellow-200/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="text-2xl font-extrabold text-yellow-300 drop-shadow">⚡ PitchCraft</Link>
          <button onClick={handleLogout} className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-400 to-rose-500 text-white shadow hover:from-rose-500 hover:to-red-400 transition">Logout</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full px-6 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow mb-3">Welcome Back! 👋</h1>
          <p className="text-lg text-yellow-100 mb-8">Apne pitches ko manage karo ya naya pitch banao</p>
          <Link to="/create" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 shadow-lg hover:from-orange-400 hover:to-yellow-300 transition">Create New Pitch ✨</Link>
        </header>

        <section>
          <h2 className="text-2xl font-extrabold text-white/90 drop-shadow mb-6">Your Pitches ({pitches.length})</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-300 border-t-transparent"></div>
              <p className="mt-4 text-yellow-100">Loading...</p>
            </div>
          ) : pitches.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-yellow-200">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-extrabold text-white drop-shadow mb-2">No Pitches Yet</h3>
              <p className="text-yellow-100 mb-6">Abhi tak koi pitch nahi banaya? Let's create your first one!</p>
              <Link to="/create" className="inline-block px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 shadow hover:from-orange-400 hover:to-yellow-300">Create Your First Pitch</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pitches.map((pitch) => (
                <div key={pitch.id} className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-yellow-200">
                  <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-white drop-shadow mb-2">{pitch.pitchData.startupName}</h3>
                    <p className="text-sm text-yellow-200 font-semibold mb-2">{pitch.pitchData.tagline}</p>
                    <p className="text-sm text-white/90 line-clamp-3">{pitch.pitchData.elevatorPitch}</p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-yellow-200/50">
                    <p className="text-xs text-yellow-100">Industry: <span className="font-semibold text-white">{pitch.ideaData.industry}</span></p>
                    <p className="text-xs text-yellow-100">Created: {new Date(pitch.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/pitch/${pitch.id}`} className="flex-1 text-center px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 shadow hover:from-orange-400 hover:to-yellow-300 transition text-sm">View</Link>
                    <button onClick={() => handleDelete(pitch.id)} className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-400 to-rose-500 text-white shadow hover:from-rose-500 hover:to-red-400 transition text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
