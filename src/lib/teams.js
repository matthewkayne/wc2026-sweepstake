// 48 FIFA World Cup 2026 teams, ordered best → worst by FIFA ranking.
// fifaRank is used by the snake-draft distribution algorithm:
// the lower the number, the stronger the team.
export const TEAMS = [
  // Tier 1 — Elite
  { id: 1,  name: 'Argentina',     flag: '🇦🇷', fifaRank: 1,  confederation: 'CONMEBOL' },
  { id: 2,  name: 'France',        flag: '🇫🇷', fifaRank: 2,  confederation: 'UEFA' },
  { id: 3,  name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaRank: 3,  confederation: 'UEFA' },
  { id: 4,  name: 'Spain',         flag: '🇪🇸', fifaRank: 4,  confederation: 'UEFA' },
  { id: 5,  name: 'Brazil',        flag: '🇧🇷', fifaRank: 5,  confederation: 'CONMEBOL' },
  { id: 6,  name: 'Portugal',      flag: '🇵🇹', fifaRank: 6,  confederation: 'UEFA' },
  { id: 7,  name: 'Germany',       flag: '🇩🇪', fifaRank: 7,  confederation: 'UEFA' },
  { id: 8,  name: 'Netherlands',   flag: '🇳🇱', fifaRank: 8,  confederation: 'UEFA' },
  { id: 9,  name: 'Belgium',       flag: '🇧🇪', fifaRank: 9,  confederation: 'UEFA' },
  { id: 10, name: 'Italy',         flag: '🇮🇹', fifaRank: 10, confederation: 'UEFA' },
  { id: 11, name: 'Uruguay',       flag: '🇺🇾', fifaRank: 11, confederation: 'CONMEBOL' },
  { id: 12, name: 'Croatia',       flag: '🇭🇷', fifaRank: 12, confederation: 'UEFA' },

  // Tier 2 — Strong
  { id: 13, name: 'Colombia',      flag: '🇨🇴', fifaRank: 13, confederation: 'CONMEBOL' },
  { id: 14, name: 'Denmark',       flag: '🇩🇰', fifaRank: 14, confederation: 'UEFA' },
  { id: 15, name: 'Morocco',       flag: '🇲🇦', fifaRank: 15, confederation: 'CAF' },
  { id: 16, name: 'Japan',         flag: '🇯🇵', fifaRank: 16, confederation: 'AFC' },
  { id: 17, name: 'Switzerland',   flag: '🇨🇭', fifaRank: 17, confederation: 'UEFA' },
  { id: 18, name: 'Austria',       flag: '🇦🇹', fifaRank: 18, confederation: 'UEFA' },
  { id: 19, name: 'Senegal',       flag: '🇸🇳', fifaRank: 19, confederation: 'CAF' },
  { id: 20, name: 'South Korea',   flag: '🇰🇷', fifaRank: 20, confederation: 'AFC' },
  { id: 21, name: 'USA',           flag: '🇺🇸', fifaRank: 21, confederation: 'CONCACAF' },
  { id: 22, name: 'Mexico',        flag: '🇲🇽', fifaRank: 22, confederation: 'CONCACAF' },
  { id: 23, name: 'Serbia',        flag: '🇷🇸', fifaRank: 23, confederation: 'UEFA' },
  { id: 24, name: 'Canada',        flag: '🇨🇦', fifaRank: 24, confederation: 'CONCACAF' },

  // Tier 3 — Competitive
  { id: 25, name: 'Turkey',        flag: '🇹🇷', fifaRank: 25, confederation: 'UEFA' },
  { id: 26, name: 'Poland',        flag: '🇵🇱', fifaRank: 26, confederation: 'UEFA' },
  { id: 27, name: 'Ecuador',       flag: '🇪🇨', fifaRank: 27, confederation: 'CONMEBOL' },
  { id: 28, name: 'Nigeria',       flag: '🇳🇬', fifaRank: 28, confederation: 'CAF' },
  { id: 29, name: 'Ukraine',       flag: '🇺🇦', fifaRank: 29, confederation: 'UEFA' },
  { id: 30, name: 'Cameroon',      flag: '🇨🇲', fifaRank: 30, confederation: 'CAF' },
  { id: 31, name: 'Czech Republic',flag: '🇨🇿', fifaRank: 31, confederation: 'UEFA' },
  { id: 32, name: "Côte d'Ivoire", flag: '🇨🇮', fifaRank: 32, confederation: 'CAF' },
  { id: 33, name: 'Hungary',       flag: '🇭🇺', fifaRank: 33, confederation: 'UEFA' },
  { id: 34, name: 'Venezuela',     flag: '🇻🇪', fifaRank: 34, confederation: 'CONMEBOL' },
  { id: 35, name: 'Ghana',         flag: '🇬🇭', fifaRank: 35, confederation: 'CAF' },
  { id: 36, name: 'Iran',          flag: '🇮🇷', fifaRank: 36, confederation: 'AFC' },

  // Tier 4 — Underdogs
  { id: 37, name: 'Australia',     flag: '🇦🇺', fifaRank: 37, confederation: 'AFC' },
  { id: 38, name: 'Slovakia',      flag: '🇸🇰', fifaRank: 38, confederation: 'UEFA' },
  { id: 39, name: 'Egypt',         flag: '🇪🇬', fifaRank: 39, confederation: 'CAF' },
  { id: 40, name: 'Saudi Arabia',  flag: '🇸🇦', fifaRank: 40, confederation: 'AFC' },
  { id: 41, name: 'South Africa',  flag: '🇿🇦', fifaRank: 41, confederation: 'CAF' },
  { id: 42, name: 'DR Congo',      flag: '🇨🇩', fifaRank: 42, confederation: 'CAF' },
  { id: 43, name: 'Iraq',          flag: '🇮🇶', fifaRank: 43, confederation: 'AFC' },
  { id: 44, name: 'Paraguay',      flag: '🇵🇾', fifaRank: 44, confederation: 'CONMEBOL' },
  { id: 45, name: 'Jamaica',       flag: '🇯🇲', fifaRank: 45, confederation: 'CONCACAF' },
  { id: 46, name: 'Algeria',       flag: '🇩🇿', fifaRank: 46, confederation: 'CAF' },
  { id: 47, name: 'Panama',        flag: '🇵🇦', fifaRank: 47, confederation: 'CONCACAF' },
  { id: 48, name: 'New Zealand',   flag: '🇳🇿', fifaRank: 48, confederation: 'OFC' },
]

export const TOTAL_TEAMS = TEAMS.length
