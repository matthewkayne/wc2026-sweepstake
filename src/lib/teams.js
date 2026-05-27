// 48 FIFA World Cup 2026 qualified teams, ordered by FIFA ranking (April 2026).
// fifaRank is the official FIFA rank — lower = stronger — used by the snake-draft distribution.
export const TEAMS = [
  // Tier 1 — Elite
  { id: 1,  name: 'France',                  flag: '🇫🇷', fifaRank: 1,  confederation: 'UEFA' },
  { id: 2,  name: 'Spain',                   flag: '🇪🇸', fifaRank: 2,  confederation: 'UEFA' },
  { id: 3,  name: 'Argentina',               flag: '🇦🇷', fifaRank: 3,  confederation: 'CONMEBOL' },
  { id: 4,  name: 'England',                 flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', fifaRank: 4,  confederation: 'UEFA' },
  { id: 5,  name: 'Portugal',                flag: '🇵🇹', fifaRank: 5,  confederation: 'UEFA' },
  { id: 6,  name: 'Brazil',                  flag: '🇧🇷', fifaRank: 6,  confederation: 'CONMEBOL' },
  { id: 7,  name: 'Netherlands',             flag: '🇳🇱', fifaRank: 7,  confederation: 'UEFA' },
  { id: 8,  name: 'Morocco',                 flag: '🇲🇦', fifaRank: 8,  confederation: 'CAF' },
  { id: 9,  name: 'Belgium',                 flag: '🇧🇪', fifaRank: 9,  confederation: 'UEFA' },
  { id: 10, name: 'Germany',                 flag: '🇩🇪', fifaRank: 10, confederation: 'UEFA' },
  { id: 11, name: 'Croatia',                 flag: '🇭🇷', fifaRank: 11, confederation: 'UEFA' },
  { id: 12, name: 'Colombia',                flag: '🇨🇴', fifaRank: 13, confederation: 'CONMEBOL' },

  // Tier 2 — Strong
  { id: 13, name: 'Senegal',                 flag: '🇸🇳', fifaRank: 14, confederation: 'CAF' },
  { id: 14, name: 'Mexico',                  flag: '🇲🇽', fifaRank: 15, confederation: 'CONCACAF' },
  { id: 15, name: 'USA',                     flag: '🇺🇸', fifaRank: 16, confederation: 'CONCACAF' },
  { id: 16, name: 'Uruguay',                 flag: '🇺🇾', fifaRank: 17, confederation: 'CONMEBOL' },
  { id: 17, name: 'Japan',                   flag: '🇯🇵', fifaRank: 18, confederation: 'AFC' },
  { id: 18, name: 'Switzerland',             flag: '🇨🇭', fifaRank: 19, confederation: 'UEFA' },
  { id: 19, name: 'Iran',                    flag: '🇮🇷', fifaRank: 21, confederation: 'AFC' },
  { id: 20, name: 'Turkey',                  flag: '🇹🇷', fifaRank: 22, confederation: 'UEFA' },
  { id: 21, name: 'Ecuador',                 flag: '🇪🇨', fifaRank: 23, confederation: 'CONMEBOL' },
  { id: 22, name: 'Austria',                 flag: '🇦🇹', fifaRank: 24, confederation: 'UEFA' },
  { id: 23, name: 'South Korea',             flag: '🇰🇷', fifaRank: 25, confederation: 'AFC' },
  { id: 24, name: 'Australia',               flag: '🇦🇺', fifaRank: 27, confederation: 'AFC' },

  // Tier 3 — Competitive
  { id: 25, name: 'Algeria',                 flag: '🇩🇿', fifaRank: 28, confederation: 'CAF' },
  { id: 26, name: 'Egypt',                   flag: '🇪🇬', fifaRank: 29, confederation: 'CAF' },
  { id: 27, name: 'Canada',                  flag: '🇨🇦', fifaRank: 30, confederation: 'CONCACAF' },
  { id: 28, name: 'Norway',                  flag: '🇳🇴', fifaRank: 31, confederation: 'UEFA' },
  { id: 29, name: 'Panama',                  flag: '🇵🇦', fifaRank: 33, confederation: 'CONCACAF' },
  { id: 30, name: "Côte d'Ivoire",           flag: '🇨🇮', fifaRank: 34, confederation: 'CAF' },
  { id: 31, name: 'Sweden',                  flag: '🇸🇪', fifaRank: 38, confederation: 'UEFA' },
  { id: 32, name: 'Paraguay',                flag: '🇵🇾', fifaRank: 40, confederation: 'CONMEBOL' },
  { id: 33, name: 'Czech Republic',          flag: '🇨🇿', fifaRank: 41, confederation: 'UEFA' },
  { id: 34, name: 'Scotland',                flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fifaRank: 43, confederation: 'UEFA' },
  { id: 35, name: 'Tunisia',                 flag: '🇹🇳', fifaRank: 44, confederation: 'CAF' },
  { id: 36, name: 'DR Congo',                flag: '🇨🇩', fifaRank: 46, confederation: 'CAF' },

  // Tier 4 — Underdogs
  { id: 37, name: 'Uzbekistan',              flag: '🇺🇿', fifaRank: 50, confederation: 'AFC' },
  { id: 38, name: 'Qatar',                   flag: '🇶🇦', fifaRank: 55, confederation: 'AFC' },
  { id: 39, name: 'Iraq',                    flag: '🇮🇶', fifaRank: 57, confederation: 'AFC' },
  { id: 40, name: 'South Africa',            flag: '🇿🇦', fifaRank: 60, confederation: 'CAF' },
  { id: 41, name: 'Saudi Arabia',            flag: '🇸🇦', fifaRank: 61, confederation: 'AFC' },
  { id: 42, name: 'Jordan',                  flag: '🇯🇴', fifaRank: 63, confederation: 'AFC' },
  { id: 43, name: 'Bosnia and Herzegovina',  flag: '🇧🇦', fifaRank: 65, confederation: 'UEFA' },
  { id: 44, name: 'Cape Verde',              flag: '🇨🇻', fifaRank: 69, confederation: 'CAF' },
  { id: 45, name: 'Ghana',                   flag: '🇬🇭', fifaRank: 74, confederation: 'CAF' },
  { id: 46, name: 'Curaçao',                 flag: '🇨🇼', fifaRank: 82, confederation: 'CONCACAF' },
  { id: 47, name: 'Haiti',                   flag: '🇭🇹', fifaRank: 83, confederation: 'CONCACAF' },
  { id: 48, name: 'New Zealand',             flag: '🇳🇿', fifaRank: 85, confederation: 'OFC' },
]

export const TOTAL_TEAMS = TEAMS.length
