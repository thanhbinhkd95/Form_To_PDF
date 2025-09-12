import { APP_CONSTANTS } from "../constants/appConstants.js";

/**
 * PdfService - Handles PDF generation and file operations
 * Separated from controllers for better separation of concerns
 */
export class PdfService {
  constructor() {
    this.defaultConfig = {
      orientation: APP_CONSTANTS.PDF.ORIENTATION,
      unit: APP_CONSTANTS.PDF.UNIT,
      format: APP_CONSTANTS.PDF.FORMAT,
      scale: APP_CONSTANTS.PDF.SCALE,
      quality: APP_CONSTANTS.PDF.QUALITY,
      margin: APP_CONSTANTS.PDF.MARGIN,
    };
  }

  /**
   * Generate PDF from DOM element
   * @param {string} selector - CSS selector for target element
   * @param {Object} options - PDF generation options
   * @returns {Promise<Blob>} Generated PDF blob
   */
  async generatePdfFromElement(selector, options = {}) {
    try {
      const config = { ...this.defaultConfig, ...options };

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element with selector "${selector}" not found`);
      }

      // Prepare element for PDF generation
      const originalClasses = element.className;
      element.className += " pdf-generation";

      // Wait for CSS to be applied
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Generate canvas from element
      const canvas = await html2canvas(element, {
        scale: config.scale,
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
            element.classList.contains("preview-modal-header") ||
            element.classList.contains("no-print")
          );
        },
      });

      // Create PDF document
      const pdf = new jsPDF({
        orientation: config.orientation,
        unit: config.unit,
        format: config.format,
        compress: true,
      });

      // Add content to PDF
      await this._addContentToPdf(pdf, canvas, config);

      // Restore original classes
      element.className = originalClasses;

      return pdf.output("blob");
    } catch (error) {
      console.error("PDF generation from element failed:", error);
      throw new Error(`Failed to generate PDF from element: ${error.message}`);
    }
  }

  /**
   * Generate PDF from form data by rendering component
   * @param {Object} formData - Form data to render
   * @param {string} imageUrl - Image URL
   * @param {Object} options - PDF generation options
   * @returns {Promise<Blob>} Generated PDF blob
   */
  async generatePdfFromData(formData, imageUrl, options = {}) {
    try {
      const config = { ...this.defaultConfig, ...options };

      // Create temporary container
      const tempContainer = this._createTempContainer();
      document.body.appendChild(tempContainer);

      try {
        // Render Preview component
        await this._renderPreviewComponent(tempContainer, formData, imageUrl);

        // Wait for rendering to complete
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate PDF from rendered component
        const pdfBlob = await this.generatePdfFromElement(
          tempContainer,
          config
        );

        return pdfBlob;
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
   * Download PDF blob as file
   * @param {Blob} pdfBlob - PDF blob to download
   * @param {string} filename - Filename for download
   * @returns {boolean} Success status
   */
  downloadPdf(pdfBlob, filename) {
    try {
      if (!pdfBlob || !(pdfBlob instanceof Blob)) {
        throw new Error("Invalid PDF blob provided");
      }

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || this._generateDefaultFilename();
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup URL
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      return true;
    } catch (error) {
      console.error("PDF download failed:", error);
      return false;
    }
  }

  /**
   * Get PDF blob info
   * @param {Blob} pdfBlob - PDF blob to analyze
   * @returns {Object} PDF blob information
   */
  getPdfInfo(pdfBlob) {
    try {
      if (!pdfBlob || !(pdfBlob instanceof Blob)) {
        return {
          valid: false,
          error: "Invalid PDF blob",
        };
      }

      return {
        valid: true,
        size: pdfBlob.size,
        sizeFormatted: this._formatFileSize(pdfBlob.size),
        type: pdfBlob.type,
        lastModified: new Date(pdfBlob.lastModified).toISOString(),
      };
    } catch (error) {
      console.error("Get PDF info failed:", error);
      return {
        valid: false,
        error: error.message,
      };
    }
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

  /**
   * Create PDF with custom configuration
   * @param {Object} config - PDF configuration
   * @returns {Object} jsPDF instance
   */
  async createPdfDocument(config = {}) {
    const pdfConfig = { ...this.defaultConfig, ...config };

    const { jsPDF } = await import("jspdf");
    return new jsPDF({
      orientation: pdfConfig.orientation,
      unit: pdfConfig.unit,
      format: pdfConfig.format,
      compress: true,
    });
  }

  /**
   * Add content to PDF document
   * @private
   */
  async _addContentToPdf(pdf, canvas, config) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = config.margin;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    const imgData = canvas.toDataURL("image/jpeg", config.quality);
    const scale = contentWidth / canvas.width;
    const scaledHeight = canvas.height * scale;

    if (scaledHeight <= contentHeight) {
      // Single page
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, scaledHeight);
    } else {
      // Multi-page
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
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);

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

      if (sourceY < canvas.height) {
        pdf.addPage();
        yPosition = margin;
      }
    }
  }

  /**
   * Create temporary container for rendering
   * @private
   */
  _createTempContainer() {
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

    return tempContainer;
  }

  /**
   * Render Preview component in container
   * @private
   */
  async _renderPreviewComponent(container, formData, imageUrl) {
    const { default: Preview } = await import("../components/Preview.jsx");
    const { createRoot } = await import("react-dom/client");
    const React = await import("react");

    const root = createRoot(container);
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(Preview, { data: formData, imageUrl })
      )
    );
  }

  /**
   * Generate default filename
   * @private
   */
  _generateDefaultFilename() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    return `Application_Form_${timestamp}.pdf`;
  }

  /**
   * Format file size in human readable format
   * @private
   */
  _formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

// Export singleton instance
export const pdfService = new PdfService();
