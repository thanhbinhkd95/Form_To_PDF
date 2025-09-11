import { useContext } from 'react'
import { FormContext } from './context.js'

export function useFormContext() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useFormContext must be used within FormProvider')
  return ctx
}


