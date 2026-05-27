import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

export default function Waiting() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [participants, setParticipants] = useState([])
  const [drawing, setDrawing] = useState(false)
  const channelRef = useRef(null)

  useEffect(() => {
    // Load current participants
    supabase
      .from('participants')
      .select('id, name, avatar')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setParticipants(data ?? []))

    // Realtime: new joiners + session status change
    channelRef.current = supabase
      .channel(`waiting-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
        payload => setParticipants(prev => {
          if (prev.find(p => p.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
        payload => {
          if (payload.new.status === 'complete') {
            setDrawing(true)
            setTimeout(() => navigate(`/results/${sessionId}`), 2000)
          }
        }
      )
      .subscribe()

    return () => channelRef.current?.unsubscribe()
  }, [sessionId])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center"
      >
        <Logo />

        <AnimatePresence mode="wait">
          {drawing ? (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8"
            >
              <div className="text-6xl mb-4 animate-bounce">🎲</div>
              <h2 className="text-2xl font-black text-slate-900">Teams are being drawn!</h2>
              <p className="mt-2 text-slate-500 text-sm">Revealing results now…</p>
            </motion.div>
          ) : (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mt-8 mb-6">
                <div className="flex justify-center gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-600 rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-900">Waiting for the draw</h2>
                <p className="mt-1 text-sm text-slate-500">The host will start the draw soon.</p>
              </div>

              {/* Live participant list */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 text-left">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  {participants.length} in the lobby
                </p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {participants.map(p => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-lg">{p.avatar}</span>
                        <span className="text-sm font-medium text-slate-700">{p.name}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
