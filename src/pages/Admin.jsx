import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../lib/supabase'
import { hashPassphrase } from '../lib/crypto'
import { distributeTeams } from '../lib/distribution'
import Logo from '../components/Logo'

const AVATARS = ['⚽', '🏆', '🥅', '🎽', '👟', '🥇', '🎯', '🌍', '🔥', '⚡', '🦁', '🦅']

export default function Admin() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [authenticated, setAuthenticated] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [session, setSession] = useState(null)
  const [participants, setParticipants] = useState([])
  const [drawing, setDrawing] = useState(false)
  const [copied, setCopied] = useState(false)

  const channelRef = useRef(null)

  const joinUrl = `${window.location.origin}${window.location.pathname}#/join/${sessionId}`

  // Check localStorage for admin token on mount
  useEffect(() => {
    const stored = localStorage.getItem(`admin_token_${sessionId}`)
    if (stored) {
      setAuthenticated(true)
      loadSession()
    }
  }, [sessionId])

  useEffect(() => {
    if (!authenticated) return
    loadSession()
    setupRealtime()
    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [authenticated, sessionId])

  async function loadSession() {
    const { data: sess } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    setSession(sess)
    if (sess?.status === 'complete') navigate(`/results/${sessionId}`)

    const { data: parts } = await supabase
      .from('participants')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
    setParticipants(parts ?? [])
  }

  function setupRealtime() {
    channelRef.current = supabase
      .channel(`admin-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
        payload => setParticipants(prev => [...prev, payload.new])
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        payload => {
          setSession(payload.new)
          if (payload.new.status === 'complete') navigate(`/results/${sessionId}`)
        }
      )
      .subscribe()
  }

  async function verifyPassphrase(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const token = await hashPassphrase(passphrase)
      const { data } = await supabase
        .from('sessions')
        .select('admin_token')
        .eq('id', sessionId)
        .single()
      if (!data || data.admin_token !== token) throw new Error('Wrong passphrase')
      localStorage.setItem(`admin_token_${sessionId}`, token)
      setAuthenticated(true)
    } catch {
      setAuthError('Wrong passphrase. Try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  async function startDraw() {
    if (participants.length === 0) return
    setDrawing(true)
    try {
      const assigned = distributeTeams(participants)
      // Batch-update each participant's teams
      await Promise.all(
        assigned.map((p, i) =>
          supabase
            .from('participants')
            .update({ teams: p.teams, pick_order: i })
            .eq('id', p.id)
        )
      )
      await supabase
        .from('sessions')
        .update({ status: 'complete' })
        .eq('id', sessionId)
      navigate(`/results/${sessionId}`)
    } catch (err) {
      console.error(err)
      setDrawing(false)
    }
  }

  function copyId() {
    navigator.clipboard.writeText(sessionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Auth wall
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Logo />
          <h2 className="mt-6 text-2xl font-black text-slate-900">Admin access</h2>
          <p className="mt-1 text-sm text-slate-500">Enter your passphrase to manage this session.</p>
          <form onSubmit={verifyPassphrase} className="mt-6 space-y-3">
            <input
              type="password"
              placeholder="Passphrase"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
              autoFocus
            />
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {authLoading ? 'Checking…' : 'Unlock'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Logo />
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-wide">
            Admin
          </span>
        </div>

        {/* QR Code card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-4"
        >
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Scan to join</p>
          <div className="p-3 bg-white border-2 border-slate-100 rounded-xl">
            <QRCodeSVG value={joinUrl} size={200} fgColor="#042A4E" />
          </div>
          <button
            onClick={copyId}
            className="flex items-center gap-2 text-xs font-mono bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors text-slate-600 max-w-full"
          >
            <span className="truncate">{sessionId}</span>
            <span className="shrink-0">{copied ? '✓' : '⎘'}</span>
          </button>
          <p className="text-xs text-slate-400 text-center">
            Share this QR code or paste the ID into the homepage
          </p>
        </motion.div>

        {/* Participants lobby */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">
              Lobby
            </h2>
            <span className="text-sm font-semibold text-blue-700">
              {participants.length} joined
            </span>
          </div>

          {participants.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Waiting for players to scan…
            </p>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {participants.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0"
                  >
                    <span className="text-xl">{p.avatar}</span>
                    <span className="font-medium text-slate-900 text-sm">{p.name}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Draw button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <button
            onClick={startDraw}
            disabled={participants.length === 0 || drawing}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 font-black text-lg py-5 rounded-2xl transition-colors disabled:cursor-not-allowed"
          >
            {drawing ? '🎲 Drawing teams…' : `Draw! (${participants.length} player${participants.length !== 1 ? 's' : ''})`}
          </button>
          {participants.length === 0 && (
            <p className="mt-2 text-center text-xs text-slate-400">
              At least one player must join before you can draw.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
