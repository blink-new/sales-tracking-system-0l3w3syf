import { LevelProgress, SuccessProbability, SALES_LEVELS, SalesLevel } from '../types'

export function calculateProjectProgress(levelProgress: LevelProgress): number {
  let totalProgress = 0
  
  Object.entries(SALES_LEVELS).forEach(([level, config]) => {
    const progress = levelProgress[level as SalesLevel] || 0
    const levelPercentage = (progress / 4) * 100 // Convert 0-4 scale to 0-100%
    totalProgress += levelPercentage * config.weight
  })
  
  return Math.round(totalProgress * 100) / 100 // Round to 2 decimal places
}

export function calculateSuccessProbability(probability: SuccessProbability): number {
  const values = [
    probability.client_insider,
    -probability.new_client, // This subtracts
    probability.recurring_client,
    probability.technical_advantage,
    probability.cost_advantage,
    probability.timeline_advantage,
    probability.final_client_insider,
    probability.commercial_conditions_advantage,
    probability.other_advantage,
    probability.competition_advantage
  ]
  
  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.max(0, Math.min(100, total)) // Ensure between 0-100%
}

export function getCurrentLevel(levelProgress: LevelProgress): SalesLevel {
  const levels: SalesLevel[] = ['exploration', 'identification', 'quotation', 'follow_up', 'negotiation', 'closure']
  
  // Find the highest level with progress > 0
  for (let i = levels.length - 1; i >= 0; i--) {
    if (levelProgress[levels[i]] > 0) {
      return levels[i]
    }
  }
  
  return 'exploration' // Default to first level
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'text-green-600'
  if (progress >= 60) return 'text-blue-600'
  if (progress >= 40) return 'text-yellow-600'
  if (progress >= 20) return 'text-orange-600'
  return 'text-red-600'
}

export function getLevelColor(level: SalesLevel): string {
  const colors: Record<SalesLevel, string> = {
    exploration: 'bg-gray-100 text-gray-800',
    identification: 'bg-blue-100 text-blue-800',
    quotation: 'bg-yellow-100 text-yellow-800',
    follow_up: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-purple-100 text-purple-800',
    closure: 'bg-green-100 text-green-800'
  }
  return colors[level]
}