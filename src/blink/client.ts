import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'sales-tracking-system-0l3w3syf',
  authRequired: false // Temporalmente deshabilitado para pruebas
})

export default blink