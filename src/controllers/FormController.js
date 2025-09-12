import { APP_CONSTANTS } from "../constants/appConstants.js";

/**
 * FormController - Handles all form-related business logic
 * Separated from UI components for better maintainability and testability
 */
export class FormController {
  constructor() {
    this.validationRules = this._initializeValidationRules();
  }

  /**
   * Validate form data against business rules
   * @param {Object} formData - Form data to validate
   * @param {string} imageUrl - Image URL for validation
   * @returns {Object} Validation result with errors
   */
  validateForm(formData, imageUrl) {
    const errors = {};

    // Personal Information - Required fields
    if (!formData.lastNameRomaji?.trim())
      errors.lastNameRomaji = "姓（ローマ字）/Last Name (Romaji) is required";
    if (!formData.firstNameRomaji?.trim())
      errors.firstNameRomaji = "名（ローマ字）/First Name (Romaji) is required";
    if (!formData.dob) errors.dob = "生年月日/Date of Birth is required";
    if (!formData.nationality?.trim())
      errors.nationality = "国籍/Nationality is required";
    if (!formData.gender?.trim()) errors.gender = "性別/Gender is required";
    if (!formData.maritalStatus?.trim())
      errors.maritalStatus = "婚姻状況/Marital Status is required";
    if (!formData.course?.trim()) errors.course = "コース名/Course is required";
    if (!formData.age) errors.age = "年齢/Age is required";
    if (!formData.passportNumber?.trim())
      errors.passportNumber = "パスポート番号/Passport Number is required";
    if (!formData.passportIssueDate)
      errors.passportIssueDate = "発行日/Issue Date is required";
    if (!formData.passportIssuePlace?.trim())
      errors.passportIssuePlace = "発行地/Issue Place is required";
    if (!formData.passportExpirationDate)
      errors.passportExpirationDate = "有効期限/Expiration Date is required";
    if (!formData.permanentAddress?.trim())
      errors.permanentAddress = "永住地住所/Permanent Address is required";
    if (!formData.currentAddress?.trim())
      errors.currentAddress = "現住所/Current Address is required";
    if (!formData.phone?.trim()) errors.phone = "電話番号/Phone is required";
    if (!formData.email?.trim()) errors.email = "Eメール/E-mail is required";
    if (
      formData.email &&
      !APP_CONSTANTS.VALIDATION.EMAIL_REGEX.test(formData.email)
    ) {
      errors.email = "Eメール/E-mail format is invalid";
    }
    if (!formData.occupation?.trim())
      errors.occupation = "職業/Occupation is required";

    // Education - Required fields
    if (!formData.lastSchoolSummary?.trim())
      errors.lastSchoolSummary = "最終学歴/Last School Attended is required";
    if (!formData.lastSchoolCategory?.trim())
      errors.lastSchoolCategory = "区分/Category is required";
    if (!formData.yearsFromElementary)
      errors.yearsFromElementary = "就学年数/Years from elementary is required";

    // Japanese Learning
    if (!formData.jpLearningHours)
      errors.jpLearningHours =
        "日本語学習時間/Total learning hours is required";

    // School Information - Required fields
    if (!formData.schoolType?.trim())
      errors.schoolType = "学校種別/School Type is required";
    if (!formData.schoolName?.trim())
      errors.schoolName = "学校名/School Name is required";
    if (!formData.major?.trim())
      errors.major = "専攻/Major or Specialty is required";
    if (!formData.desiredJob?.trim())
      errors.desiredJob = "就職・希望職種/Company or Job is required";
    if (!formData.returnHomeYyyyMm?.trim())
      errors.returnHomeYyyyMm = "帰国予定/Return Home is required";
    if (!formData.reasonsForApplying?.trim())
      errors.reasonsForApplying = "志望理由/Reasons for applying is required";

    // Sponsor Information - Required fields
    if (!formData.sponsor?.fullName?.trim())
      errors.sponsorFullName = "経費支弁者氏名/Sponsor Full Name is required";
    if (!formData.sponsor?.relationship?.trim())
      errors.sponsorRelationship = "本人との関係/Relationship is required";
    if (!formData.sponsor?.currentAddress?.trim())
      errors.sponsorCurrentAddress =
        "経費支弁者現住所/Sponsor Current Address is required";
    if (!formData.sponsor?.phone?.trim())
      errors.sponsorPhone = "経費支弁者電話番号/Sponsor Phone is required";
    if (!formData.sponsor?.email?.trim())
      errors.sponsorEmail = "経費支弁者Eメール/Sponsor E-mail is required";
    if (
      formData.sponsor?.email &&
      !APP_CONSTANTS.VALIDATION.EMAIL_REGEX.test(formData.sponsor.email)
    ) {
      errors.sponsorEmail =
        "経費支弁者Eメール/Sponsor E-mail format is invalid";
    }
    if (!formData.sponsor?.company?.trim())
      errors.sponsorCompany = "勤務先/Company is required";
    if (!formData.sponsor?.position?.trim())
      errors.sponsorPosition = "職種・役職/Occupation - Position is required";
    if (!formData.sponsor?.annualIncomeJpy)
      errors.sponsorAnnualIncome = "年収(JPY)/Annual Income is required";

    // Photo - Required
    if (!imageUrl) errors.imageUrl = "顔写真/Photo is required";

    // Conditional validations
    if (
      formData.hasStudiedAtLanguageSchool === "Yes" &&
      (!formData.jpSchools || formData.jpSchools.length === 0)
    ) {
      errors.jpSchools =
        '日本語学校学習歴/Japanese School History is required when "Yes" is selected';
    }
    if (
      formData.employmentYesNo === "Yes" &&
      (!formData.employment || formData.employment.length === 0)
    ) {
      errors.employment =
        '職歴/Employment History is required when "Yes" is selected';
    }
    if (
      formData.familyInJapanYesNo === "Yes" &&
      (!formData.familyInJapan || formData.familyInJapan.length === 0)
    ) {
      errors.familyInJapan =
        '在日親族/Family in Japan information is required when "Yes" is selected';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }

  /**
   * Process form submission
   * @param {Object} formData - Form data to submit
   * @param {string} imageUrl - Image URL
   * @param {Array} attachments - File attachments
   * @returns {Object} Submission result
   */
  async submitForm(formData, imageUrl, attachments = []) {
    try {
      // Validate form data
      const validation = this.validateForm(formData, imageUrl);
      if (!validation.valid) {
        return {
          success: false,
          errors: validation.errors,
          message: "Form validation failed",
        };
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        imageUrl,
        attachments,
        submittedAt: new Date().toISOString(),
        id: this._generateSubmissionId(),
      };

      // Clear localStorage after successful submission
      try {
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.FORM_STATE);
      } catch (err) {
        console.warn("Clear localStorage error", err);
      }

      return {
        success: true,
        data: submissionData,
        message: "Form submitted successfully",
      };
    } catch (error) {
      console.error("Form submission error:", error);
      return {
        success: false,
        error: error.message,
        message: "Form submission failed",
      };
    }
  }

  /**
   * Reset form to initial state
   * @returns {Object} Initial form data
   */
  resetForm() {
    return {
      // Personal
      lastNameRomaji: "",
      firstNameRomaji: "",
      lastNameKanji: "",
      firstNameKanji: "",
      fullName: "",
      dob: "",
      gender: "",
      maritalStatus: "",
      course: "",
      age: "",
      nationality: "",
      passportNumber: "",
      passportIssueDate: "",
      passportIssuePlace: "",
      passportExpirationDate: "",
      email: "",
      phone: "",
      permanentAddress: "",
      currentAddress: "",

      // Education
      education: [],
      lastSchoolSummary: "",
      lastSchoolCategory: "",
      yearsFromElementary: "",

      // Employment
      employmentYesNo: "",
      employment: [],

      // Japanese Study
      hasStudiedAtLanguageSchool: "",
      jpLearningHours: "",
      jpSchools: [],

      // Proficiency
      proficiency: [],
      otherProficiencyNote: "",

      // COE / Visits / Occupation
      coeHistory: { yesNo: "", count: "", deniedCount: "" },
      occupation: "",
      visits: { yesNo: "", count: "", recent: "" },

      // Family
      family: [],
      hasFamilyInJapan: "",
      familyInJapanYesNo: "",
      familyInJapan: [],

      // Post graduation
      schoolType: "",
      schoolName: "",
      major: "",
      desiredJob: "",
      returnHomeYyyyMm: "",
      motivation: "",

      // Sponsor
      sponsor: {
        fullName: "",
        relationship: "",
        currentAddress: "",
        phone: "",
        email: "",
        company: "",
        position: "",
        workAddress: "",
        workPhone: "",
        annualIncomeJpy: "",
        exchangeRate: "",
      },

      // Others
      notes: "",
      reasonsForApplying: "",
    };
  }

  /**
   * Process form data for specific operations
   * @param {Object} formData - Raw form data
   * @returns {Object} Processed form data
   */
  processFormData(formData) {
    return {
      ...formData,
      // Add any data processing logic here
      processedAt: new Date().toISOString(),
    };
  }

  /**
   * Initialize validation rules (can be extended)
   * @private
   */
  _initializeValidationRules() {
    return {
      required: [
        "lastNameRomaji",
        "firstNameRomaji",
        "dob",
        "nationality",
        "gender",
        "maritalStatus",
        "course",
        "age",
        "passportNumber",
        "passportIssueDate",
        "passportIssuePlace",
        "passportExpirationDate",
        "permanentAddress",
        "currentAddress",
        "phone",
        "email",
        "occupation",
      ],
      email: ["email", "sponsor.email"],
      conditional: {
        jpSchools: "hasStudiedAtLanguageSchool",
        employment: "employmentYesNo",
        familyInJapan: "familyInJapanYesNo",
      },
    };
  }

  /**
   * Generate unique submission ID
   * @private
   */
  _generateSubmissionId() {
    return `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const formController = new FormController();
