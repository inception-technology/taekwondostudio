import React from 'react'
import {RequireAuth} from '@/components/shared/RequireAuth'
const Coaches = () => {
  return (
    <RequireAuth>
      <h1>Coaches</h1>
    </RequireAuth>
  )
}

export default Coaches