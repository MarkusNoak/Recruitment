export interface AuditFormData {
  // Step 1 — Company profile
  companyName: string
  industry: string
  companySize: string
  country: string

  // Step 2 — Current operations
  currentTools: string
  keyProcesses: string
  automationLevel: string
  weeklyManualHours: string

  // Step 3 — Challenges & goals
  painPoints: string[]
  goals: string[]
  budgetRange: string
  timeline: string
}

export interface AutomationOpportunity {
  id: number
  title: string
  description: string
  timeSavings: string
  estimatedROI: string
  difficulty: 'low' | 'medium' | 'high'
  timeToImplement: string
  recommendedTools: string[]
}

export interface RoadmapPhase {
  phase: string
  duration: string
  focus: string
  actions: string[]
  estimatedInvestment: string
}

export interface AuditReport {
  score: number
  scoreLabel: string
  summary: string
  strengths: string[]
  opportunities: AutomationOpportunity[]
  roadmap: RoadmapPhase[]
  estimatedAnnualSavings: string
  topPriorityAction: string
  industryBenchmark: string
}

export interface LeadData {
  name: string
  email: string
  phone?: string
}
