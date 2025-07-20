import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import blink from '../blink/client'
import { User, Project, SALES_LEVELS, SalesLevel } from '../types'
import { formatCurrency } from '../utils/calculations'
import { TrendingUp } from 'lucide-react'

interface SalesFunnelProps {
  user: User
}

interface FunnelData {
  level: string
  name: string
  count: number
  value: number
  percentage: number
}

const LEVEL_COLORS = {
  exploration: '#64748b',
  identification: '#3b82f6',
  quotation: '#eab308',
  follow_up: '#f97316',
  negotiation: '#8b5cf6',
  closure: '#22c55e'
}

export default function SalesFunnel({ user }: SalesFunnelProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const [loading, setLoading] = useState(true)

  const calculateFunnelData = useCallback((projectsData: Project[]) => {
    const levelCounts: Record<SalesLevel, { count: number; value: number }> = {
      exploration: { count: 0, value: 0 },
      identification: { count: 0, value: 0 },
      quotation: { count: 0, value: 0 },
      follow_up: { count: 0, value: 0 },
      negotiation: { count: 0, value: 0 },
      closure: { count: 0, value: 0 }
    }

    // Count projects and sum values by current level
    projectsData.forEach(project => {
      levelCounts[project.current_level].count += 1
      levelCounts[project.current_level].value += project.capex_usd
    })

    const totalValue = projectsData.reduce((sum, project) => sum + project.capex_usd, 0)

    // Convert to funnel data format
    const funnel: FunnelData[] = Object.entries(SALES_LEVELS).map(([level, config]) => ({
      level,
      name: config.name,
      count: levelCounts[level as SalesLevel].count,
      value: levelCounts[level as SalesLevel].value,
      percentage: totalValue > 0 ? (levelCounts[level as SalesLevel].value / totalValue) * 100 : 0
    }))

    setFunnelData(funnel)
  }, [])

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load projects based on user role
      const projectsData = await blink.db.projects.list({
        where: user.role === 'sales_manager' ? {} : { salesExecutiveId: user.id },
        orderBy: { updatedAt: 'desc' }
      })
      
      setProjects(projectsData as Project[])
      calculateFunnelData(projectsData as Project[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [user, calculateFunnelData])

  useEffect(() => {
    loadData()
  }, [loadData])

  const totalProjects = funnelData.reduce((sum, level) => sum + level.count, 0)
  const totalValue = funnelData.reduce((sum, level) => sum + level.value, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-slate-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>Embudo de Ventas</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Distribución de proyectos por nivel de proceso de venta
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalValue)}</div>
          <div className="text-sm text-slate-600">{totalProjects} proyectos totales</div>
        </div>
      </div>

      {/* Funnel Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Niveles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'value') {
                      return [formatCurrency(value as number), 'Valor CAPEX']
                    }
                    return [value, 'Cantidad de Proyectos']
                  }}
                  labelFormatter={(label) => `Nivel: ${label}`}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="value" 
                  name="value"
                  radius={[4, 4, 0, 0]}
                >
                  {funnelData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={LEVEL_COLORS[entry.level as SalesLevel]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Funnel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funnelData.map((level) => (
          <Card key={level.level} className="relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-1"
              style={{ backgroundColor: LEVEL_COLORS[level.level as SalesLevel] }}
            />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">{level.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Proyectos:</span>
                <span className="text-xl font-bold">{level.count}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Valor:</span>
                <span className="text-lg font-semibold">{formatCurrency(level.value)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">% del Total:</span>
                  <span className="text-sm font-medium">{level.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={level.percentage} className="h-2" />
              </div>
              
              {level.count > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Valor promedio:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(level.value / level.count)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Conversión Temprana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 
                ? ((funnelData.find(l => l.level === 'quotation')?.count || 0) / totalProjects * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Proyectos que llegan a Cotización
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Conversión Avanzada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 
                ? ((funnelData.find(l => l.level === 'negotiation')?.count || 0) / totalProjects * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Proyectos que llegan a Negociación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Tasa de Cierre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 
                ? ((funnelData.find(l => l.level === 'closure')?.count || 0) / totalProjects * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Proyectos cerrados exitosamente
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}