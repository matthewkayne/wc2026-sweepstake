import { motion } from 'framer-motion'

const tierColors = {
  1: 'border-yellow-400 bg-yellow-50',
  2: 'border-blue-300 bg-blue-50',
  3: 'border-slate-300 bg-white',
  4: 'border-slate-200 bg-white',
}

function getTier(fifaRank) {
  if (fifaRank <= 12) return 1
  if (fifaRank <= 24) return 2
  if (fifaRank <= 36) return 3
  return 4
}

const tierLabel = { 1: 'Elite', 2: 'Strong', 3: 'Competitive', 4: 'Underdog' }
const tierText  = { 1: 'text-yellow-700', 2: 'text-blue-700', 3: 'text-slate-500', 4: 'text-slate-400' }

export default function TeamCard({ team, delay = 0, revealed = true }) {
  const tier = getTier(team.fifaRank)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={revealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`border-2 rounded-xl p-4 flex items-center gap-3 ${tierColors[tier]}`}
    >
      <span className="text-3xl leading-none">{team.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 truncate">{team.name}</p>
        <p className="text-xs text-slate-500">{team.confederation}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs font-semibold uppercase tracking-wide ${tierText[tier]}`}>
          {tierLabel[tier]}
        </p>
        <p className="text-xs text-slate-400">#{team.fifaRank}</p>
      </div>
    </motion.div>
  )
}
