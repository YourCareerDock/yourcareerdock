'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/sidebar'
import { Job } from '@/lib/types'
import {
  Search, MapPin, Wifi, Bookmark, BookmarkCheck, ExternalLink,
  CheckCircle2, Loader2, Briefcase,
} from 'lucide-react'

export default function JobsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('target_role')
        .eq('id', user.id)
        .single()

      if (profile?.target_role) setQuery(profile.target_role)

      const { data: saved } = await supabase.from('saved_jobs').select('job_id').eq('user_id', user.id)
      if (saved) setSavedIds(new Set(saved.map((s) => s.job_id)))

      const { data: applied } = await supabase.from('applications').select('job_id').eq('user_id', user.id)
      if (applied) setAppliedIds(new Set(applied.map((a) => a.job_id)))
    }
    init()
  }, [router])

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError('')
    setSearched(true)

    try {
      const params = new URLSearchParams({ query, location, remote: String(remoteOnly) })
      const res = await fetch(`/api/jobs/search?${params}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong searching for jobs.')
        setJobs([])
      } else {
       setJobs(data.data?.jobs || [])
setSelectedJob(data.data?.jobs?.[0] || null)
      }
    } catch {
      setError('Could not reach the job search service. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function toggleSave(job: Job) {
    if (!userId) return

    if (savedIds.has(job.job_id)) {
      await supabase.from('saved_jobs').delete().eq('user_id', userId).eq('job_id', job.job_id)
      setSavedIds((prev) => {
        const next = new Set(prev)
        next.delete(job.job_id)
        return next
      })
    } else {
      await supabase.from('saved_jobs').insert({
        user_id: userId,
        job_id: job.job_id,
        job_title: job.job_title,
        company_name: job.employer_name,
        job_data: job,
      })
      setSavedIds((prev) => new Set(prev).add(job.job_id))
    }
  }

  async function handleApply(job: Job) {
    if (!userId) return

    window.open(job.job_apply_link, '_blank')

    if (!appliedIds.has(job.job_id)) {
      await supabase.from('applications').insert({
        user_id: userId,
        job_id: job.job_id,
        job_title: job.job_title,
        company_name: job.employer_name,
        job_data: job,
        status: 'applied',
      })
      setAppliedIds((prev) => new Set(prev).add(job.job_id))
    }
  }

  // Placeholder match score — real matching comes in Sprint 3 once resume data exists
  function placeholderMatch(jobId: string) {
    let hash = 0
    for (let i = 0; i < jobId.length; i++) hash = jobId.charCodeAt(i) + ((hash << 5) - hash)
    return 70 + (Math.abs(hash) % 26)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Middle column — search + results */}
        <div className="flex-1 flex flex-col border-r border-slate-200 overflow-y-auto">
          <div className="p-6 border-b border-slate-200 bg-white">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Find Your Next Opportunity</h1>
            <p className="text-slate-500 text-sm mb-4">Job title, skill, or company — a better you.</p>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, skill, or company"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="relative sm:w-48">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </form>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setRemoteOnly(!remoteOnly)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition ${
                  remoteOnly
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'border-slate-300 text-slate-500'
                }`}
              >
                <Wifi className="w-3 h-3" /> Remote only
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 space-y-3">
            {loading && (
              <div className="flex justify-center py-16 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-16 text-red-600 text-sm">{error}</div>
            )}

            {!loading && !error && searched && jobs.length === 0 && (
              <div className="text-center py-16">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No jobs found — try different keywords or location.</p>
              </div>
            )}

            {!loading && !searched && (
              <div className="text-center py-16">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Search above to find jobs matching your goals.</p>
              </div>
            )}

            {!loading && jobs.map((job) => {
              const match = placeholderMatch(job.job_id)
              const isSelected = selectedJob?.job_id === job.job_id
              return (
                <button
                  key={job.job_id}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left bg-white rounded-xl border p-4 transition ${
                    isSelected ? 'border-indigo-400 ring-1 ring-indigo-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 mb-2">
                        {job.employer_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <p className="font-medium text-slate-900 truncate">{job.job_title}</p>
                      <p className="text-sm text-slate-500 truncate">{job.employer_name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {job.job_is_remote ? 'Remote' : [job.job_city, job.job_state].filter(Boolean).join(', ')}
                        {job.job_employment_type ? ` · ${job.job_employment_type}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full shrink-0">
                      {match}% Match
                    </span>
                  </div>
                  {appliedIds.has(job.job_id) && (
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 mt-2">
                      <CheckCircle2 className="w-3 h-3" /> Applied
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right column — job details */}
        <div className="lg:w-[420px] shrink-0 overflow-y-auto p-6 bg-white">
          {!selectedJob ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
              Select a job to see details
            </div>
          ) : (
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 mb-3">
                {selectedJob.employer_name?.[0]?.toUpperCase() || '?'}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{selectedJob.job_title}</h2>
              <p className="text-slate-500 text-sm mb-4">{selectedJob.employer_name}</p>

              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                    <circle
                      cx="48" cy="48" r="40" stroke="#10b981" strokeWidth="8" fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - placeholderMatch(selectedJob.job_id) / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-900">{placeholderMatch(selectedJob.job_id)}%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-slate-400 mb-6">
                Match score placeholder — full skills matching arrives once resume upload is built (Sprint 3).
              </p>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => handleApply(selectedJob)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2"
                >
                  {appliedIds.has(selectedJob.job_id) ? 'Applied' : 'Apply Now'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => toggleSave(selectedJob)}
                  className="border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-600 hover:bg-slate-50"
                >
                  {savedIds.has(selectedJob.job_id) ? (
                    <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 mb-2">About the role</p>
                <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                  {selectedJob.job_description?.slice(0, 1200)}
                  {selectedJob.job_description?.length > 1200 ? '…' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}