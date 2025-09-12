import { useCallback } from 'react'
import { useFormContext } from '../context/useFormContext.js'

export function useImage() {
  const { state, dispatch } = useFormContext()

  const setImage = useCallback(async (fileOrDataUrl) => {
    if (!fileOrDataUrl) {
      dispatch({ type: 'SET_IMAGE', payload: null })
      return
    }
    if (typeof fileOrDataUrl === 'string') {
      dispatch({ type: 'SET_IMAGE', payload: fileOrDataUrl })
      return
    }
    const file = fileOrDataUrl
    const reader = new FileReader()
    const url = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
    dispatch({ type: 'SET_IMAGE', payload: url })
  }, [dispatch])

  const clearImage = useCallback(() => {
    dispatch({ type: 'CLEAR_IMAGE' })
  }, [dispatch])

  return { imageUrl: state.imageUrl, setImage, clearImage }
}


