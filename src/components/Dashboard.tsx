import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Progress } from './ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Search, Filter, DollarSign, TrendingUp, Users, Target } from 'lucide-react'
import blink from '../blink/client'
import { User, Project, SALES_LEVELS } from '../types'
import { calculateProjectProgress, calculateSuccessProbability, formatCurrency, formatDate, getProgressColor, getLevelColor } from '../utils/calculations'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [salesExecutives, setSalesExecutives] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExecutive, setSelectedExecutive] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedClient, setSelectedClient] = useState<string>('all')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Load projects
      const projectsData = await blink.db.projects.list({
        where: user.role === 'sales_manager' ? {} : { salesExecutiveId: user.id },
        orderBy: { updatedAt: 'desc' }
      })
      
      // Load sales executives
      const executivesData = await blink.db.users.list({
        where: { role: 'sales_executive' }
      })
      
      setProjects(projectsData as Project[])
      setSalesExecutives(executivesData as User[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const applyFilters = useCallback(() => {
    let filtered = [...projects]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.final_client_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Executive filter
    if (selectedExecutive !== 'all') {
      filtered = filtered.filter(project => project.sales_executive_id === selectedExecutive)
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(project => project.current_level === selectedLevel)
    }

    // Client filter
    if (selectedClient !== 'all') {
      filtered = filtered.filter(project => project.client_name === selectedClient)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedExecutive, selectedLevel, selectedClient])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const getProjectProgress = (project: Project) => {
    const levelProgress = {
      exploration: project.exploration_progress || 0,
      identification: project.identification_progress || 0,
      quotation: project.quotation_progress || 0,
      follow_up: project.follow_up_progress || 0,
      negotiation: project.negotiation_progress || 0,
      closure: project.closure_progress || 0
    }
    return calculateProjectProgress(levelProgress)
  }

  const getProjectProbability = (project: Project) => {
    const probability = {
      client_insider: project.client_insider || 0,
      new_client: project.new_client || 0,
      recurring_client: project.recurring_client || 0,
      technical_advantage: project.technical_advantage || 0,
      cost_advantage: project.cost_advantage || 0,
      timeline_advantage: project.timeline_advantage || 0,
      final_client_insider: project.final_client_insider || 0,
      commercial_conditions_advantage: project.commercial_conditions_advantage || 0,
      other_advantage: project.other_advantage || 0,
      other_description: project.other_description || '',
      competition_advantage: project.competition_advantage || 0
    }
    return calculateSuccessProbability(probability)
  }

  const totalValue = filteredProjects.reduce((sum, project) => sum + project.capex_usd, 0)
  const averageProgress = filteredProjects.length > 0 
    ? filteredProjects.reduce((sum, project) => sum + getProjectProgress(project), 0) / filteredProjects.length 
    : 0
  const averageProbability = filteredProjects.length > 0
    ? filteredProjects.reduce((sum, project) => sum + getProjectProbability(project), 0) / filteredProjects.length
    : 0

  const uniqueClients = [...new Set(projects.map(p => p.client_name))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proyectos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              de {projects.length} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              CAPEX acumulado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
            <Progress value={averageProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Probabilidad Promedio</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProbability.toFixed(1)}%</div>
            <Progress value={averageProbability} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {user.role === 'sales_manager' && (
              <Select value={selectedExecutive} onValueChange={setSelectedExecutive}>
                <SelectTrigger>
                  <SelectValue placeholder="Vendedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vendedores</SelectItem>
                  {salesExecutives.map((exec) => (
                    <SelectItem key={exec.id} value={exec.id}>
                      {exec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                {Object.entries(SALES_LEVELS).map(([key, level]) => (
                  <SelectItem key={key} value={key}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los clientes</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('')
                setSelectedExecutive('all')
                setSelectedLevel('all')
                setSelectedClient('all')
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Probabilidad</TableHead>
                  <TableHead>CAPEX</TableHead>
                  <TableHead>Cierre</TableHead>
                  <TableHead>Última Act.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const progress = getProjectProgress(project)
                  const probability = getProjectProbability(project)
                  const executive = salesExecutives.find(e => e.id === project.sales_executive_id)
                  
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client_name}</TableCell>
                      <TableCell>{executive?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(project.current_level)}>
                          {SALES_LEVELS[project.current_level].name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={progress} className="w-16" />
                          <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={probability} className="w-16" />
                          <span className={`text-sm font-medium ${getProgressColor(probability)}`}>
                            {probability.toFixed(1)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(project.capex_usd)}
                      </TableCell>
                      <TableCell>{formatDate(project.tentative_close_date)}</TableCell>
                      <TableCell>{formatDate(project.last_update_date)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron proyectos con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}