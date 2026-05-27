import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import TeamCard from '../components/TeamCard'
import Logo from '../components/Logo'

export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [resetting, setResetting] = useState(false)
  const channelRef = useRef(null)

  const myId       = localStorage.getItem(`participant_id_${sessionId}`)
  const adminToken = localStorage.getItem(`admin_token_${sessionId}`)
  const isAdmin    = !!adminToken

  useEffect(() => {
    supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('pick_order', { ascending: true })
      .then(({ data, error }) => {
        // Always clear the spinner — even on error
        setLoading(false)
        if (error || !data) { setFetchError(true); return }
        const sorted = myId
          ? [...data.filter(p => p.id === myId), ...data.filter(p => p.id !== myId)]
          : data
        setParticipants(sorted)
      })

    channelRef.current = supabase
      .channel(`results-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        payload => {
          if (payload.new.status === 'lobby') {
            navigate(isAdmin ? `/admin/${sessionId}` : `/waiting/${sessionId}`, { replace: true })
          }
        }
      )
      .subscribe()

    return () => channelRef.current?.unsubscribe()
  }, [sessionId])

  async function resetDraw() {
    setResetting(true)
    try {
      // Change session status FIRST — this triggers the realtime redirect for all watchers
      // before they can see the "No teams" flash from the participant update below.
      await supabase
        .from('sessions')
        .update({ status: 'lobby' })
        .eq('id', sessionId)

      await supabase
        .from('participants')
        .update({ teams: null, pick_order: null })
        .eq('session_id', sessionId)

      // Admin navigates via the realtime listener above, so no explicit navigate() here.
    } catch {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Loading results…</div>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="font-bold text-slate-900">Could not load results</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-blue-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  const totalTeams = participants.reduce((sum, p) => sum + (Array.isArray(p.teams) ? p.teams.length : 0), 0)

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Logo size="lg" />
          <h1 className="mt-3 text-3xl font-black text-slate-900">The Draw</h1>
          <p className="mt-1 text-sm text-slate-500">
            {participants.length} player{participants.length !== 1 ? 's' : ''} · {totalTeams} team{totalTeams !== 1 ? 's' : ''} assigned
          </p>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between bg-white border-2 border-slate-100 rounded-2xl px-5 py-4"
          >
            <div>
              <p className="font-semibold text-sm text-slate-900">Need to add more players?</p>
              <p className="text-xs text-slate-400 mt-0.5">Resets the draw and reopens the lobby.</p>
            </div>
            <button
              onClick={resetDraw}
              disabled={resetting}
              className="shrink-0 ml-4 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
            >
              {resetting ? 'Resetting…' : 'Reset draw'}
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          {participants.map((p, pi) => {
            const isMe  = p.id === myId
            const teams = Array.isArray(p.teams) ? p.teams : []

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={`bg-white rounded-2xl border-2 p-5 ${
                  isMe ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{p.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{p.name}</span>
                      {isMe && (
                        <span className="text-xs font-bold bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {teams.length} team{teams.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {teams.map((team, ti) => (
                    <TeamCard key={team.id} team={team} delay={pi * 0.08 + ti * 0.12} revealed />
                  ))}
                  {teams.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-2">No teams assigned</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: participants.length * 0.08 + 0.3 }}
          className="mt-8 text-center text-xs text-slate-400"
        >
          Good luck everyone! 🏆
        </motion.p>
      </div>
    </div>
  )
}
