import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '@/lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await loginUser(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f2027] via-[#2c5364] to-[#f7971e] px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">⚡ PitchCraft</Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white drop-shadow-lg">Welcome Back! 👋</h2>
          <p className="mt-2 text-yellow-100">Sign in to your account</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg py-10 px-8 shadow-2xl rounded-3xl border border-yellow-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm shadow animate-pulse">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-yellow-900 mb-2">Email Address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition bg-yellow-50 placeholder-yellow-300" placeholder="your@email.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-yellow-900 mb-2">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition bg-yellow-50 placeholder-yellow-300" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 shadow-lg hover:from-orange-400 hover:to-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <span className="animate-pulse">Signing in...</span> : <span>Sign In 🚀</span>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-yellow-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-yellow-300 hover:text-orange-400">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
