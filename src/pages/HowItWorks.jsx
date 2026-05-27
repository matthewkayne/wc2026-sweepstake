import { Link } from 'react-router'
import { motion } from 'framer-motion'
import Logo from '../components/Logo'
import Footer from '../components/Footer'

const steps = [
  {
    emoji: '📱',
    title: 'Scan the QR code',
    body: 'The host shares a QR code or session link. Everyone scans it on their own phone — no app needed.',
  },
  {
    emoji: '✏️',
    title: 'Enter your name & avatar',
    body: 'Pick a name and an emoji avatar to represent you in the draw.',
  },
  {
    emoji: '⏳',
    title: 'Wait in the lobby',
    body: 'You can see everyone else who has joined in real time. The host decides when everyone is in.',
  },
  {
    emoji: '🎲',
    title: 'The host presses Draw!',
    body: 'Teams are randomly assigned using a snake draft — every player gets exactly 1 or 2 teams.',
  },
  {
    emoji: '🏆',
    title: 'Results revealed',
    body: 'Everyone sees the full draw at once. Your card is highlighted so you can find your teams instantly.',
  },
]

const tiers = [
  { label: 'Elite', range: 'Ranked 1–12', colour: 'bg-yellow-400 text-slate-900', desc: 'Tournament favourites' },
  { label: 'Strong', range: 'Ranked 13–24', colour: 'bg-blue-700 text-white', desc: 'Solid contenders' },
  { label: 'Competitive', range: 'Ranked 25–36', colour: 'bg-slate-500 text-white', desc: 'Could cause an upset' },
  { label: 'Underdog', range: 'Ranked 37–48', colour: 'bg-slate-200 text-slate-700', desc: 'Long shot, big payout' },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
            ← Back to home
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <Logo />
          </div>
          <h1 className="mt-4 text-3xl font-black text-slate-900">How it works</h1>
          <p className="mt-2 text-slate-500 text-sm">
            Everything you need to know about the WC 2026 sweepstake draw.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-black text-slate-900 text-lg mb-5">The draw, step by step</h2>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-slate-50 border-2 border-slate-100 rounded-xl text-xl">
                  {s.emoji}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{s.title}</p>
                  <p className="text-slate-500 text-sm mt-0.5">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Team cap rule */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-black text-slate-900 text-lg mb-2">2-team cap</h2>
          <p className="text-slate-500 text-sm">
            Every player gets <strong className="text-slate-900">at most 2 teams</strong>. With 48 teams in the
            tournament, only the top‑ranked <em>N × 2</em> teams are used (where N is the number of players).
            The lowest-ranked teams are left unassigned — so no one gets stuck with a pile of group-stage exits.
          </p>
          <div className="mt-4 bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Example:</span> 10 players → teams ranked 1–20 are drawn.
            Teams ranked 21–48 are not used.
          </div>
        </motion.section>

        {/* Snake draft */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-black text-slate-900 text-lg mb-2">Snake draft fairness</h2>
          <p className="text-slate-500 text-sm">
            Pick order is random, then teams are assigned in a snake pattern:
            round 1 goes 1 → N, round 2 goes N → 1, and so on. This means whoever
            picks first gets the best team but the worst second team, while middle
            pickers get two balanced mid-table teams. <strong className="text-slate-900">Everyone has a fair shot.</strong>
          </p>
        </motion.section>

        {/* Tier system */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-6"
        >
          <h2 className="font-black text-slate-900 text-lg mb-4">Team tiers</h2>
          <p className="text-slate-500 text-sm mb-4">
            Teams are colour-coded by their FIFA ranking tier so you can see at a glance how strong your draw is.
          </p>
          <div className="space-y-2">
            {tiers.map(t => (
              <div key={t.label} className="flex items-center gap-3">
                <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${t.colour}`}>
                  {t.label}
                </span>
                <span className="text-xs text-slate-500">{t.range} — {t.desc}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-center"
        >
          <Link
            to="/"
            className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Start a sweepstake →
          </Link>
        </motion.div>

        <Footer />
      </div>
    </div>
  )
}
