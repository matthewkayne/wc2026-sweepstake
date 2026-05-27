import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const AVATARS = ['⚽', '🏆', '🥅', '🎽', '👟', '🥇', '🎯', '🌍', '🔥', '⚡', '🦁', '🦅', '🐉', '🌟', '💎', '🎪']

export default function Join() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(AVATARS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState(null)
  const [drawStarted, setDrawStarted] = useState(false)
  const channelRef = useRef(null)

  useEffect(() => {
    // If this device already joined this session, skip straight to waiting
    const existingId = localStorage.getItem(`participant_id_${sessionId}`)
    if (existingId) {
      navigate(`/waiting/${sessionId}`, { replace: true })
      return
    }

    supabase
      .from('sessions')
      .select('status')
      .eq('id', sessionId)
      .single()
      .then(({ data }) => {
        if (!data) { setError('Session not found.'); return }
        setSession(data)
        if (data.status === 'complete') navigate(`/results/${sessionId}`, { replace: true })
      })

    // Watch for the draw starting while the user is mid-form
    channelRef.current = supabase
      .channel(`join-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        payload => {
          if (payload.new.status === 'complete') setDrawStarted(true)
        }
      )
      .subscribe()

    return () => channelRef.current?.unsubscribe()
  }, [sessionId])

  async function join(e) {
    e.preventDefault()
    if (!name.trim() || drawStarted) return
    setLoading(true)
    setError('')
    try {
      // Re-check status at submit time to close the race window
      const { data: sess } = await supabase
        .from('sessions')
        .select('status')
        .eq('id', sessionId)
        .single()
      if (sess?.status === 'complete') {
        navigate(`/results/${sessionId}`, { replace: true })
        return
      }

      const { data, error: err } = await supabase
        .from('participants')
        .insert({ session_id: sessionId, name: name.trim(), avatar })
        .select('id')
        .single()
      if (err) throw err
      localStorage.setItem(`participant_id_${sessionId}`, data.id)
      navigate(`/waiting/${sessionId}`)
    } catch {
      setError('Could not join. The session may have already started.')
    } finally {
      setLoading(false)
    }
  }

  if (error && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">😕</p>
          <p className="font-bold text-slate-900">{error}</p>
        </div>
      </div>
    )
  }

  if (drawStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl mb-4">🎲</p>
          <p className="font-black text-xl text-slate-900">The draw has started!</p>
          <p className="mt-2 text-sm text-slate-500">You were too late to join this round.</p>
          <button
            onClick={() => navigate(`/results/${sessionId}`)}
            className="mt-6 bg-blue-700 text-white font-bold px-6 py-3 rounded-xl"
          >
            Watch the results
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <Logo />
        <h1 className="mt-4 text-2xl font-black text-slate-900">Join the draw</h1>
        <p className="mt-1 text-sm text-slate-500">Enter your name and pick an avatar.</p>

        <form onSubmit={join} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Your name</label>
            <input
              type="text"
              placeholder="e.g. Matt"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pick an avatar</label>
            <div className="grid grid-cols-8 gap-2">
              {AVATARS.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setAvatar(em)}
                  className={`text-xl aspect-square flex items-center justify-center rounded-lg border-2 transition-all ${
                    avatar === em
                      ? 'border-blue-600 bg-blue-50 scale-110'
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3">
            <span className="text-2xl">{avatar}</span>
            <span className="font-bold text-slate-900">{name || 'Your name'}</span>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black py-4 rounded-xl transition-colors disabled:opacity-50 text-base"
          >
            {loading ? 'Joining…' : "I'm in!"}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
