export interface User {
  id: string
  email: string
  name: string
  role: 'sales_manager' | 'sales_executive'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  client_name: string
  final_client_name: string
  engineering_company: string
  capex_usd: number
  tentative_close_date: string
  opportunity_description: string
  sales_executive_id: string
  current_level: SalesLevel
  level_progress: LevelProgress
  success_probability: SuccessProbability
  created_at: string
  updated_at: string
  last_update_date: string
}

export type SalesLevel = 'exploration' | 'identification' | 'quotation' | 'follow_up' | 'negotiation' | 'closure'

export interface LevelProgress {
  exploration: number // 0-4
  identification: number // 0-4
  quotation: number // 0-4
  follow_up: number // 0-4
  negotiation: number // 0-4
  closure: number // 0-4
}

export interface SuccessProbability {
  client_insider: number
  new_client: number // This subtracts
  recurring_client: number
  technical_advantage: number
  cost_advantage: number
  timeline_advantage: number
  final_client_insider: number
  commercial_conditions_advantage: number
  other_advantage: number
  other_description: string
  competition_advantage: number
}

export interface WeeklyUpdate {
  id: string
  project_id: string
  update_date: string
  level_progress: LevelProgress
  success_probability: SuccessProbability
  notes: string
  created_by: string
  created_at: string
}

export const SALES_LEVELS: Record<SalesLevel, { name: string; weight: number }> = {
  exploration: { name: 'Exploración', weight: 0.1 },
  identification: { name: 'Identificación', weight: 0.1 },
  quotation: { name: 'Cotización', weight: 0.3 },
  follow_up: { name: 'Seguimiento', weight: 0.2 },
  negotiation: { name: 'Negociación', weight: 0.2 },
  closure: { name: 'Cierre del Proyecto', weight: 0.1 }
}

export const SUCCESS_PROBABILITY_VARIABLES = [
  { key: 'client_insider', name: 'Insider Cliente' },
  { key: 'new_client', name: 'Cliente Nuevo', subtracts: true },
  { key: 'recurring_client', name: 'Cliente Recurrente' },
  { key: 'technical_advantage', name: 'Ventaja Técnica' },
  { key: 'cost_advantage', name: 'Ventaja Costos' },
  { key: 'timeline_advantage', name: 'Ventaja Plazos' },
  { key: 'final_client_insider', name: 'Insider Cliente Final' },
  { key: 'commercial_conditions_advantage', name: 'Ventaja Condiciones Comerciales' },
  { key: 'other_advantage', name: 'Otros' },
  { key: 'competition_advantage', name: 'Ventaja frente a Competencia' }
] as const