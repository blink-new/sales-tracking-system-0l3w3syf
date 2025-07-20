import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Plus, FolderOpen } from 'lucide-react'
import { User } from '../types'

interface ProjectManagementProps {
  user: User
}

export default function ProjectManagement({ user }: ProjectManagementProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <FolderOpen className="h-6 w-6 text-blue-600" />
            <span>Gestión de Proyectos</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Crear y gestionar proyectos de venta
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Proyecto</span>
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="p-12 text-center">
          <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Gestión de Proyectos
          </h3>
          <p className="text-slate-600 mb-6">
            Esta funcionalidad estará disponible próximamente. Podrás crear, editar y gestionar todos tus proyectos de venta desde aquí.
          </p>
          <div className="text-sm text-slate-500">
            Funcionalidades incluidas:
            <ul className="mt-2 space-y-1">
              <li>• Crear nuevos proyectos</li>
              <li>• Actualizar niveles de progreso</li>
              <li>• Gestionar probabilidades de éxito</li>
              <li>• Historial de actualizaciones</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}