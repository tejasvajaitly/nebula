'use client'

import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

export default function Home() {
  const [githubSessions, setGithubSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [githubUsername, setGithubUsername] = useState('')
  const [sessionKey, setSessionKey] = useState('')
  
  // Clerk user and session hooks
  const { user } = useUser()
  const { session } = useSession()



  // Create Supabase client with Clerk JWT authentication
  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            const clerkToken = await session?.getToken({ template: 'supabase' })
            const headers = new Headers(options?.headers)
            console.log("clerkToken",clerkToken)
            headers.set('Authorization', `Bearer ${clerkToken}`)
            return fetch(url, { ...options, headers })
          },
        },
      },
    )
  }

  const client = createClerkSupabaseClient()

  // Fetch GitHub sessions for the logged-in organization
  useEffect(() => {
    if (!user) return

    async function loadGithubSessions() {
      setLoading(true)
      const { data, error } = await client.from('github_sessions').select('*')
      if (!error) setGithubSessions(data)
      setLoading(false)
    }

    loadGithubSessions()
  }, [user])

  // Create a new GitHub session
  async function createGithubSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await client.from('github_sessions').insert({
      github_account_id: githubUsername,
      session_key: sessionKey,
    })
    window.location.reload()
  }

  // Delete a GitHub session
  async function deleteGithubSession(sessionId: number) {
    await client.from('github_sessions').delete().eq('id', sessionId)
    window.location.reload()
  }

  return (
    <div>
      <h1>GitHub Sessions</h1>

      {loading && <p>Loading...</p>}

      {!loading &&
        githubSessions.length > 0 &&
        githubSessions.map((session: any) => (
          <div key={session.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p><strong>Username:</strong> {session.github_account_id}</p>
            <p><strong>Session Key:</strong> {session.session_key}</p>
            <button onClick={() => deleteGithubSession(session.id)}>Delete</button>
          </div>
        ))}

      {!loading && githubSessions.length === 0 && <p>No GitHub sessions found</p>}

      <form onSubmit={createGithubSession}>
        <input
          type="text"
          name="github_username"
          placeholder="GitHub Username"
          onChange={(e) => setGithubUsername(e.target.value)}
          value={githubUsername}
        />
        <input
          type="text"
          name="session_key"
          placeholder="Session Key"
          onChange={(e) => setSessionKey(e.target.value)}
          value={sessionKey}
        />
        <button type="submit">Add GitHub Session</button>
      </form>
    </div>
  )
}