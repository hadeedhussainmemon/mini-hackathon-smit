import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '@/lib/auth'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    const result = await registerUser(email, password, name)
    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Registration failed. Please try again.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f2027] via-[#2c5364] to-[#f7971e] px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg">⚡ PitchCraft</Link>
          <h2 className="mt-6 text-3xl font-extrabold text-white drop-shadow-lg">Create Your Account 🎉</h2>
          <p className="mt-2 text-yellow-100">Sign up to get started</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg py-10 px-8 shadow-2xl rounded-3xl border border-yellow-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm shadow animate-pulse">{error}</div>
            )}

            <div>
              <label htmlFor="name" className="block text-lg font-bold text-yellow-900 mb-2">Full Name</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition bg-yellow-50 placeholder-yellow-300" placeholder="Your Name" />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-yellow-900 mb-2">Email Address</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition bg-yellow-50 placeholder-yellow-300" placeholder="your@email.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-yellow-900 mb-2">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition bg-yellow-50 placeholder-yellow-300" placeholder="••••••••" minLength={6} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-bold text-yellow-900 mb-2">Confirm Password</label>
              <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border-2 border-yellow-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 p-4 text-lg transition bg-yellow-50 placeholder-yellow-300" placeholder="••••••••" minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold text-xl bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 shadow-lg hover:from-orange-400 hover:to-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Creating Account...' : 'Create Account 🚀'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-yellow-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-yellow-300 hover:text-orange-400">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
