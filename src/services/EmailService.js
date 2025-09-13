import emailjs from "@emailjs/browser";
import { uploadPdfToStorage } from "./firebaseStorage.js";

/**
 * EmailService - Handles email sending operations
 * Separated from controllers for better separation of concerns
 */
export class EmailService {
  constructor() {
    this.config = {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    };

    this._validateConfig();
    this._initializeEmailJS();
  }

  /**
   * Send email with attachments
   * @param {Object} params - Email parameters
   * @param {string} params.to - Recipient email
   * @param {string} params.subject - Email subject
   * @param {string} params.text - Email text content
   * @param {string} params.html - Email HTML content
   * @param {Array} params.attachments - Email attachments
   * @returns {Promise<Object>} Email sending result
   */
  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      console.log("Sending email with EmailJS...", {
        to,
        subject,
        attachmentsCount: attachments.length,
      });

      // Prepare template parameters
      const templateParams = this._prepareTemplateParams(
        to,
        subject,
        text,
        html
      );

      // Process PDF attachment if present
      if (attachments.length > 0) {
        await this._processPdfAttachment(attachments[0], templateParams);
      }

      // Debug: Log template parameters
      console.log("EmailJS Template Parameters:", templateParams);
      console.log("EmailJS Config:", {
        serviceId: this.config.serviceId,
        templateId: this.config.templateId,
        publicKey: this.config.publicKey?.substring(0, 10) + "...",
      });

      // Send email via EmailJS
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );

      console.log("Email sent successfully:", response);
      return {
        ok: true,
        messageId: response.text,
        status: response.status,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.text || error.message}`);
    }
  }

  /**
   * Send simple notification email
   * @param {Object} params - Email parameters
   * @param {string} params.to - Recipient email
   * @param {string} params.subject - Email subject
   * @param {string} params.message - Email message
   * @returns {Promise<Object>} Email sending result
   */
  async sendNotification({ to, subject, message }) {
    return await this.sendEmail({
      to,
      subject: subject || "Application Form Notification",
      text: message,
      html: `<p>${message}</p>`,
      attachments: [],
    });
  }

  /**
   * Send email with PDF attachment
   * @param {Object} params - Email parameters
   * @param {string} params.to - Recipient email
   * @param {Blob} params.pdfBlob - PDF blob to attach
   * @param {string} params.filename - PDF filename
   * @param {string} params.subject - Email subject
   * @param {string} params.message - Email message
   * @returns {Promise<Object>} Email sending result
   */
  async sendEmailWithPdf({ to, pdfBlob, filename, subject, message }) {
    const attachment = {
      filename: filename || "application_form.pdf",
      blob: pdfBlob,
    };

    return await this.sendEmail({
      to,
      subject: subject || "Application Form PDF",
      text: message || "Please find attached the application form PDF.",
      html: `<p>${message || "Please find attached the application form PDF."}</p>`,
      attachments: [attachment],
    });
  }

  /**
   * Validate email configuration
   * @returns {boolean} Whether configuration is valid
   */
  validateConfig() {
    return !!(
      this.config.serviceId &&
      this.config.templateId &&
      this.config.publicKey
    );
  }

  /**
   * Get email service status
   * @returns {Object} Service status information
   */
  getServiceStatus() {
    return {
      configured: this.validateConfig(),
      serviceId: this.config.serviceId ? "Configured" : "Missing",
      templateId: this.config.templateId ? "Configured" : "Missing",
      publicKey: this.config.publicKey ? "Configured" : "Missing",
    };
  }

  /**
   * Test email service connection
   * @returns {Promise<Object>} Test result
   */
  async testConnection() {
    try {
      if (!this.validateConfig()) {
        return {
          success: false,
          error: "Email service not properly configured",
        };
      }

      // Send a test email (you might want to implement a test template)
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        {
          to_email: "test@example.com",
          to_name: "Test User",
          subject: "Test Email",
          message: "This is a test email to verify EmailJS configuration.",
        }
      );

      return {
        success: true,
        message: "Email service connection successful",
        response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Email service connection failed",
      };
    }
  }

  /**
   * Prepare template parameters for EmailJS
   * @private
   */
  _prepareTemplateParams(to, subject, text, html) {
    return {
      to_email: to,
      to_name: to.split("@")[0],
      user_name: to.split("@")[0],
      subject: subject,
      message: text || html,
      from_name: "Application Form System",
      pdf_download_url: "", // Will be set when PDF is processed
      pdf_filename: "",
      pdf_size_kb: 0,
    };
  }

  /**
   * Process PDF attachment and upload to storage
   * @private
   */
  async _processPdfAttachment(attachment, templateParams) {
    try {
      console.log("Processing PDF attachment...");
      const pdfBlob = attachment.blob;
      const filename = attachment.filename || "application_form.pdf";

      console.log("PDF blob info:", {
        filename: filename,
        size: pdfBlob.size,
        type: pdfBlob.type,
      });

      // Upload PDF to Firebase Storage
      console.log("Uploading PDF to Firebase Storage...");
      const downloadURL = await uploadPdfToStorage(pdfBlob, filename);

      // Add PDF download URL to template parameters
      templateParams.pdf_download_url = downloadURL;
      templateParams.pdf_filename = filename;
      templateParams.pdf_size_kb = Math.round(pdfBlob.size / 1024);

      console.log("PDF uploaded successfully:", downloadURL);
    } catch (error) {
      console.error("Error processing PDF attachment:", error);
      throw new Error(`Failed to process PDF attachment: ${error.message}`);
    }
  }

  /**
   * Validate EmailJS configuration
   * @private
   */
  _validateConfig() {
    if (
      !this.config.serviceId ||
      !this.config.templateId ||
      !this.config.publicKey
    ) {
      const missing = [
        !this.config.serviceId ? "VITE_EMAILJS_SERVICE_ID" : null,
        !this.config.templateId ? "VITE_EMAILJS_TEMPLATE_ID" : null,
        !this.config.publicKey ? "VITE_EMAILJS_PUBLIC_KEY" : null,
      ]
        .filter(Boolean)
        .join(", ");

      throw new Error(`Missing EmailJS environment variables: ${missing}`);
    }
  }

  /**
   * Initialize EmailJS
   * @private
   */
  _initializeEmailJS() {
    try {
      emailjs.init(this.config.publicKey);
      console.log("EmailJS initialized successfully");
    } catch (error) {
      console.error("Failed to initialize EmailJS:", error);
      throw new Error(`Failed to initialize EmailJS: ${error.message}`);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export legacy function for backward compatibility
export async function sendEmail({ to, subject, text, html, attachments = [] }) {
  return await emailService.sendEmail({ to, subject, text, html, attachments });
}
