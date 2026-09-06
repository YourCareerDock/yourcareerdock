'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Anchor, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
          <Anchor className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-slate-900">
            Your Career <span className="text-indigo-600">Dock</span>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}