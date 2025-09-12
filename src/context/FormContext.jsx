import { useEffect, useMemo, useReducer } from 'react'
import { FormContext } from './context.js'
import { APP_CONSTANTS } from '../constants/appConstants.js'

const initialState = {
  formData: {
    // Personal
    // Names split per design (Romaji/Kanji)
    lastNameRomaji: '', firstNameRomaji: '',
    lastNameKanji: '', firstNameKanji: '',
    fullName: '', dob: '', gender: '', maritalStatus: '', course: '', age: '',
    nationality: '', passportNumber: '', passportIssueDate: '', passportIssuePlace: '', passportExpirationDate: '',
    email: '', phone: '',
    permanentAddress: '', currentAddress: '',

    // Education
    education: [], // { schoolName, startYm, endYm, yearsAttended, location }
    lastSchoolSummary: '', lastSchoolCategory: '', yearsFromElementary: '',

    // Employment
    employmentYesNo: '',
    employment: [], // { companyName, startYm, endYm, jobTitle, location }

    // Japanese Study
    hasStudiedAtLanguageSchool: '', // 'Yes' | 'No'
    jpLearningHours: '',
    jpSchools: [], // { schoolName, startYm, endYm }

    // Proficiency
    proficiency: [], // { testName, year, level, score, result }
    otherProficiencyNote: '',

    // COE / Visits / Occupation
    coeHistory: { yesNo: '', count: '', deniedCount: '' },
    occupation: '',
    visits: { yesNo: '', count: '', recent: '' },

    // Family
    family: [], // { relation, name, dob, nationality, occupation, address }
    hasFamilyInJapan: '', // 'Yes' | 'No'
    familyInJapanYesNo: '',
    familyInJapan: [], // { relation, name, dob, nationality, phone, school, status, address }

    // Post graduation
    schoolType: '', schoolName: '', major: '', desiredJob: '', returnHomeYyyyMm: '', motivation: '',

    // Sponsor
    sponsor: {
      fullName: '', relationship: '', currentAddress: '', phone: '', email: '',
      company: '', position: '', workAddress: '', workPhone: '',
      annualIncomeJpy: '', exchangeRate: '',
    },

    // Others
    notes: '',
    reasonsForApplying: '',
  },
  imageUrl: null, // portrait 4x3
  attachments: [], // { name, size, type, previewUrl }
  status: { generatingPdf: false, sendingEmail: false, submitting: false },
  pdfBlob: null,
  theme: 'light',
  // New states for submit functionality
  isSubmitted: false,
  submittedData: null,
  validationErrors: {},
  currentPage: 'form', // 'form', 'success', 'preview'
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } }
    case 'RESET_FORM':
      return { 
        ...state, 
        formData: initialState.formData, 
        pdfBlob: null, 
        attachments: [], 
        imageUrl: null,
        isSubmitted: false,
        submittedData: null,
        validationErrors: {}
      }
    case 'SET_IMAGE':
      return { ...state, imageUrl: action.payload }
    case 'CLEAR_IMAGE':
      return { ...state, imageUrl: null }
    case 'SET_STATUS':
      return { ...state, status: { ...state.status, ...action.payload } }
    case 'SET_PDF':
      return { ...state, pdfBlob: action.payload }
    case 'ADD_ATTACHMENT': {
      // Thay thế attachment cũ nếu có cùng key, hoặc thêm mới
      const filteredAttachments = state.attachments.filter(att => att.key !== action.payload.key)
      return { ...state, attachments: [...filteredAttachments, action.payload] }
    }
    case 'REMOVE_ATTACHMENT':
      return { ...state, attachments: state.attachments.filter((_, i) => i !== action.payload) }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload }
    case 'CLEAR_VALIDATION_ERRORS':
      return { ...state, validationErrors: {} }
    case 'SUBMIT_FORM':
      // Clear localStorage sau khi submit thành công
      try {
        localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.FORM_STATE)
      } catch (err) {
        console.warn('Clear localStorage error', err)
      }
      return { 
        ...state, 
        isSubmitted: true, 
        submittedData: { ...state.formData, imageUrl: state.imageUrl, attachments: state.attachments },
        status: { ...state.status, submitting: true },
        currentPage: 'success'
      }
    case 'RESET_TO_FORM':
      return { 
        ...state, 
        isSubmitted: false, 
        submittedData: null,
        formData: initialState.formData,
        imageUrl: null,
        attachments: [],
        validationErrors: {},
        currentPage: 'form'
      }
    case 'NAVIGATE_TO_PREVIEW':
      return { 
        ...state, 
        currentPage: 'preview'
      }
    case 'NAVIGATE_TO_SUCCESS':
      return { 
        ...state, 
        currentPage: 'success'
      }
    default:
      return state
  }
}

export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.FORM_STATE)
      if (raw) {
        const parsed = JSON.parse(raw)
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch (err) {
      console.warn('Hydrate state error', err)
    }
  }, [])

  // persist minimal state with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const snapshot = {
        formData: state.formData,
        imageUrl: state.imageUrl,
        theme: state.theme,
        attachments: state.attachments.map(att => ({
          ...att,
          file: undefined // Remove file object for serialization
        }))
      }
      try { 
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.FORM_STATE, JSON.stringify(snapshot)) 
      } catch (err) {
        console.warn('Persist state error', err)
      }
    }, APP_CONSTANTS.DEBOUNCE.LOCAL_STORAGE) // Debounce by 500ms

    return () => clearTimeout(timeoutId)
  }, [state.formData, state.imageUrl, state.theme, state.attachments])

  // theme application
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.theme])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

// Hooks moved to separate file to support fast-refresh


