// REPLACE with your actual Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby3jzkI6H4QwAYpkSnoJNwviMzLVtKyvJHq-deuQ63FSzPOYTA3NZPxyZeNB94HEFRS/exec';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const API_KEY = import.meta.env?.VITE_TP_API_KEY;

/**
 * Submits form data to Google Sheets via Google Apps Script
 * @param {Object} formData - The form data to submit
 * @param {string} formType - The type of form being submitted
 * @returns {Promise<Object>} - Response from the Google Apps Script
 */
export const submitToGoogleSheets = async (formData, formType) => {
  // Validate input
  if (!formData || typeof formData !== 'object') {
    throw new Error('Invalid form data provided');
  }

  if (!formType || typeof formType !== 'string') {
    throw new Error('Invalid form type provided');
  }

  // Map the form data to the correct format
  const mappedData = mapFormDataToWorksheet(formData, formType);

  // Attempt submission with retries
  return submitWithRetry(mappedData, 0);
};

/**
 * Submits data with automatic retry logic
 * @param {Object} data - The data to submit
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Object>} - Response from the server
 */
async function submitWithRetry(data, retryCount) {
  try {
    console.log(`Attempt ${retryCount + 1}/${MAX_RETRIES} - Submitting to Google Sheets:`, data);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        ...(API_KEY ? { apiKey: API_KEY } : {})
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Submission failed with status ${response.status}`);
    }

    const responseData = await response.json().catch(() => null);
    console.log('Form submitted successfully to Google Sheets', responseData);

    return {
      result: 'success',
      message: 'Form submitted successfully',
      data: data,
      response: responseData
    };

  } catch (error) {
    console.error(`Submission attempt ${retryCount + 1} failed:`, error);

    // Check if we should retry
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return submitWithRetry(data, retryCount + 1);
    }

    // All retries failed
    console.error('All submission attempts failed:', error);
    throw new Error('Failed to submit form after multiple attempts. Please try again later.');
  }
}

/**
 * Maps form data to the appropriate worksheet based on form type
 * Ensures field names match exactly what the Google Apps Script expects
 * @param {Object} formData - The form data
 * @param {string} formType - The form type identifier
 * @returns {Object} - Mapped data for Google Sheets
 */
export const mapFormDataToWorksheet = (formData, formType) => {
  // Clean and validate form data
  const cleanedData = {};

  for (const [key, value] of Object.entries(formData)) {
    // Convert empty strings to undefined so they're handled correctly
    cleanedData[key] = value === '' ? undefined : value;
  }

  switch (formType) {
    case 'savingsCalculator':
      return {
        name: cleanedData.name || '',
        email: cleanedData.email || '',
        phone: cleanedData.phone || '',
        income: cleanedData.income || '',
        filingStatus: cleanedData.filingStatus || '',
        dependents: cleanedData.dependents || '',
        homeOwner: cleanedData.homeOwner || ''
      };

    case 'freeReview':
      return {
        name: cleanedData.name || '',
        email: cleanedData.email || '',
        phone: cleanedData.phone || '',
        taxYear: cleanedData.taxYear || '',
        message: cleanedData.message || ''
      };

    case 'bookSession':
      return {
        name: cleanedData.name || '',
        email: cleanedData.email || '',
        phone: cleanedData.phone || '',
        preferredDate: cleanedData.preferredDate || '',
        preferredTime: cleanedData.preferredTime || '',
        message: cleanedData.message || ''
      };

    case 'pdfGuide':
      return {
        name: cleanedData.name || '',
        email: cleanedData.email || ''
      };

    case 'selfInterview':
      return {
        formType: 'selfInterview', // pass through to backend for sheet determination
        name: `${cleanedData.firstName || ''} ${cleanedData.lastName || ''}`,
        email: cleanedData.email || '', // Ensure we ask for email in StepPersonalDetails!
        phone: cleanedData.phone || '',
        ssn: cleanedData.ssn || '',
        address: cleanedData.address || '',
        city: cleanedData.city || '',
        state: cleanedData.state || '',
        zip: cleanedData.zip || '',
        filingStatus: cleanedData.filingStatus || '',
        wages: cleanedData.wages || '',
        interest: cleanedData.interest || '',
        dividends: cleanedData.dividends || '',
        iraDistributions: cleanedData.iraDistributions || '',
        unemployment: cleanedData.unemployment || '',
        dependents: JSON.stringify(cleanedData.dependents || ''),
        // Files are passed separately in the call, not mapped here broadly
        files: cleanedData.files
      };

    case 'general':
    default:
      return {
        name: cleanedData.name || '',
        email: cleanedData.email || '',
        phone: cleanedData.phone || '',
        message: cleanedData.message || ''
      };
  }
};

/**
 * Validates form data before submission
 * @param {Object} formData - The form data to validate
 * @param {string} formType - The form type
 * @returns {Object} - Validation result { valid: boolean, errors: string[] }
 */
export const validateFormData = (formData, formType) => {
  const errors = [];

  // Common required fields
  if (!formData.name || formData.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!formData.email || formData.email.trim() === '') {
    errors.push('Email is required');
  } else if (!isValidEmail(formData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Type-specific validation
  switch (formType) {
    case 'savingsCalculator':
      if (!formData.income || formData.income.trim() === '') {
        errors.push('Income is required');
      }
      if (!formData.filingStatus || formData.filingStatus.trim() === '') {
        errors.push('Filing status is required');
      }
      break;

    case 'freeReview':
      if (!formData.taxYear || formData.taxYear.trim() === '') {
        errors.push('Tax year is required');
      }
      break;

    case 'bookSession':
      if (!formData.preferredDate || formData.preferredDate.trim() === '') {
        errors.push('Preferred date is required');
      }
      if (!formData.preferredTime || formData.preferredTime.trim() === '') {
        errors.push('Preferred time is required');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Test function to verify the connection to Google Sheets
 * @returns {Promise<boolean>} - Whether the connection is working
 */
export const testConnection = async () => {
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0000',
      message: 'This is a test submission'
    };

    await submitToGoogleSheets(testData, 'general');
    console.log('Connection test passed!');
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
