import React from 'react'
import {RequireAuth} from '@/components/shared/RequireAuth'
const Students = () => {
  return (
    <RequireAuth>
      <h1>Students</h1>
    </RequireAuth>
  )
}

export default Students