export interface NasaApod {
  date: string
  explanation: string
  hdurl?: string
  url: string
  title: string
}

const API_KEY = "EHpzQK4ShiI4ZlpLStmEjchbluFvhvK02WQJuIwU" 
const BASE_URL = "https://api.nasa.gov/planetary/apod"

export async function fetchApod(date?: string): Promise<NasaApod> {
  const url = new URL(BASE_URL)
  url.searchParams.set("api_key", API_KEY)
  if (date) url.searchParams.set("date", date)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`NASA API error: ${res.status}`)
  return (await res.json()) as NasaApod
}
