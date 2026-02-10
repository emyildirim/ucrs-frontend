import { AxiosError } from 'axios';

interface ValidationErrors {
  [key: string]: string[];
}

interface ApiError {
  message?: string;
  errors?: ValidationErrors;
}

/**
 * Extracts a user-friendly error message from an API error response
 */
export function getErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  const axiosError = error as AxiosError<ApiError>;
  
  if (axiosError.response?.data) {
    const { message, errors } = axiosError.response.data;
    
    if (errors && typeof errors === 'object') {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && errors[firstErrorKey]?.[0]) {
        return errors[firstErrorKey][0];
      }
    }
    
    if (message) {
      return message;
    }
  }
  
  if (axiosError.message) {
    const status = axiosError.response?.status;
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'You are not authenticated. Please log in.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation failed. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return axiosError.message;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Extracts all validation errors as an object
 */
export function getValidationErrors(error: unknown): ValidationErrors | null {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError.response?.data?.errors || null;
}
