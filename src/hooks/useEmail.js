import { useCallback } from "react";
import { useFormContext } from "../context/useFormContext.js";
import { emailController } from "../controllers/EmailController.js";
import { APP_CONSTANTS } from "../constants/appConstants.js";

export function useEmail() {
  const { state, dispatch } = useFormContext();

  const send = useCallback(
    async ({ to }) => {
      try {
        dispatch({ type: "SET_STATUS", payload: { sendingEmail: true } });
        let blob = state.pdfBlob;
        if (!blob) {
          // Lazy-generate if missing
          const { generatePdfFromFormData } = await import("./usePdf.js");
          blob = await generatePdfFromFormData(state.formData, state.imageUrl);
        }

        const result = await emailController.sendEmailWithPdf({
          to,
          pdfBlob: blob,
          filename: APP_CONSTANTS.EMAIL.FILENAME,
          formData: state.formData,
        });

        return result;
      } finally {
        dispatch({ type: "SET_STATUS", payload: { sendingEmail: false } });
      }
    },
    [dispatch, state.pdfBlob, state.formData, state.imageUrl]
  );

  return { send, sending: state.status.sendingEmail };
}
