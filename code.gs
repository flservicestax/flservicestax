// REPLACE with your actual Spreadsheet ID
const SPREADSHEET_ID = '1U0L4-Y83oYbEulp6MhBSqrRWB9sENbd9As_pbX9BwJA';

// PRO TIP: Set this in Script Properties for better security in production
// Property name: FORM_API_KEY
const API_KEY = 'TP_SECURE_2026_FL'; 

// CORS allowed origin - use '*' for local development, then lock to production.
const CORS_ALLOW_ORIGIN = '*';

// Sheet header definitions (keep in sync with frontend payloads).
const SHEET_HEADERS = {
  'Savings Calculator Form': ['datestamp', 'name', 'email', 'phone', 'income', 'filingStatus', 'dependents', 'homeOwner'],
  'Free Review Form': ['datestamp', 'name', 'email', 'phone', 'taxYear', 'message'],
  'Book Session Form': ['datestamp', 'name', 'email', 'phone', 'preferredDate', 'preferredTime', 'message'],
  'Form': ['datestamp', 'name', 'email', 'phone', 'message'],
  'PDF Guide Form': ['datestamp', 'name', 'email'],
  'Self Interview Form': ['datestamp', 'name', 'email', 'phone', 'ssn', 'address', 'city', 'state', 'zip', 'filingStatus', 'wages', 'interest', 'dividends', 'iraDistributions', 'unemployment', 'dependents', 'files']
};

/**
 * Handles incoming POST requests from your web form.
 */
function doPost(e) {
  try {
    Logger.log('Received POST request');

    if (!e.postData || !e.postData.contents) {
      return createJsonResponse({ result: 'error', message: 'No data received' }, 400);
    }

    const data = JSON.parse(e.postData.contents);
    
    // SECURITY: Validate API Key
    const providedKey = data.apiKey;
    if (providedKey !== API_KEY) {
      Logger.log('SECURITY ALERT: Invalid API Key provided');
      return createJsonResponse({ result: 'error', message: 'Unauthorized access' }, 401);
    }

    // Clean up internal fields before saving
    delete data.apiKey;

    data.datestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true
    });

    // Handle File Attachments (PDF/CSV) if present
    const attachments = [];
    if (data.files && Array.isArray(data.files)) {
      data.files.forEach(file => {
        if (file.name && file.type && file.content) {
          const blob = Utilities.newBlob(Utilities.base64Decode(file.content), file.type, file.name);
          attachments.push(blob);
        }
      });
      // Remove files from data object so they don't try to go into the sheet columns
      delete data.files;
    }

    const sheetName = determineSheet(data);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      // Auto-create sheet if it doesn't exist (basic fallback)
      return createJsonResponse({ result: 'error', message: 'Sheet not found: ' + sheetName }, 404);
    }

    const headers = ensureSheetHeaders(sheet, data, sheetName);
    
    const rowData = headers.map(header => {
      const fieldKey = header.toString().trim();
      const value = data[fieldKey];
      return value !== undefined && value !== null ? value : '';
    });

    sheet.appendRow(rowData);
    
    return createJsonResponse({ 
      result: 'success', 
      message: 'Data saved successfully',
      timestamp: data.datestamp
    }, 200);

  } catch (error) {
    Logger.log('ERROR: ' + error.toString());
    return createJsonResponse({ result: 'error', message: 'Server error: ' + error.toString() }, 500);
  }
}

/**
 * Determines which Google Sheet tab the data belongs to.
 */
function determineSheet(data) {
  if (data.formType === 'selfInterview') return 'Self Interview Form';
  if (data.income !== undefined) return 'Savings Calculator Form';
  if (data.preferredDate !== undefined) return 'Book Session Form';
  if (data.taxYear !== undefined) return 'Free Review Form';
  if (data.message === undefined) return 'PDF Guide Form';
  return 'Form';
}

/**
 * Ensures the sheet has required headers, and appends new ones if needed.
 */
function ensureSheetHeaders(sheet, data, sheetName) {
  const defaults = SHEET_HEADERS[sheetName] || ['datestamp'];
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) {
    sheet.appendRow(defaults);
    const range = sheet.getRange(1, 1, 1, defaults.length);
    range.setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    return defaults;
  }

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => h.toString().trim());
  const keysFromData = Object.keys(data || {}).filter(k => k !== 'apiKey');
  const desired = Array.from(new Set(defaults.concat(keysFromData)));
  const missing = desired.filter(h => headers.indexOf(h) === -1);
  if (missing.length > 0) {
    const startCol = headers.length + 1;
    sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
    return headers.concat(missing);
  }
  return headers;
}

/**
 * Creates a JSON response.
 */
function createJsonResponse(payload, statusCode) {
  return ContentService.createTextOutput(JSON.stringify({
    ...payload,
    status: statusCode
  }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', CORS_ALLOW_ORIGIN)
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Handles OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', CORS_ALLOW_ORIGIN)
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Handles GET requests (for testing)
 */
function doGet(e) {
  return createJsonResponse({
    status: 200,
    result: 'success',
    message: 'Tax Prep API is active'
  });
}

/**
 * Initializes headers for sheets
 */
function setupInitialHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  for (const name in SHEET_HEADERS) {
    let sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(SHEET_HEADERS[name]);
      const range = sheet.getRange(1, 1, 1, SHEET_HEADERS[name].length);
      range.setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  }
}

