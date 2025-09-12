import { useCallback } from 'react'
import { useFormContext } from '../context/useFormContext.js'
import { sendEmail } from '../utils/emailService.js'
import { APP_CONSTANTS } from '../constants/appConstants.js'

export function useEmail() {
  const { state, dispatch } = useFormContext()

  const send = useCallback(async ({ to }) => {
    try {
      dispatch({ type: 'SET_STATUS', payload: { sendingEmail: true } })
      let blob = state.pdfBlob
      if (!blob) {
        // Lazy-generate if missing
        const { generatePdfFromFormData } = await import('./usePdf.js')
        blob = await generatePdfFromFormData(state.formData, state.imageUrl)
      }
    
      const attachment = { filename: APP_CONSTANTS.EMAIL.FILENAME, blob }
      const subject = APP_CONSTANTS.EMAIL.SUBJECT
      const text = APP_CONSTANTS.EMAIL.TEXT
      const html = APP_CONSTANTS.EMAIL.HTML
      const res = await sendEmail({ to, subject, text, html, attachments: [attachment] })
      return res
    } finally {
      dispatch({ type: 'SET_STATUS', payload: { sendingEmail: false } })
    }
  }, [dispatch, state.pdfBlob, state.formData, state.imageUrl])

  return { send, sending: state.status.sendingEmail }
}


