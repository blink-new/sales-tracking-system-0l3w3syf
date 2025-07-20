import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Users, UserPlus } from 'lucide-react'
import { User } from '../types'

interface UserManagementProps {
  user: User
}

export default function UserManagement({ user }: UserManagementProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Administración de Usuarios</span>
          </h2>
          <p className="text-slate-600 mt-1">
            Gestionar ejecutivos comerciales y permisos
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Nuevo Usuario</span>
        </Button>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Administración de Usuarios
          </h3>
          <p className="text-slate-600 mb-6">
            Esta funcionalidad estará disponible próximamente. Como Jefe de Ventas podrás gestionar todos los usuarios del sistema.
          </p>
          <div className="text-sm text-slate-500">
            Funcionalidades incluidas:
            <ul className="mt-2 space-y-1">
              <li>• Crear nuevos ejecutivos comerciales</li>
              <li>• Asignar roles y permisos</li>
              <li>• Gestionar accesos al sistema</li>
              <li>• Monitorear actividad de usuarios</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}