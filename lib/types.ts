export interface Job {
  job_id: string
  job_title: string
  employer_name: string
  job_city?: string
  job_state?: string
  job_is_remote: boolean
  job_employment_type?: string
  job_description: string
  job_apply_link: string
  job_posted_at_datetime_utc?: string
  job_min_salary?: number
  job_max_salary?: number
}