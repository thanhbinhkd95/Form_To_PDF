import { useCallback } from 'react'
import { useFormContext } from '../context/useFormContext.js'

export function useForm() {
  const { state, dispatch } = useFormContext()

  const updateForm = useCallback((partial) => {
    dispatch({ type: 'UPDATE_FORM', payload: partial })
  }, [dispatch])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
    dispatch({ type: 'CLEAR_IMAGE' })
  }, [dispatch])

  const resetToForm = useCallback(() => {
    dispatch({ type: 'RESET_TO_FORM' })
  }, [dispatch])

  const navigateToPreview = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_PREVIEW' })
  }, [dispatch])

  const navigateToSuccess = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_SUCCESS' })
  }, [dispatch])

  const setValidationErrors = useCallback((errors) => {
    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors })
  }, [dispatch])

  const clearValidationErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })
  }, [dispatch])

  function validate(values = state.formData, imageUrl = state.imageUrl) {
    const errors = {}
    
    // Personal Information - Required fields
    if (!values.lastNameRomaji?.trim()) errors.lastNameRomaji = '姓（ローマ字）/Last Name (Romaji) is required'
    if (!values.firstNameRomaji?.trim()) errors.firstNameRomaji = '名（ローマ字）/First Name (Romaji) is required'
    if (!values.dob) errors.dob = '生年月日/Date of Birth is required'
    if (!values.nationality?.trim()) errors.nationality = '国籍/Nationality is required'
    if (!values.gender?.trim()) errors.gender = '性別/Gender is required'
    if (!values.maritalStatus?.trim()) errors.maritalStatus = '婚姻状況/Marital Status is required'
    if (!values.course?.trim()) errors.course = 'コース名/Course is required'
    if (!values.age) errors.age = '年齢/Age is required'
    if (!values.passportNumber?.trim()) errors.passportNumber = 'パスポート番号/Passport Number is required'
    if (!values.passportIssueDate) errors.passportIssueDate = '発行日/Issue Date is required'
    if (!values.passportIssuePlace?.trim()) errors.passportIssuePlace = '発行地/Issue Place is required'
    if (!values.passportExpirationDate) errors.passportExpirationDate = '有効期限/Expiration Date is required'
    if (!values.permanentAddress?.trim()) errors.permanentAddress = '永住地住所/Permanent Address is required'
    if (!values.currentAddress?.trim()) errors.currentAddress = '現住所/Current Address is required'
    if (!values.phone?.trim()) errors.phone = '電話番号/Phone is required'
    if (!values.email?.trim()) errors.email = 'Eメール/E-mail is required'
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Eメール/E-mail format is invalid'
    if (!values.occupation?.trim()) errors.occupation = '職業/Occupation is required'
    
    // Education - Required fields
    if (!values.lastSchoolSummary?.trim()) errors.lastSchoolSummary = '最終学歴/Last School Attended is required'
    if (!values.lastSchoolCategory?.trim()) errors.lastSchoolCategory = '区分/Category is required'
    if (!values.yearsFromElementary) errors.yearsFromElementary = '就学年数/Years from elementary is required'
    
    // Japanese Learning
    if (!values.jpLearningHours) errors.jpLearningHours = '日本語学習時間/Total learning hours is required'
    
    // School Information - Required fields
    if (!values.schoolType?.trim()) errors.schoolType = '学校種別/School Type is required'
    if (!values.schoolName?.trim()) errors.schoolName = '学校名/School Name is required'
    if (!values.major?.trim()) errors.major = '専攻/Major or Specialty is required'
    if (!values.desiredJob?.trim()) errors.desiredJob = '就職・希望職種/Company or Job is required'
    if (!values.returnHomeYyyyMm?.trim()) errors.returnHomeYyyyMm = '帰国予定/Return Home is required'
    if (!values.reasonsForApplying?.trim()) errors.reasonsForApplying = '志望理由/Reasons for applying is required'
    
    // Sponsor Information - Required fields
    if (!values.sponsor?.fullName?.trim()) errors.sponsorFullName = '経費支弁者氏名/Sponsor Full Name is required'
    if (!values.sponsor?.relationship?.trim()) errors.sponsorRelationship = '本人との関係/Relationship is required'
    if (!values.sponsor?.currentAddress?.trim()) errors.sponsorCurrentAddress = '経費支弁者現住所/Sponsor Current Address is required'
    if (!values.sponsor?.phone?.trim()) errors.sponsorPhone = '経費支弁者電話番号/Sponsor Phone is required'
    if (!values.sponsor?.email?.trim()) errors.sponsorEmail = '経費支弁者Eメール/Sponsor E-mail is required'
    if (values.sponsor?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.sponsor.email)) errors.sponsorEmail = '経費支弁者Eメール/Sponsor E-mail format is invalid'
    if (!values.sponsor?.company?.trim()) errors.sponsorCompany = '勤務先/Company is required'
    if (!values.sponsor?.position?.trim()) errors.sponsorPosition = '職種・役職/Occupation - Position is required'
    if (!values.sponsor?.annualIncomeJpy) errors.sponsorAnnualIncome = '年収(JPY)/Annual Income is required'
    
    // Photo - Required
    if (!imageUrl) errors.imageUrl = '顔写真/Photo is required'
    
    // Conditional validations
    if (values.hasStudiedAtLanguageSchool === 'Yes' && (!values.jpSchools || values.jpSchools.length === 0)) {
      errors.jpSchools = '日本語学校学習歴/Japanese School History is required when "Yes" is selected'
    }
    if (values.employmentYesNo === 'Yes' && (!values.employment || values.employment.length === 0)) {
      errors.employment = '職歴/Employment History is required when "Yes" is selected'
    }
    if (values.familyInJapanYesNo === 'Yes' && (!values.familyInJapan || values.familyInJapan.length === 0)) {
      errors.familyInJapan = '在日親族/Family in Japan information is required when "Yes" is selected'
    }
    
    return { valid: Object.keys(errors).length === 0, errors }
  }

  const submitForm = useCallback(() => {
    const validation = validate(state.formData, state.imageUrl)
    if (validation.valid) {
      dispatch({ type: 'SUBMIT_FORM' })
      dispatch({ type: 'CLEAR_VALIDATION_ERRORS' })
      return true
    } else {
      setValidationErrors(validation.errors)
      return false
    }
  }, [dispatch, setValidationErrors, state.formData, state.imageUrl])

  return { 
    formData: state.formData, 
    updateForm, 
    resetForm, 
    resetToForm,
    navigateToPreview,
    navigateToSuccess,
    validate,
    submitForm,
    isSubmitted: state.isSubmitted,
    submittedData: state.submittedData,
    validationErrors: state.validationErrors,
    clearValidationErrors,
    currentPage: state.currentPage
  }
}


