// UI Constants for consistent styling and behavior

export const UI_CONSTANTS = {
  // Colors
  COLORS: {
    PRIMARY: '#1e3a8a',
    PRIMARY_LIGHT: '#1e40af',
    SECONDARY: '#3b82f6',
    SUCCESS: '#10b981',
    SUCCESS_DARK: '#059669',
    ERROR: '#dc2626',
    ERROR_DARK: '#b91c1c',
    WARNING: '#f59e0b',
    WARNING_DARK: '#d97706',
    GRAY_LIGHT: '#f8fafc',
    GRAY_MEDIUM: '#4b5563',
    GRAY_DARK: '#1f2937',
    BORDER_LIGHT: 'rgba(30, 58, 138, 0.1)'
  },

  // Spacing
  SPACING: {
    XS: '4px',
    SM: '8px',
    MD: '16px',
    LG: '24px',
    XL: '32px'
  },

  // Border radius
  BORDER_RADIUS: {
    SM: '6px',
    MD: '8px',
    LG: '12px'
  },

  // Font sizes
  FONT_SIZES: {
    XS: '12px',
    SM: '14px',
    MD: '16px',
    LG: '18px',
    XL: '24px'
  },

  // Z-index
  Z_INDEX: {
    MODAL: 1000,
    DROPDOWN: 100,
    TOOLTIP: 50
  },

  // Animation durations
  ANIMATION: {
    FAST: '0.2s',
    NORMAL: '0.3s',
    SLOW: '0.5s'
  },

  // File upload
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
    PHOTO_RATIO: {
      WIDTH: 200,
      HEIGHT: 267 // 4:3 ratio for 4cm x 3cm
    }
  },

  // Dialog
  DIALOG: {
    MAX_WIDTH: '500px',
    MIN_WIDTH: '300px'
  }
}
