import { Link } from 'react-router-dom'
import { isFirebaseConfigured } from '@/lib/firebase'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f2027] via-[#2c5364] to-[#f7971e]">
      {!isFirebaseConfigured && (
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-800">
          <div className="container mx-auto px-6 py-3 text-sm">
            Missing Firebase environment variables. Open <code>.env</code> and fill VITE_FIREBASE_* keys, then restart. See <strong>GEMINI_API_SETUP.md</strong> for help.
          </div>
        </div>
      )}
      {/* Main content */}
      <div className="relative">
        <nav className="container mx-auto px-8 py-8 flex justify-between items-center bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg mt-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-yellow-300 drop-shadow-lg">⚡</span>
            <span className="text-2xl font-bold text-white tracking-wide">PitchCraft</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 rounded-xl font-bold shadow hover:scale-105 transition">Login</Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-[#f7971e] to-[#2c5364] text-white rounded-xl font-bold shadow hover:scale-105 transition">Sign Up</Link>
          </div>
        </nav>

        <div className="container mx-auto px-8 py-24 text-center">
          <div className="inline-block bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl px-12 py-16">
            <h1 className="text-6xl font-extrabold text-yellow-200 mb-6 drop-shadow-lg animate-fade-in">Unleash Your Startup 🚀</h1>
            <p className="text-2xl text-white/90 mb-4">AI-powered pitch creation for the next generation</p>
            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">Transform your ideas into stunning, investor-ready pitches in seconds. No templates, just pure AI magic.</p>
            <Link to="/register" className="inline-block px-10 py-5 bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 rounded-2xl font-extrabold text-xl shadow-xl hover:scale-105 transition">Start Free ✨</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-20">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-white drop-shadow-lg">Why PitchCraft?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl card-hover text-center border border-yellow-200">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3 text-yellow-900">Smart Names & Taglines</h3>
            <p className="text-yellow-900/80">Creative, AI-generated branding for your startup</p>
          </div>
          <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl card-hover text-center border border-yellow-200">
            <div className="text-5xl mb-4">🗣️</div>
            <h3 className="text-xl font-bold mb-3 text-yellow-900">Elevator Pitch</h3>
            <p className="text-yellow-900/80">Explain your startup in 2-3 sentences, instantly</p>
          </div>
          <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl card-hover text-center border border-yellow-200">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-3 text-yellow-900">Target Audience</h3>
            <p className="text-yellow-900/80">Identify your ideal customers with AI</p>
          </div>
          <div className="bg-white/30 backdrop-blur-lg p-8 rounded-2xl shadow-xl card-hover text-center border border-yellow-200">
            <div className="text-5xl mb-4">�</div>
            <h3 className="text-xl font-bold mb-3 text-yellow-900">Landing Page Copy</h3>
            <p className="text-yellow-900/80">Instant, ready-to-use website content</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#f7971e] via-[#2c5364] to-[#0f2027] py-20">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-white drop-shadow-lg">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center space-x-6 bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
              <div className="flex-shrink-0 w-14 h-14 bg-yellow-300 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-100">Enter Your Idea</h3>
                <p className="text-yellow-100/80">Just describe your startup and select an industry</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
              <div className="flex-shrink-0 w-14 h-14 bg-yellow-300 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-100">AI Magic ✨</h3>
                <p className="text-yellow-100/80">Gemini AI understands your idea and generates a complete pitch</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
              <div className="flex-shrink-0 w-14 h-14 bg-yellow-300 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-lg">3</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-yellow-100">Export & Share 🚀</h3>
                <p className="text-yellow-100/80">Save, export, or share your pitch instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-8 py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-6 text-yellow-200 drop-shadow-lg">Ready to Build Your Pitch?</h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">Join thousands of founders and students turning ideas into reality</p>
        <Link to="/register" className="inline-block px-10 py-5 bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-900 rounded-2xl font-extrabold text-xl shadow-xl hover:scale-105 transition">Start Now - It's Free! 🎉</Link>
      </div>

      <footer className="bg-gradient-to-r from-[#2c5364] to-[#f7971e] text-white py-10 mt-10">
        <div className="container mx-auto px-8 text-center">
          <p className="text-lg mb-2 font-bold">PitchCraft — AI-powered ideas for the world</p>
          <p className="text-sm opacity-80">Made with ❤️ for dreamers and creators</p>
        </div>
      </footer>
    </div>
  )
}
