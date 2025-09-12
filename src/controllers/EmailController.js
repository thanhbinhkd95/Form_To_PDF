import { APP_CONSTANTS } from "../constants/appConstants.js";

/**
 * EmailController - Handles all email-related business logic
 * Separated from UI components for better maintainability and testability
 */
export class EmailController {
  constructor() {
    this.emailConfig = {
      subject: APP_CONSTANTS.EMAIL.SUBJECT,
      text: APP_CONSTANTS.EMAIL.TEXT,
      html: APP_CONSTANTS.EMAIL.HTML,
      filename: APP_CONSTANTS.EMAIL.FILENAME,
    };
  }

  /**
   * Send email with PDF attachment
   * @param {Object} params - Email parameters
   * @param {string} params.to - Recipient email
   * @param {Blob} params.pdfBlob - PDF blob to attach
   * @param {string} params.filename - PDF filename
   * @param {Object} params.formData - Form data for email content
   * @returns {Promise<Object>} Email sending result
   */
  async sendEmailWithPdf({ to, pdfBlob, filename, formData }) {
    try {
      // Validate email address
      const emailValidation = this.validateEmailAddress(to);
      if (!emailValidation.valid) {
        return {
          success: false,
          error: emailValidation.error,
          message: "Invalid email address",
        };
      }

      // Validate PDF blob
      if (!pdfBlob || !(pdfBlob instanceof Blob) || pdfBlob.size === 0) {
        return {
          success: false,
          error: "Invalid PDF blob",
          message: "PDF file is required for email",
        };
      }

      // Prepare email content
      const emailContent = this._prepareEmailContent(to, formData);

      // Prepare attachment
      const attachment = {
        filename: filename || this.emailConfig.filename,
        blob: pdfBlob,
      };

      // Send email via service
      const result = await this._sendEmailViaService({
        to,
        subject: this.emailConfig.subject,
        text: emailContent.text,
        html: emailContent.html,
        attachments: [attachment],
      });

      return {
        success: true,
        messageId: result.messageId,
        status: result.status,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to send email",
      };
    }
  }

  /**
   * Send email without attachment (notification only)
   * @param {Object} params - Email parameters
   * @param {string} params.to - Recipient email
   * @param {string} params.subject - Email subject
   * @param {string} params.message - Email message
   * @returns {Promise<Object>} Email sending result
   */
  async sendNotificationEmail({ to, subject, message }) {
    try {
      // Validate email address
      const emailValidation = this.validateEmailAddress(to);
      if (!emailValidation.valid) {
        return {
          success: false,
          error: emailValidation.error,
          message: "Invalid email address",
        };
      }

      // Send email via service
      const result = await this._sendEmailViaService({
        to,
        subject: subject || "Application Form Notification",
        text: message,
        html: `<p>${message}</p>`,
        attachments: [],
      });

      return {
        success: true,
        messageId: result.messageId,
        status: result.status,
        message: "Notification email sent successfully",
      };
    } catch (error) {
      console.error("Notification email sending failed:", error);
      return {
        success: false,
        error: error.message,
        message: "Failed to send notification email",
      };
    }
  }

  /**
   * Validate email address format
   * @param {string} email - Email address to validate
   * @returns {Object} Validation result
   */
  validateEmailAddress(email) {
    if (!email || typeof email !== "string") {
      return {
        valid: false,
        error: "Email address is required",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        error: "Invalid email format",
      };
    }

    return {
      valid: true,
    };
  }

  /**
   * Prepare email content based on form data
   * @private
   */
  _prepareEmailContent(recipientEmail, formData) {
    const recipientName = recipientEmail.split("@")[0];

    const text = `こんにちは ${recipientName} 様,

申請書のPDFファイルが正常に作成されました。
PDFファイルは下記のリンクからダウンロードできます。

Thank you for your application.
Your application form PDF has been successfully created.
Please download the PDF file using the link below.

Best regards,
Application Form System`;

    const html = `
      <p>こんにちは <strong>${recipientName}</strong> 様,</p>
      <p>申請書のPDFファイルが正常に作成されました。</p>
      <p>PDFファイルは下記のリンクからダウンロードできます。</p>
      <br>
      <p>Thank you for your application.</p>
      <p>Your application form PDF has been successfully created.</p>
      <p>Please download the PDF file using the link below.</p>
      <br>
      <p>Best regards,<br>Application Form System</p>
    `;

    return { text, html };
  }

  /**
   * Send email via email service
   * @private
   */
  async _sendEmailViaService({ to, subject, text, html, attachments = [] }) {
    // Import email service dynamically to avoid circular dependencies
    const { sendEmail } = await import("../services/EmailService.js");

    return await sendEmail({
      to,
      subject,
      text,
      html,
      attachments,
    });
  }

  /**
   * Generate email template for different scenarios
   * @param {string} templateType - Type of email template
   * @param {Object} data - Data for template
   * @returns {Object} Email template content
   */
  generateEmailTemplate(templateType, data) {
    switch (templateType) {
      case "submission_success":
        return this._generateSubmissionSuccessTemplate(data);
      case "form_reminder":
        return this._generateFormReminderTemplate(data);
      case "error_notification":
        return this._generateErrorNotificationTemplate(data);
      default:
        return this._generateDefaultTemplate(data);
    }
  }

  /**
   * Generate submission success email template
   * @private
   */
  _generateSubmissionSuccessTemplate(data) {
    return {
      subject: "申請書の送信完了 / Application Form Submission Complete",
      text: `申請書が正常に送信されました。\n\nApplication form has been submitted successfully.`,
      html: `<p>申請書が正常に送信されました。</p><p>Application form has been submitted successfully.</p>`,
    };
  }

  /**
   * Generate form reminder email template
   * @private
   */
  _generateFormReminderTemplate(data) {
    return {
      subject: "申請書の記入リマインダー / Application Form Reminder",
      text: `申請書の記入がまだ完了していません。\n\nApplication form is not yet completed.`,
      html: `<p>申請書の記入がまだ完了していません。</p><p>Application form is not yet completed.</p>`,
    };
  }

  /**
   * Generate error notification email template
   * @private
   */
  _generateErrorNotificationTemplate(data) {
    return {
      subject: "申請書エラー通知 / Application Form Error Notification",
      text: `申請書の処理中にエラーが発生しました。\n\nAn error occurred while processing the application form.`,
      html: `<p>申請書の処理中にエラーが発生しました。</p><p>An error occurred while processing the application form.</p>`,
    };
  }

  /**
   * Generate default email template
   * @private
   */
  _generateDefaultTemplate(data) {
    return {
      subject: "Application Form System",
      text: "Application Form System notification.",
      html: "<p>Application Form System notification.</p>",
    };
  }
}

// Export singleton instance
export const emailController = new EmailController();
