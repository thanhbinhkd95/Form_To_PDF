// Application constants
export const APP_CONSTANTS = {
  // Local storage keys
  STORAGE_KEYS: {
    FORM_STATE: 'form_state_v1',
  },
  
  // Debounce timings (in milliseconds)
  DEBOUNCE: {
    LOCAL_STORAGE: 500,
    PDF_GENERATION: 100,
  },
  
  // PDF settings
  PDF: {
    SCALE: 2,
    QUALITY: 0.95,
    ORIENTATION: 'p',
    UNIT: 'pt',
    FORMAT: 'a4',
    MARGIN: 36,
    CONTENT_WIDTH: 794, // A4 width in pixels
    CONTENT_PADDING: 76, // 20mm in pixels
  },
  
  // Email settings
  EMAIL: {
    SUBJECT: 'Biểu mẫu của bạn',
    TEXT: 'Đính kèm là bản PDF của biểu mẫu bạn vừa gửi.',
    HTML: '<p>Đính kèm là bản PDF của biểu mẫu bạn vừa gửi.</p>',
    FILENAME: 'form.pdf',
  },
  
  // File upload settings
  FILE: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  },
  
  // Firebase storage paths
  STORAGE_PATHS: {
    APPLICATION_FORMS: 'application-forms/',
  },
  
  // Validation patterns
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
}
