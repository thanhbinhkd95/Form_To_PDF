import { useCallback } from "react";
import { useFormContext } from "../context/useFormContext.js";
import { APP_CONSTANTS } from "../constants/appConstants.js";
import { formController } from "../controllers/FormController.js";

export function useForm() {
  const { state, dispatch } = useFormContext();

  const updateForm = useCallback(
    (partial) => {
      dispatch({ type: "UPDATE_FORM", payload: partial });
    },
    [dispatch]
  );

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
    dispatch({ type: "CLEAR_IMAGE" });
  }, [dispatch]);

  const resetToForm = useCallback(() => {
    dispatch({ type: "RESET_TO_FORM" });
  }, [dispatch]);

  const navigateToPreview = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_PREVIEW" });
  }, [dispatch]);

  const navigateToSuccess = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_SUCCESS" });
  }, [dispatch]);

  const setValidationErrors = useCallback(
    (errors) => {
      dispatch({ type: "SET_VALIDATION_ERRORS", payload: errors });
    },
    [dispatch]
  );

  const clearValidationErrors = useCallback(() => {
    dispatch({ type: "CLEAR_VALIDATION_ERRORS" });
  }, [dispatch]);

  const validate = useCallback(
    (values = state.formData, imageUrl = state.imageUrl) => {
      return formController.validateForm(values, imageUrl);
    },
    [state.formData, state.imageUrl]
  );

  const submitForm = useCallback(async () => {
    const validation = validate(state.formData, state.imageUrl);
    if (validation.valid) {
      // Use controller for form submission
      const result = await formController.submitForm(
        state.formData,
        state.imageUrl,
        state.attachments
      );
      if (result.success) {
        dispatch({ type: "SUBMIT_FORM" });
        dispatch({ type: "CLEAR_VALIDATION_ERRORS" });
        return true;
      } else {
        setValidationErrors(result.errors || {});
        return false;
      }
    } else {
      setValidationErrors(validation.errors);
      return false;
    }
  }, [
    dispatch,
    setValidationErrors,
    state.formData,
    state.imageUrl,
    state.attachments,
    validate,
  ]);

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
    currentPage: state.currentPage,
  };
}
