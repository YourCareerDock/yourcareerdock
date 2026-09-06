'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Anchor, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck,
  Search, FileText, BarChart3, GraduationCap, TrendingUp, Database,
} from 'lucide-react'

const features = [
  { icon: Search, title: 'Personalized Job Matches', description: 'Find opportunities that fit your skills and goals.' },
  { icon: FileText, title: 'AI Resume Tailoring', description: 'Create and customize resumes that get noticed.' },
  { icon: Database, title: 'Top Companies Database', description: 'Explore interview insights, hiring trends, salaries and more.' },
  { icon: BarChart3, title: 'Real Interview Insights', description: 'See what candidates say. Know what to expect.' },
  { icon: GraduationCap, title: 'Practice & Prepare', description: 'AI-powered mock interviews and feedback.' },
  { icon: TrendingUp, title: 'Track Your Progress', description: 'Stay motivated. See real results.' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in every field.')
      return
    }

    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — brand + features, hidden on mobile */}
      <div
        className="hidden lg:flex flex-col justify-between text-white p-12 relative overflow-hidden bg-cover bg-center flex-1"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(8,12,30,0.88), rgba(8,12,30,0.94)), url('/signup-bg1.jpeg')`,
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="w-7 h-7 text-sky-400" />
            <span className="text-xl font-semibold">
              Your Career{' '}
              <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                Dock
              </span>
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-8 tracking-wide">Navigate · Prepare · Get Hired</p>

          <h1 className="text-5xl font-bold leading-tight mb-5">
            Welcome back to your{' '}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              career journey
            </span>
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-lg">
            Pick up right where you left off — your jobs, resume, and prep are all waiting.
          </p>

          <div className="flex gap-8 mb-10">
            <div>
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-xs text-slate-400">Jobs added monthly</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">2.5K+</p>
              <p className="text-xs text-slate-400">Interviews prepped</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1K+</p>
              <p className="text-xs text-slate-400">Users hired</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            {features.map((f) => (
              <div key={f.title} className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-sky-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-slate-400">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 mt-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-slate-200 italic">
              &ldquo;Every application you send is one step closer. Your next opportunity is already looking for you.&rdquo;
            </p>
            <p className="text-xs text-slate-400 mt-2">— Your Career Dock</p>
          </div>
        </div>
      </div>

      {/* Right panel — the actual form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 bg-slate-50 lg:w-[480px] shrink-0">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex justify-end mb-8 text-sm text-slate-500">
            Don&apos;t have an account?
            <a href="/signup" className="text-indigo-600 font-medium ml-1">Sign up</a>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-6">Log in to continue your journey.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-sm text-slate-400 bg-white cursor-not-allowed"
            >
              Google
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-2.5 text-sm text-slate-400 bg-white cursor-not-allowed"
            >
              LinkedIn
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-400">or</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-indigo-600 font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {loading ? 'Logging in...' : (
                <>Log in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 bg-slate-100 rounded-lg p-4 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-800">Your data is safe with us</p>
              <p className="text-xs text-slate-500">
                We take your privacy seriously. Your information is encrypted and never shared without consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}