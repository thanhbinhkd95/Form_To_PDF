import { useState } from 'react'

// Hook for easy dialog usage
export function useDialog() {
  const [alertDialog, setAlertDialog] = useState({ 
    isOpen: false, 
    title: '', 
    message: '', 
    type: 'info' 
  })
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    title: '', 
    message: '' 
  })

  const showAlert = (title, message, type = 'info') => {
    setAlertDialog({ isOpen: true, title, message, type })
  }

  const showConfirm = (title, message) => {
    return new Promise((resolve) => {
      setConfirmDialog({ 
        isOpen: true, 
        title, 
        message,
        onConfirm: () => resolve(true),
        onClose: () => resolve(false)
      })
    })
  }

  const closeAlert = () => {
    setAlertDialog({ isOpen: false, title: '', message: '', type: 'info' })
  }

  const closeConfirm = () => {
    setConfirmDialog({ isOpen: false, title: '', message: '' })
  }

  return {
    alertDialog,
    confirmDialog,
    showAlert,
    showConfirm,
    closeAlert,
    closeConfirm
  }
}
