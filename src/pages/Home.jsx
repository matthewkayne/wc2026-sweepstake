import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { hashPassphrase } from '../lib/crypto'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

export default function Home() {
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin]     = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [sessionCode, setSessionCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function createSession(e) {
    e.preventDefault()
    if (!passphrase.trim()) return
    setLoading(true)
    setError('')
    try {
      const token = await hashPassphrase(passphrase)
      const { data, error: err } = await supabase
        .from('sessions')
        .insert({ admin_token: token, status: 'lobby' })
        .select('id')
        .single()
      if (err) throw err
      localStorage.setItem(`admin_token_${data.id}`, token)
      navigate(`/admin/${data.id}`)
    } catch (err) {
      setError('Could not create session. Check your Supabase connection.')
    } finally {
      setLoading(false)
    }
  }

  async function joinSession(e) {
    e.preventDefault()
    const code = sessionCode.trim()
    if (!code) return
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await supabase
        .from('sessions')
        .select('id, status')
        .eq('id', code)
        .single()
      if (err || !data) throw new Error('Session not found')
      if (data.status === 'complete') {
        navigate(`/results/${data.id}`)
      } else {
        navigate(`/join/${data.id}`)
      }
    } catch {
      setError('Session not found. Check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <Logo size="lg" />
          <h1 className="mt-3 text-3xl font-black text-slate-900 leading-tight">
            World Cup Sweepstake
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Scan a QR code, get your teams, win the pot.
          </p>
        </div>

        {/* Action cards */}
        <div className="space-y-3">
          <button
            onClick={() => { setShowCreate(true); setShowJoin(false); setError('') }}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-colors text-left flex items-center justify-between group"
          >
            <div>
              <p className="text-base font-bold">Create session</p>
              <p className="text-blue-300 text-sm font-normal">I'm hosting the sweepstake</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={() => { setShowJoin(true); setShowCreate(false); setError('') }}
            className="w-full border-2 border-slate-200 hover:border-blue-300 bg-white text-slate-900 font-bold py-4 px-6 rounded-xl transition-colors text-left flex items-center justify-between group"
          >
            <div>
              <p className="text-base font-bold">Enter session code</p>
              <p className="text-slate-400 text-sm font-normal">I have a code from the host</p>
            </div>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          {(showCreate || showJoin) && (
            <motion.div
              key={showCreate ? 'create' : 'join'}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <form
                onSubmit={showCreate ? createSession : joinSession}
                className="mt-4 bg-white border-2 border-slate-100 rounded-xl p-5 space-y-3"
              >
                {showCreate && (
                  <>
                    <label className="block text-sm font-semibold text-slate-700">
                      Set an admin passphrase
                    </label>
                    <input
                      type="password"
                      placeholder="e.g. worldcup2026"
                      value={passphrase}
                      onChange={e => setPassphrase(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      autoFocus
                    />
                    <p className="text-xs text-slate-400">
                      You'll need this if you open the admin page on a different device.
                    </p>
                  </>
                )}
                {showJoin && (
                  <>
                    <label className="block text-sm font-semibold text-slate-700">
                      Session ID
                    </label>
                    <input
                      type="text"
                      placeholder="Paste the session ID here"
                      value={sessionCode}
                      onChange={e => setSessionCode(e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono"
                      autoFocus
                    />
                  </>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading…' : showCreate ? 'Create session' : 'Go'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-8 text-center text-xs text-slate-400">
          2026 FIFA World Cup · 48 teams · Free sweepstake
        </p>

        <div className="mt-4 text-center">
          <Link
            to="/how-it-works"
            className="text-xs text-slate-400 hover:text-blue-600 transition-colors underline underline-offset-2"
          >
            How it works →
          </Link>
        </div>
      </motion.div>

      <Footer />
    </div>
  )
}
