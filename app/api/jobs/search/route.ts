import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query') || 'Software Engineer'
  const location = searchParams.get('location') || ''
  const remoteOnly = searchParams.get('remote') === 'true'

  const fullQuery = location ? `${query} in ${location}` : query
  const url = new URL('https://jsearch.p.rapidapi.com/search-v2')
  url.searchParams.set('query', fullQuery)
  url.searchParams.set('num_pages', '1')
  url.searchParams.set('country', 'us')
  url.searchParams.set('date_posted', 'all')
  if (remoteOnly) url.searchParams.set('remote_jobs_only', 'true')

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `JSearch API error: ${response.status}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: String(error) },
      { status: 500 }
    )
  }
}