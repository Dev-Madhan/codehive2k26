export interface DashboardStats {
  totalRegistrations: number;
  confirmedRegistrations: number;
  activeEventsCount: number;
  totalCheckIns: number;
  busRegistrations: number;
  turnoutRate: number;
}

export interface DashboardChartPoint {
  date: string;
  registrations: number;
  checkIns: number;
}

export interface DashboardEventItem {
  id: number;
  dbId: string;
  header: string;
  slug: string;
  type: string;
  categorySlug: string;
  status: string;
  venue?: string;
  headcount: number;
  candidateCount?: number;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  teamFormat: string;
  startAt: string;
  endAt: string;
  registrationsCount: number;
  teamsCount: number;
  description: string;
}
