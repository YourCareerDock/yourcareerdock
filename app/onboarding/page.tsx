'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Anchor, Briefcase, Target, BarChart3, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentJobTitle, setCurrentJobTitle] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!currentJobTitle || !targetRole || !experienceLevel) {
      setError('Please fill in every field.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        current_job_title: currentJobTitle,
        target_role: targetRole,
        experience_level: experienceLevel,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Anchor className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-slate-900">
              Your Career <span className="text-indigo-600">Dock</span>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Tell us about you</h1>
          <p className="text-slate-500 text-sm mb-6">This helps us match you with the right jobs.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current job title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                  placeholder="e.g. QA Automation Engineer"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target role</label>
              <div className="relative">
                <Target className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior QA Engineer"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Experience level</label>
              <div className="relative">
                <BarChart3 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  <option value="entry">Entry level</option>
                  <option value="mid">Mid level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead / Staff</option>
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {loading ? 'Saving...' : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}