import { useCallback } from "react";
import { useFormContext } from "../context/useFormContext.js";
import { pdfController } from "../controllers/PdfController.js";

export function usePdf() {
  const { state, dispatch } = useFormContext();

  const generatePdfFromPreview = useCallback(async () => {
    try {
      dispatch({ type: "SET_STATUS", payload: { generatingPdf: true } });
      const blob = await pdfController.generateFromPreview();
      dispatch({ type: "SET_PDF", payload: blob });
      return blob;
    } finally {
      dispatch({ type: "SET_STATUS", payload: { generatingPdf: false } });
    }
  }, [dispatch]);

  const generatePdfFromFormData = useCallback(
    async (formData, imageUrl) => {
      try {
        dispatch({ type: "SET_STATUS", payload: { generatingPdf: true } });
        const blob = await pdfController.generateFromData(formData, imageUrl);
        dispatch({ type: "SET_PDF", payload: blob });
        return blob;
      } finally {
        dispatch({ type: "SET_STATUS", payload: { generatingPdf: false } });
      }
    },
    [dispatch]
  );

  // Alias cho backward compatibility
  const generate = generatePdfFromPreview;

  return {
    pdfBlob: state.pdfBlob,
    generate,
    generatePdfFromPreview,
    generatePdfFromFormData,
    generating: state.status.generatingPdf,
  };
}
