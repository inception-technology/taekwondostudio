import React from 'react'
import {RequireAuth} from '@/components/shared/RequireAuth'
const Schedules = () => {
  return (
    <RequireAuth>
      <h1>Schedules</h1>
    </RequireAuth>
  )
}

export default Schedules