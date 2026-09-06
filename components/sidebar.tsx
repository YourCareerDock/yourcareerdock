'use client'

import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Anchor, Home, Search, Bookmark, Briefcase, GraduationCap,
  Dumbbell, FileText, MessageSquare, Settings, LogOut, Sparkles, Lock,
} from 'lucide-react'

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', enabled: true },
  { label: 'Jobs', icon: Search, href: '/jobs', enabled: true },
  { label: 'Saved Jobs', icon: Bookmark, href: '/jobs/saved', enabled: true },
  { label: 'Applications', icon: Briefcase, href: '/jobs/applications', enabled: true },
  { label: 'Resumes', icon: FileText, href: '/resumes', enabled: false },
  { label: 'Interviews', icon: MessageSquare, href: '/interviews', enabled: false },
  { label: 'Practice', icon: Dumbbell, href: '/practice', enabled: false },
  { label: 'Learn', icon: GraduationCap, href: '/learn', enabled: false },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-slate-950 text-white h-screen sticky top-0 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <Anchor className="w-6 h-6 text-sky-400" />
        <span className="font-semibold text-sm">
          Your Career <span className="text-sky-400">Dock</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <button
              key={item.label}
              onClick={() => item.enabled && router.push(item.href)}
              disabled={!item.enabled}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition
                ${isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                ${!item.enabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400' : ''}
              `}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {!item.enabled && <Lock className="w-3 h-3" />}
            </button>
          )
        })}
      </nav>

      <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-4 h-4" />
          <p className="text-sm font-semibold">Upgrade to Pro</p>
        </div>
        <p className="text-xs text-blue-100 mb-3">Get advanced insights and personalized guidance.</p>
        <button className="w-full bg-white text-indigo-700 text-xs font-medium rounded-lg py-2">
          Upgrade now
        </button>
      </div>

      <div className="space-y-1 border-t border-white/10 pt-3">
        <button
          onClick={() => router.push('/profile')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}