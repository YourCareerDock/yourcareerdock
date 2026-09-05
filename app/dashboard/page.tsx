'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
  .from('profiles')
  .select('full_name, onboarding_completed')
  .eq('id', user.id)
  .single()

if (!profile?.onboarding_completed) {
  router.push('/onboarding')
  return
}

setFullName(profile?.full_name || '')
setLoading(false)
    }

    loadUser()
  }, [router])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome{fullName ? `, ${fullName}` : ''}
          </h1>
          <div className="flex gap-4 items-center">
  <button
    onClick={() => router.push('/profile')}
    className="text-sm text-slate-500 hover:text-slate-700"
  >
    Profile
  </button>
  <button
    onClick={handleLogout}
    className="text-sm text-slate-500 hover:text-slate-700"
  >
    Log out
  </button>
</div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-slate-500">This is your home dashboard. More coming soon.</p>
        </div>
      </div>
    </div>
  )
}
