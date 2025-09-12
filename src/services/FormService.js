import { APP_CONSTANTS } from "../constants/appConstants.js";

/**
 * FormService - Handles form data persistence and retrieval
 * Separated from controllers for better separation of concerns
 */
export class FormService {
  constructor() {
    this.storageKey = APP_CONSTANTS.STORAGE_KEYS.FORM_STATE;
    this.debounceDelay = APP_CONSTANTS.DEBOUNCE.LOCAL_STORAGE;
  }

  /**
   * Save form data to localStorage with debouncing
   * @param {Object} formData - Form data to save
   * @param {string} imageUrl - Image URL
   * @param {Array} attachments - File attachments
   * @param {string} theme - Current theme
   * @returns {Promise<boolean>} Success status
   */
  async saveFormData(formData, imageUrl, attachments = [], theme = "light") {
    try {
      const snapshot = {
        formData,
        imageUrl,
        theme,
        attachments: attachments.map((att) => ({
          ...att,
          file: undefined, // Remove file object for serialization
        })),
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(this.storageKey, JSON.stringify(snapshot));
      return true;
    } catch (error) {
      console.warn("Save form data error:", error);
      return false;
    }
  }

  /**
   * Load form data from localStorage
   * @returns {Object|null} Loaded form data or null if not found
   */
  loadFormData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return parsed;
    } catch (error) {
      console.warn("Load form data error:", error);
      return null;
    }
  }

  /**
   * Clear form data from localStorage
   * @returns {boolean} Success status
   */
  clearFormData() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.warn("Clear form data error:", error);
      return false;
    }
  }

  /**
   * Check if form data exists in localStorage
   * @returns {boolean} Whether form data exists
   */
  hasFormData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw !== null;
    } catch (error) {
      console.warn("Check form data error:", error);
      return false;
    }
  }

  /**
   * Get form data metadata (size, last modified, etc.)
   * @returns {Object|null} Form data metadata
   */
  getFormDataMetadata() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return {
        size: raw.length,
        lastModified: parsed.savedAt || null,
        hasImage: !!parsed.imageUrl,
        attachmentsCount: parsed.attachments?.length || 0,
        theme: parsed.theme || "light",
      };
    } catch (error) {
      console.warn("Get form data metadata error:", error);
      return null;
    }
  }

  /**
   * Export form data as JSON
   * @returns {string|null} JSON string or null if error
   */
  exportFormData() {
    try {
      const formData = this.loadFormData();
      if (!formData) return null;

      return JSON.stringify(formData, null, 2);
    } catch (error) {
      console.warn("Export form data error:", error);
      return null;
    }
  }

  /**
   * Import form data from JSON
   * @param {string} jsonData - JSON string to import
   * @returns {boolean} Success status
   */
  importFormData(jsonData) {
    try {
      const parsed = JSON.parse(jsonData);

      // Validate imported data structure
      if (!this._validateFormDataStructure(parsed)) {
        throw new Error("Invalid form data structure");
      }

      localStorage.setItem(this.storageKey, JSON.stringify(parsed));
      return true;
    } catch (error) {
      console.warn("Import form data error:", error);
      return false;
    }
  }

  /**
   * Create backup of current form data
   * @returns {Object|null} Backup data
   */
  createBackup() {
    try {
      const formData = this.loadFormData();
      if (!formData) return null;

      const backup = {
        ...formData,
        backupCreatedAt: new Date().toISOString(),
        backupId: this._generateBackupId(),
      };

      // Store backup in separate key
      const backupKey = `${this.storageKey}_backup_${backup.backupId}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));

      return backup;
    } catch (error) {
      console.warn("Create backup error:", error);
      return null;
    }
  }

  /**
   * Restore from backup
   * @param {string} backupId - Backup ID to restore
   * @returns {boolean} Success status
   */
  restoreFromBackup(backupId) {
    try {
      const backupKey = `${this.storageKey}_backup_${backupId}`;
      const raw = localStorage.getItem(backupKey);

      if (!raw) {
        throw new Error("Backup not found");
      }

      const backup = JSON.parse(raw);

      // Remove backup-specific fields
      delete backup.backupCreatedAt;
      delete backup.backupId;

      localStorage.setItem(this.storageKey, JSON.stringify(backup));
      return true;
    } catch (error) {
      console.warn("Restore from backup error:", error);
      return false;
    }
  }

  /**
   * List available backups
   * @returns {Array} List of available backups
   */
  listBackups() {
    try {
      const backups = [];
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(`${this.storageKey}_backup_`)) {
          try {
            const raw = localStorage.getItem(key);
            const backup = JSON.parse(raw);
            backups.push({
              id: backup.backupId,
              createdAt: backup.backupCreatedAt,
              size: raw.length,
            });
          } catch (error) {
            console.warn(`Error parsing backup ${key}:`, error);
          }
        }
      });

      return backups.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch (error) {
      console.warn("List backups error:", error);
      return [];
    }
  }

  /**
   * Clean up old backups (older than specified days)
   * @param {number} daysOld - Number of days to keep backups
   * @returns {number} Number of backups cleaned up
   */
  cleanupOldBackups(daysOld = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const backups = this.listBackups();
      let cleanedCount = 0;

      backups.forEach((backup) => {
        if (new Date(backup.createdAt) < cutoffDate) {
          const backupKey = `${this.storageKey}_backup_${backup.id}`;
          localStorage.removeItem(backupKey);
          cleanedCount++;
        }
      });

      return cleanedCount;
    } catch (error) {
      console.warn("Cleanup old backups error:", error);
      return 0;
    }
  }

  /**
   * Validate form data structure
   * @private
   */
  _validateFormDataStructure(data) {
    return (
      data &&
      typeof data === "object" &&
      data.formData &&
      typeof data.formData === "object"
    );
  }

  /**
   * Generate backup ID
   * @private
   */
  _generateBackupId() {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const formService = new FormService();
