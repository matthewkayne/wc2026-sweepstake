import { TEAMS } from './teams'

export function distributeTeams(participants) {
  const n = participants.length
  if (n === 0) return []

  const sortedTeams = [...TEAMS].sort((a, b) => a.fifaRank - b.fifaRank)

  // Only use the top-ranked n*2 teams — worst-ranked left unassigned
  const teamsToUse = sortedTeams.slice(0, Math.min(n * 2, sortedTeams.length))

  const shuffled = [...participants]
    .map(p => ({ ...p, _r: Math.random() }))
    .sort((a, b) => a._r - b._r)

  const teamsBySlot = Array.from({ length: n }, () => [])

  let teamIdx = 0
  let round = 0
  while (teamIdx < teamsToUse.length) {
    const forward = round % 2 === 0
    for (let i = 0; i < n && teamIdx < teamsToUse.length; i++) {
      const slot = forward ? i : n - 1 - i
      teamsBySlot[slot].push(teamsToUse[teamIdx])
      teamIdx++
    }
    round++
  }

  return shuffled.map((p, i) => {
    const { _r, ...participant } = p
    return { ...participant, teams: teamsBySlot[i] }
  })
}
