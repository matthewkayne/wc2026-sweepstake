import { TEAMS } from './teams'

// Snake-draft distribution.
// Best pick slot gets rank 1 (Argentina), but also the worst "tail" teams.
// Middle pick slots get two mid-ranked teams.
// This matches the sweepstake brief: some get 1 good team, others get 2 worse ones.
export function distributeTeams(participants) {
  const n = participants.length
  if (n === 0) return []

  const sortedTeams = [...TEAMS].sort((a, b) => a.fifaRank - b.fifaRank)

  // Randomly assign each participant a pick slot (0-indexed)
  const shuffled = [...participants]
    .map(p => ({ ...p, _r: Math.random() }))
    .sort((a, b) => a._r - b._r)

  // Initialise per-slot team buckets
  const teamsBySlot = Array.from({ length: n }, () => [])

  let teamIdx = 0
  let round = 0
  while (teamIdx < sortedTeams.length) {
    const forward = round % 2 === 0
    for (let i = 0; i < n && teamIdx < sortedTeams.length; i++) {
      const slot = forward ? i : n - 1 - i
      teamsBySlot[slot].push(sortedTeams[teamIdx])
      teamIdx++
    }
    round++
  }

  return shuffled.map((p, i) => {
    const { _r, ...participant } = p
    return { ...participant, teams: teamsBySlot[i] }
  })
}
