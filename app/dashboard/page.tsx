'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/sidebar'
import { Search, FileText, GraduationCap, Sparkles } from 'lucide-react'

const upcomingFeatures = [
  { icon: Search, title: 'Job Search', description: 'Find roles that match your profile.', status: 'Coming in Sprint 2' },
  { icon: FileText, title: 'Resume Analyzer', description: 'Get AI feedback tailored to a job.', status: 'Coming in Sprint 3' },
  { icon: GraduationCap, title: 'Interview Practice', description: 'Practice with AI-generated questions.', status: 'Coming in Sprint 4' },
]

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [targetRole, setTargetRole] = useState('')

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, target_role, onboarding_completed')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_completed) {
        router.push('/onboarding')
        return
      }

      setFullName(profile?.full_name || '')
      setTargetRole(profile?.target_role || '')
      setLoading(false)
    }

    loadUser()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>
  }

  return (
  <div className="min-h-screen bg-slate-50 flex">
    <Sidebar />

    <div className="flex-1 px-6 py-10 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-8 text-white mb-8">
          <p className="text-sm text-blue-100 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Welcome back
          </p>
          <h1 className="text-3xl font-bold mb-2">
            {fullName ? `Hi, ${fullName}` : 'Hi there'}
          </h1>
          <p className="text-blue-100">
            {targetRole
              ? `Let's keep working toward your goal: ${targetRole}.`
              : "Let's get your career journey started."}
          </p>
        </div>

        <h2 className="text-lg font-semibold text-slate-900 mb-4">What's coming next</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {upcomingFeatures.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="font-medium text-slate-900 mb-1">{f.title}</p>
              <p className="text-sm text-slate-500 mb-3">{f.description}</p>
              <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">
                {f.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}