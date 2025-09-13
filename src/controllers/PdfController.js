import { APP_CONSTANTS } from "../constants/appConstants.js";

/**
 * PdfController - Handles all PDF generation business logic
 * Separated from UI components for better maintainability and testability
 */
export class PdfController {
  constructor() {
    this.pdfConfig = {
      orientation: APP_CONSTANTS.PDF.ORIENTATION,
      unit: APP_CONSTANTS.PDF.UNIT,
      format: APP_CONSTANTS.PDF.FORMAT,
      scale: APP_CONSTANTS.PDF.SCALE,
      quality: APP_CONSTANTS.PDF.QUALITY,
      margin: APP_CONSTANTS.PDF.MARGIN,
    };
  }

  /**
   * Generate PDF from DOM preview element
   * @param {string} selector - CSS selector for preview element
   * @returns {Promise<Blob>} Generated PDF blob
   */
  async generateFromPreview(selector = "#preview-root") {
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const element = document.querySelector(selector);
      if (!element) throw new Error("Preview element not found");

      // Add special class for PDF generation
      const originalClasses = element.className;
      element.className += " pdf-generation";

      // Wait for CSS to be applied
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Configure html2canvas optimized for Application Form
      const canvas = await html2canvas(element, {
        scale: this.pdfConfig.scale,
        useCORS: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        ignoreElements: (element) => {
          return (
            element.classList.contains("preview-actions") ||
            element.classList.contains("preview-modal-header")
          );
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", this.pdfConfig.quality);

      // Create PDF with optimized configuration
      const pdf = new jsPDF({
        orientation: this.pdfConfig.orientation,
        unit: this.pdfConfig.unit,
        format: this.pdfConfig.format,
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate margins and content dimensions
      const margin = this.pdfConfig.margin;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Calculate scale to fit page width
      const scale = contentWidth / canvas.width;
      const scaledHeight = canvas.height * scale;

      // Handle single page or multi-page content
      if (scaledHeight <= contentHeight) {
        pdf.addImage(
          imgData,
          "JPEG",
          margin,
          margin,
          contentWidth,
          scaledHeight
        );
      } else {
        await this._addMultiPageContent(
          pdf,
          canvas,
          imgData,
          scale,
          margin,
          contentWidth,
          contentHeight
        );
      }

      // Restore original classes
      element.className = originalClasses;

      // Generate filename with timestamp
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const fileName = `Application_Form_${timestamp}.pdf`;

      // Download file
      pdf.save(fileName);

      return pdf.output("blob");
    } catch (error) {
      console.error("PDF generation from preview failed:", error);
      throw new Error(`Failed to generate PDF from preview: ${error.message}`);
    }
  }

  /**
   * Generate PDF from form data
   * @param {Object} formData - Form data to convert to PDF
   * @param {string} imageUrl - Image URL for the form
   * @returns {Promise<Blob>} Generated PDF blob
   */
  async generateFromData(formData, imageUrl) {
    try {
      // Create temporary container for rendering preview
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "794px"; // A4 width in pixels
      tempContainer.style.padding = "76px"; // 20mm in pixels
      tempContainer.style.background = "white";
      tempContainer.style.fontFamily = "Times New Roman, serif";
      tempContainer.style.fontSize = "12px";
      tempContainer.style.lineHeight = "1.4";
      tempContainer.style.color = "#000";
      tempContainer.style.boxSizing = "border-box";
      tempContainer.className = "pdf-generation";

      document.body.appendChild(tempContainer);

      try {
        // Import Preview component and render
        const { default: Preview } = await import(
          "../components/preview/Preview.jsx"
        );
        const { createRoot } = await import("react-dom/client");
        const React = await import("react");

        const root = createRoot(tempContainer);
        root.render(
          React.createElement(
            React.StrictMode,
            null,
            React.createElement(Preview, { data: formData, imageUrl })
          )
        );

        // Wait for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate PDF and return blob
        const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
          import("html2canvas"),
          import("jspdf"),
        ]);

        const element = tempContainer;
        if (!element) throw new Error("Preview element not found");

        // Add special class for PDF generation
        const originalClasses = element.className;
        element.className += " pdf-generation";

        // Wait for CSS to be applied
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Configure html2canvas optimized for Application Form
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          allowTaint: true,
          foreignObjectRendering: false,
          logging: false,
          width: element.offsetWidth,
          height: element.offsetHeight,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.offsetWidth,
          windowHeight: element.offsetHeight,
          ignoreElements: (element) => {
            return (
              element.classList.contains("preview-actions") ||
              element.classList.contains("preview-modal-header")
            );
          },
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // Create PDF A4 with optimized configuration
        const pdf = new jsPDF({
          orientation: "p",
          unit: "pt",
          format: "a4",
          compress: true,
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate margins and content dimensions
        const margin = 36;
        const contentWidth = pageWidth - margin * 2;
        const contentHeight = pageHeight - margin * 2;

        // Calculate scale to fit page width
        const scale = contentWidth / canvas.width;
        const scaledHeight = canvas.height * scale;

        // Handle single page or multi-page content
        if (scaledHeight <= contentHeight) {
          pdf.addImage(
            imgData,
            "JPEG",
            margin,
            margin,
            contentWidth,
            scaledHeight
          );
        } else {
          await this._addMultiPageContent(
            pdf,
            canvas,
            imgData,
            scale,
            margin,
            contentWidth,
            contentHeight
          );
        }

        // Restore original classes
        element.className = originalClasses;

        return pdf.output("blob");
      } finally {
        // Cleanup
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error("PDF generation from data failed:", error);
      throw new Error(`Failed to generate PDF from data: ${error.message}`);
    }
  }

  /**
   * Add multi-page content to PDF
   * @private
   */
  async _addMultiPageContent(
    pdf,
    canvas,
    imgData,
    scale,
    margin,
    contentWidth,
    contentHeight
  ) {
    let yPosition = margin;
    let sourceY = 0;
    const sourceHeight = contentHeight / scale;

    while (sourceY < canvas.height) {
      // Create canvas for each page
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);

      // Draw portion of original image onto page canvas
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      const pageImgHeight = pageCanvas.height * scale;

      pdf.addImage(
        pageImgData,
        "JPEG",
        margin,
        yPosition,
        contentWidth,
        pageImgHeight
      );

      sourceY += sourceHeight;

      // Add new page if more content exists
      if (sourceY < canvas.height) {
        pdf.addPage();
        yPosition = margin;
      }
    }
  }

  /**
   * Generate filename for PDF
   * @param {string} prefix - Filename prefix
   * @returns {string} Generated filename
   */
  generateFilename(prefix = "Application_Form") {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    return `${prefix}_${timestamp}.pdf`;
  }

  /**
   * Validate PDF blob
   * @param {Blob} pdfBlob - PDF blob to validate
   * @returns {boolean} Whether PDF is valid
   */
  validatePdfBlob(pdfBlob) {
    return (
      pdfBlob &&
      pdfBlob instanceof Blob &&
      pdfBlob.size > 0 &&
      pdfBlob.type === "application/pdf"
    );
  }
}

// Export singleton instance
export const pdfController = new PdfController();
