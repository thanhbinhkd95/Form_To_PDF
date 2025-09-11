import { useCallback } from 'react'
import { useFormContext } from '../context/useFormContext.js'
import { sendEmail } from '../utils/emailService.js'

export function useEmail() {
  const { state, dispatch } = useFormContext()

  const send = useCallback(async ({ to }) => {
    try {
      dispatch({ type: 'SET_STATUS', payload: { sendingEmail: true } })
      let blob = state.pdfBlob
      if (!blob) {
        // Lazy-generate if missing
        const mod = await import('./usePdf.js')
        const { generate } = mod.usePdf()
        blob = await generate()
      }
    
      const attachment = { filename: 'form.pdf', blob }
      const subject = 'Biểu mẫu của bạn'
      const text = 'Đính kèm là bản PDF của biểu mẫu bạn vừa gửi.'
      const html = '<p>Đính kèm là bản PDF của biểu mẫu bạn vừa gửi.</p>'
      const res = await sendEmail({ to, subject, text, html, attachments: [attachment] })
      return res
    } finally {
      dispatch({ type: 'SET_STATUS', payload: { sendingEmail: false } })
    }
  }, [dispatch, state.pdfBlob])

  return { send, sending: state.status.sendingEmail }
}


