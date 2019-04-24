export interface SmokeTeam {
  name: string;
  id: string;
  url: string;
}

export const SMOKE_TEAMS: Record<string, SmokeTeam> = {
  'Old Joe One': {
    name: 'Old Joe One',
    id: 'THWUCHYD6',
    url: 'old-joe'
  },
  'Old Joe Two': {
    name: 'Old Joe Two',
    id: 'TJ1NTQW9W',
    url: 'oldjoetwo'
  }
}

export const smokeTeams = [ SMOKE_TEAMS['Old Joe One'], SMOKE_TEAMS['Old Joe Two'] ];
