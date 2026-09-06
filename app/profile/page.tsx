'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/sidebar'
import { User, Briefcase, Target, BarChart3 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [fullName, setFullName] = useState('')
  const [currentJobTitle, setCurrentJobTitle] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, current_job_title, target_role, experience_level')
        .eq('id', user.id)
        .single()

      if (profile) {
        setFullName(profile.full_name || '')
        setCurrentJobTitle(profile.current_job_title || '')
        setTargetRole(profile.target_role || '')
        setExperienceLevel(profile.experience_level || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        current_job_title: currentJobTitle,
        target_role: targetRole,
        experience_level: experienceLevel,
      })
      .eq('id', user.id)

    setMessage(error ? 'Error: ' + error.message : 'Profile updated.')
    setSaving(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>
  }

 return (
  <div className="min-h-screen bg-slate-50 flex">
    <Sidebar />

    <div className="flex-1 px-6 py-10 max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Your profile</h1>
        <p className="text-slate-500 mb-6">Keep this up to date for better job matches.</p>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current job title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
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

            {message && (
              <p className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg py-3 font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}