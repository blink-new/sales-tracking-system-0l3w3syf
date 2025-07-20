import { useState, useEffect } from 'react'
import { Toaster } from './components/ui/toaster'
import blink from './blink/client'
import { User } from './types'
import Dashboard from './components/Dashboard'
import SalesFunnel from './components/SalesFunnel'
import ProjectManagement from './components/ProjectManagement'
import UserManagement from './components/UserManagement'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Button } from './components/ui/button'
import { LogOut, Users, BarChart3, FolderOpen, TrendingUp } from 'lucide-react'

function App() {
  // Usuario de prueba temporal (sin autenticación)
  const [user] = useState<User>({
    id: 'demo-user-1',
    email: 'demo@empresa.com',
    name: 'Usuario Demo',
    role: 'sales_manager', // Rol de jefe de ventas para ver todas las funcionalidades
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = () => {
    // Función temporal - no hace nada por ahora
    console.log('Logout temporal deshabilitado')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Sistema de Seguimiento de Ventas
              </h1>
              <p className="text-sm text-slate-600">
                Bienvenido, {user.name} ({user.role === 'sales_manager' ? 'Jefe de Ventas' : 'Ejecutivo Comercial'})
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="funnel" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Embudo</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4" />
              <span>Proyectos</span>
            </TabsTrigger>
            {user.role === 'sales_manager' && (
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Usuarios</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard user={user} />
          </TabsContent>

          <TabsContent value="funnel">
            <SalesFunnel user={user} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManagement user={user} />
          </TabsContent>

          {user.role === 'sales_manager' && (
            <TabsContent value="users">
              <UserManagement user={user} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App