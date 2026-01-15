/**
 * Enhanced Tax Prep Form Handler + SMS Integration
 * 
 * Features:
 * - Form submissions to Google Sheets (existing)
 * - SMS notifications for new submissions via Twilio
 * - Inbound SMS webhook handling
 * - Auto-reply capabilities
 * - SMS queue management
 * 
 * @version 2.0
 * @author Enhanced with SMS capabilities
 */

// ============================================================
// CONFIGURATION
// ============================================================

// Original Config
const SPREADSHEET_ID = '1U0L4-Y83oYbEulp6MhBSqrRWB9sENbd9As_pbX9BwJA';
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

// SMS Config (Sheet Names)
const OUTBOX_SHEET = 'SMS_Outbox';
const INBOX_SHEET = 'SMS_Inbox';
const AUTOREPLIES_SHEET = 'SMS_AutoReplies';
const NOTIFICATION_CONFIG_SHEET = 'SMS_NotificationConfig';
const DEFAULT_PROVIDER = 'twilio';

// ============================================================
// MENU & SETUP
// ============================================================

/**
 * Creates custom menu on spreadsheet open
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📱 Tax Prep + SMS')
    .addItem('🔧 Setup All Sheets', 'setupAllSheets')
    .addSeparator()
    .addItem('📤 Send Pending SMS', 'timeDrivenDispatch')
    .addItem('🧪 Queue Test SMS', 'sendTestSMS')
    .addItem('🧪 Test Form Submission', 'testFormSubmission')
    .addSeparator()
    .addItem('📋 View SMS Configuration', 'showSMSConfig')
    .addToUi();
}

/**
 * Main setup function - Creates all necessary sheets and headers
 */
function setupAllSheets() {
  try {
    setupInitialHeaders();  // Original form sheets
    ensureSMSSheets();      // SMS sheets
    
    const ui = SpreadsheetApp.getUi();
    ui.alert('✅ Success', 
      'All sheets have been set up successfully!\n\n' +
      'Form Sheets: ✓\n' +
      'SMS Sheets: ✓\n\n' +
      'Next steps:\n' +
      '1. Configure Script Properties (TWILIO_* credentials)\n' +
      '2. Add notification phone numbers to SMS_NotificationConfig\n' +
      '3. Set up time-driven trigger for SMS dispatch\n' +
      '4. Deploy as Web App for inbound SMS',
      ui.ButtonSet.OK
    );
  } catch (error) {
    Logger.log('ERROR in setupAllSheets: ' + error.toString());
    SpreadsheetApp.getUi().alert('Error', 'Setup failed: ' + error.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Creates SMS-related sheets with proper headers
 */
function ensureSMSSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // SMS Outbox
  let outbox = ss.getSheetByName(OUTBOX_SHEET);
  if (!outbox) {
    outbox = ss.insertSheet(OUTBOX_SHEET);
    outbox.appendRow(['Timestamp', 'To', 'Message', 'Provider', 'Status', 'Error', 'MessageSid', 'SentAt', 'RelatedForm', 'RelatedRowId']);
    formatHeaderRow(outbox, 10);
  }
  
  // SMS Inbox
  let inbox = ss.getSheetByName(INBOX_SHEET);
  if (!inbox) {
    inbox = ss.insertSheet(INBOX_SHEET);
    inbox.appendRow(['Timestamp', 'Provider', 'From', 'To', 'Body', 'MessageSid', 'RawJSON', 'AutoReplySent']);
    formatHeaderRow(inbox, 8);
  }
  
  // Auto Replies
  let autoReplies = ss.getSheetByName(AUTOREPLIES_SHEET);
  if (!autoReplies) {
    autoReplies = ss.insertSheet(AUTOREPLIES_SHEET);
    autoReplies.appendRow(['Keyword', 'Reply', 'Active']);
    formatHeaderRow(autoReplies, 3);
    
    // Add default auto-replies
    autoReplies.appendRow(['HOURS', 'We are open Mon-Fri 9AM-6PM EST. Visit our website for more info.', 'TRUE']);
    autoReplies.appendRow(['HELP', 'Reply with: HOURS for business hours, SERVICES for our offerings, CONTACT for our info.', 'TRUE']);
    autoReplies.appendRow(['SERVICES', 'We offer: Tax Preparation, Tax Planning, IRS Representation, and more!', 'TRUE']);
  }
  
  // Notification Config
  let config = ss.getSheetByName(NOTIFICATION_CONFIG_SHEET);
  if (!config) {
    config = ss.insertSheet(NOTIFICATION_CONFIG_SHEET);
    config.appendRow(['NotificationType', 'PhoneNumber', 'Active', 'FormTypes', 'MessageTemplate']);
    formatHeaderRow(config, 5);
    
    // Add default notification config
    config.appendRow([
      'New Form Submission',
      '+15555551234',
      'TRUE',
      'ALL',
      'New form submission: {formType} from {name} ({email}). Phone: {phone}'
    ]);
  }
  
  Logger.log('SMS sheets ensured successfully');
}

/**
 * Helper to format header rows
 */
function formatHeaderRow(sheet, numColumns) {
  const headerRange = sheet.getRange(1, 1, 1, numColumns);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setWrap(true);
  
  for (let i = 1; i <= numColumns; i++) {
    sheet.autoResizeColumn(i);
  }
}

// ============================================================
// FORM HANDLING (ENHANCED WITH SMS)
// ============================================================

/**
 * Main POST handler - processes form submissions and triggers SMS
 */
function doPost(e) {
  try {
    // Check if this is a Twilio SMS webhook
    if (e && e.parameter && e.parameter.MessageSid && e.parameter.From) {
      return handleInboundSMS(e);
    }
    
    // Otherwise, handle as form submission
    return handleFormSubmission(e);
  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    return createJsonResponse({
      result: 'error',
      message: 'Processing failed: ' + error.toString()
    }, 500);
  }
}

/**
 * Handles form submissions (original functionality + SMS notification)
 */
function handleFormSubmission(e) {
  try {
    Logger.log('Received form POST request');
    
    if (!e.postData || !e.postData.contents) {
      return createJsonResponse(
        { result: 'error', message: 'No data received.' },
        400
      );
    }

    const data = JSON.parse(e.postData.contents);
    
    // Add timestamp
    data.datestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const sheetName = determineSheet(data);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return createJsonResponse(
        { result: 'error', message: 'Sheet not found: ' + sheetName },
        404
      );
    }

    const lastCol = sheet.getLastColumn();
    if (lastCol === 0) {
      return createJsonResponse(
        { result: 'error', message: 'Sheet headers not initialized.' },
        500
      );
    }

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const rowData = headers.map(header => {
      const fieldKey = header.toString().trim();
      const value = data[fieldKey];
      return value !== undefined && value !== null ? value : '';
    });

    sheet.appendRow(rowData);
    const newRowId = sheet.getLastRow();
    
    Logger.log('SUCCESS: Data appended to ' + sheetName + ', row ' + newRowId);

    // Queue SMS notifications
    queueFormNotificationSMS(sheetName, data, newRowId);

    return createJsonResponse({
      result: 'success',
      message: 'Data saved successfully',
      form: sheetName,
      timestamp: data.datestamp,
      rowId: newRowId
    }, 200);

  } catch (error) {
    Logger.log('ERROR in handleFormSubmission: ' + error.toString());
    return createJsonResponse({
      result: 'error',
      message: 'Processing failed: ' + error.toString()
    }, 500);
  }
}

// ============================================================
// SMS NOTIFICATION SYSTEM
// ============================================================

/**
 * Queues SMS notifications for new form submissions
 */
function queueFormNotificationSMS(formType, formData, rowId) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const configSheet = ss.getSheetByName(NOTIFICATION_CONFIG_SHEET);
    
    if (!configSheet) {
      Logger.log('SMS notification config sheet not found');
      return;
    }

    const configData = configSheet.getDataRange().getValues();
    const outboxSheet = ss.getSheetByName(OUTBOX_SHEET);
    
    if (!outboxSheet) {
      Logger.log('SMS outbox sheet not found');
      return;
    }

    // Process each notification config
    for (let i = 1; i < configData.length; i++) {
      const row = configData[i];
      const notificationType = row[0];
      const phoneNumber = row[1];
      const isActive = row[2];
      const formTypes = row[3];
      const messageTemplate = row[4];

      // Check if notification is active
      if (isActive !== 'TRUE' && isActive !== true) continue;

      // Check if this form type should trigger notification
      if (formTypes !== 'ALL' && !formTypes.includes(formType)) continue;

      // Generate message from template
      const message = generateMessageFromTemplate(messageTemplate, formType, formData);

      // Queue the SMS
      outboxSheet.appendRow([
        new Date(),
        phoneNumber,
        message,
        DEFAULT_PROVIDER,
        'QUEUED',
        '',
        '',
        '',
        formType,
        rowId
      ]);

      Logger.log('Queued SMS notification to ' + phoneNumber + ' for ' + formType);
    }
  } catch (error) {
    Logger.log('ERROR in queueFormNotificationSMS: ' + error.toString());
    // Don't throw - we don't want SMS failures to break form submission
  }
}

/**
 * Generates SMS message from template
 */
function generateMessageFromTemplate(template, formType, data) {
  let message = template;
  
  // Replace placeholders
  message = message.replace('{formType}', formType);
  message = message.replace('{name}', data.name || 'N/A');
  message = message.replace('{email}', data.email || 'N/A');
  message = message.replace('{phone}', data.phone || 'N/A');
  message = message.replace('{message}', data.message || 'N/A');
  
  // Add form-specific data
  if (data.income) message = message.replace('{income}', data.income);
  if (data.taxYear) message = message.replace('{taxYear}', data.taxYear);
  if (data.preferredDate) message = message.replace('{preferredDate}', data.preferredDate);
  if (data.preferredTime) message = message.replace('{preferredTime}', data.preferredTime);
  
  return message;
}

// ============================================================
// SMS SENDING (FROM OUTBOX)
// ============================================================

/**
 * Time-driven dispatcher - sends queued SMS messages
 * Set up as a trigger in Apps Script (every 1-5 minutes)
 */
function timeDrivenDispatch() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const outbox = ss.getSheetByName(OUTBOX_SHEET);
    
    if (!outbox) {
      Logger.log('Outbox sheet not found');
      return;
    }

    const data = outbox.getDataRange().getValues();
    if (data.length <= 1) {
      Logger.log('No messages to send');
      return;
    }

    const props = PropertiesService.getScriptProperties();
    const defaultProvider = props.getProperty('DEFAULT_PROVIDER') || DEFAULT_PROVIDER;
    const nowIso = new Date().toISOString();
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowIdx = i + 1;
      const to = (row[1] || '').toString().trim();
      const body = (row[2] || '').toString();
      const provider = (row[3] || defaultProvider).toString().toLowerCase();
      const status = (row[4] || '').toString();

      if (!to || !body) continue;
      if (status && status !== 'QUEUED' && status !== 'RETRY') continue;

      try {
        outbox.getRange(rowIdx, 5).setValue('SENDING');
        SpreadsheetApp.flush();
        
        const result = sendSms_(to, body, provider);
        
        outbox.getRange(rowIdx, 5).setValue('SENT');
        outbox.getRange(rowIdx, 7).setValue(result.sid || '');
        outbox.getRange(rowIdx, 8).setValue(nowIso);
        outbox.getRange(rowIdx, 6).setValue('');
        
        sentCount++;
        Logger.log('SMS sent successfully to ' + to);
      } catch (err) {
        outbox.getRange(rowIdx, 5).setValue('FAILED');
        outbox.getRange(rowIdx, 6).setValue((err && err.message) ? err.message : String(err));
        failedCount++;
        Logger.log('SMS failed to ' + to + ': ' + err.message);
      }
      
      SpreadsheetApp.flush();
    }

    Logger.log('SMS dispatch complete. Sent: ' + sentCount + ', Failed: ' + failedCount);
  } catch (error) {
    Logger.log('ERROR in timeDrivenDispatch: ' + error.toString());
  }
}

/**
 * Core SMS sending function
 */
function sendSms_(to, body, provider) {
  provider = (provider || '').toLowerCase();
  
  if (!provider || provider === 'twilio') {
    return sendViaTwilio_(to, body);
  }
  
  throw new Error('Unsupported provider: ' + provider);
}

/**
 * Twilio SMS implementation
 */
function sendViaTwilio_(to, body) {
  const props = PropertiesService.getScriptProperties();
  const sid = props.getProperty('TWILIO_ACCOUNT_SID');
  const auth = props.getProperty('TWILIO_AUTH_TOKEN');
  const from = props.getProperty('TWILIO_FROM');
  const svcSid = props.getProperty('TWILIO_MESSAGING_SERVICE_SID');

  if (!sid || !auth) {
    throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in Script Properties');
  }
  
  if (!from && !svcSid) {
    throw new Error('Provide TWILIO_FROM or TWILIO_MESSAGING_SERVICE_SID in Script Properties');
  }

  const url = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(sid) + '/Messages.json';
  const payload = {
    To: to,
    Body: body
  };
  
  if (svcSid) {
    payload.MessagingServiceSid = svcSid;
  } else {
    payload.From = from;
  }

  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true,
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(sid + ':' + auth)
    }
  };

  const res = UrlFetchApp.fetch(url, options);
  const code = res.getResponseCode();
  const txt = res.getContentText();
  let obj;
  
  try {
    obj = JSON.parse(txt);
  } catch (e) {
    obj = { raw: txt };
  }

  if (code >= 200 && code < 300) {
    return {
      sid: obj.sid || obj.Sid || '',
      provider: 'twilio',
      raw: obj
    };
  } else {
    const msg = (obj && obj.message) ? obj.message : ('HTTP ' + code + ': ' + txt);
    throw new Error('Twilio send failed: ' + msg);
  }
}

// ============================================================
// INBOUND SMS HANDLING
// ============================================================

/**
 * Handles inbound SMS from Twilio webhook
 */
function handleInboundSMS(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const disableSig = (props.getProperty('DISABLE_TWILIO_SIGNATURE_CHECK') || '').toLowerCase() === 'true';
    const authToken = props.getProperty('TWILIO_AUTH_TOKEN');

    const params = e && e.parameter ? e.parameter : {};
    const headers = e && e.headers ? e.headers : {};
    
    // Verify Twilio signature if enabled
    const sigHeader = headers['X-Twilio-Signature'] || headers['x-twilio-signature'];
    if (!disableSig && sigHeader && authToken) {
      const url = _inferRequestUrl_();
      if (!verifyTwilioSignature_(url, params, sigHeader, authToken)) {
        Logger.log('Twilio signature verification failed');
        return ContentService.createTextOutput('Signature verification failed')
          .setMimeType(ContentService.MimeType.TEXT);
      }
    }

    // Extract SMS data
    const from = params.From || '';
    const to = params.To || '';
    const body = params.Body || '';
    const messageSid = params.MessageSid || params.SmsMessageSid || '';

    Logger.log('Received SMS from ' + from + ': ' + body);

    // Log to Inbox
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const inbox = ss.getSheetByName(INBOX_SHEET);
    
    if (!inbox) {
      Logger.log('Inbox sheet not found');
      return ContentService.createTextOutput('<Response/>')
        .setMimeType(ContentService.MimeType.XML);
    }

    const autoReply = lookupAutoReply_(body);
    
    inbox.appendRow([
      new Date(),
      'twilio',
      from,
      to,
      body,
      messageSid,
      JSON.stringify(params),
      autoReply ? 'YES' : 'NO'
    ]);

    // Send auto-reply if match found
    if (autoReply) {
      Logger.log('Sending auto-reply: ' + autoReply);
      const twiml = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<Response><Message>' + _xmlEscape_(autoReply) + '</Message></Response>';
      return ContentService.createTextOutput(twiml)
        .setMimeType(ContentService.MimeType.XML);
    }

    // No auto-reply
    return ContentService.createTextOutput('<Response/>')
      .setMimeType(ContentService.MimeType.XML);

  } catch (err) {
    Logger.log('ERROR in handleInboundSMS: ' + err.toString());
    return ContentService.createTextOutput('Error: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Looks up auto-reply based on keywords
 */
function lookupAutoReply_(body) {
  if (!body) return '';
  
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(AUTOREPLIES_SHEET);
  
  if (!sheet) return '';
  
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    const keyword = (data[i][0] || '').toString().trim();
    const reply = (data[i][1] || '').toString();
    const active = data[i][2];
    
    if (!keyword || (active !== 'TRUE' && active !== true)) continue;
    
    const regex = new RegExp(keyword, 'i');
    if (regex.test(body)) {
      return reply;
    }
  }
  
  return '';
}

/**
 * Verifies Twilio request signature
 */
function verifyTwilioSignature_(fullUrl, params, signatureHeader, authToken) {
  if (!fullUrl || !authToken) return false;
  
  const keys = Object.keys(params || {}).sort();
  let data = fullUrl;
  
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    data += k + params[k];
  }
  
  const sigBytes = Utilities.computeHmacSha1Signature(data, authToken);
  const expected = Utilities.base64Encode(sigBytes);
  
  return expected === signatureHeader || expected.trim() === signatureHeader.trim();
}

function _inferRequestUrl_() {
  const p = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');
  return p || '';
}

function _xmlEscape_(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ============================================================
// ORIGINAL FUNCTIONS (PRESERVED)
// ============================================================

function determineSheet(data) {
  Logger.log('Determining sheet for data: ' + JSON.stringify(Object.keys(data)));

  if (data.income !== undefined && data.dependents !== undefined) {
    return 'Savings Calculator Form';
  }

  if (data.preferredDate !== undefined && data.preferredTime !== undefined) {
    return 'Book Session Form';
  }

  if (data.taxYear !== undefined) {
    return 'Free Review Form';
  }

  if (data.email !== undefined &&
    data.message === undefined &&
    data.taxYear === undefined &&
    data.income === undefined &&
    data.preferredDate === undefined) {
    return 'PDF Guide Form';
  }

  return 'Form';
}

function createJsonResponse(payload, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  return createJsonResponse({
    status: 'ready',
    message: 'Tax Prep Form Handler + SMS is running',
    timestamp: new Date().toLocaleString(),
    spreadsheetId: SPREADSHEET_ID,
    smsEnabled: true
  }, 200);
}

function setupInitialHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  const sheetsConfig = {
    'Savings Calculator Form': [
      'datestamp', 'name', 'email', 'phone',
      'income', 'filingStatus', 'dependents', 'homeOwner'
    ],
    'Free Review Form': [
      'datestamp', 'name', 'email', 'phone', 'taxYear', 'message'
    ],
    'Book Session Form': [
      'datestamp', 'name', 'email', 'phone',
      'preferredDate', 'preferredTime', 'message'
    ],
    'Form': [
      'datestamp', 'name', 'email', 'phone', 'message'
    ],
    'PDF Guide Form': [
      'datestamp', 'name', 'email'
    ]
  };

  const results = [];

  for (const sheetName in sheetsConfig) {
    let sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      Logger.log('Created new sheet: ' + sheetName);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(sheetsConfig[sheetName]);
      Logger.log('Headers set for: ' + sheetName);
      results.push('✓ ' + sheetName + ': Headers set');
    } else {
      Logger.log('Sheet already has data: ' + sheetName);
      results.push('↷ ' + sheetName + ': Already has data');
    }

    formatHeaderRow(sheet, sheetsConfig[sheetName].length);
  }

  Logger.log('Form sheets setup complete');
  return results;
}

// ============================================================
// TESTING & UTILITY FUNCTIONS
// ============================================================

function sendTestSMS() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const outbox = ss.getSheetByName(OUTBOX_SHEET);
  
  if (!outbox) {
    SpreadsheetApp.getUi().alert('Please run Setup first');
    return;
  }
  
  const testPhone = '+15555551234'; // CHANGE THIS
  outbox.appendRow([
    new Date(),
    testPhone,
    'Test SMS from Tax Prep System! If you receive this, SMS is working.',
    'twilio',
    'QUEUED',
    '',
    '',
    '',
    'TEST',
    ''
  ]);
  
  SpreadsheetApp.getUi().alert('Test SMS queued! Run "Send Pending SMS" to send it.');
}

function testFormSubmission() {
  const testData = [
    {
      name: 'Test General Form',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        message: 'This is a test'
      }
    },
    {
      name: 'Test Book Session',
      data: {
        name: 'Alice Brown',
        email: 'alice@example.com',
        phone: '555-9012',
        preferredDate: '2025-11-01',
        preferredTime: '2:00 PM',
        message: 'Book session test'
      }
    }
  ];

  const results = [];

  testData.forEach(test => {
    try {
      const mockEvent = {
        postData: {
          contents: JSON.stringify(test.data)
        }
      };

      const response = handleFormSubmission(mockEvent);
      const result = JSON.parse(response.getContent());

      if (result.result === 'success') {
        results.push('✓ ' + test.name + ': SUCCESS');
        Logger.log('SUCCESS: ' + test.name);
      } else {
        results.push('✗ ' + test.name + ': FAILED - ' + result.message);
        Logger.log('FAILED: ' + test.name);
      }
    } catch (error) {
      results.push('✗ ' + test.name + ': ERROR - ' + error.toString());
      Logger.log('ERROR: ' + test.name + ' - ' + error.toString());
    }
  });

  Logger.log('\n=== Test Results ===');
  Logger.log(results.join('\n'));

  const ui = SpreadsheetApp.getUi();
  ui.alert('Test Results', results.join('\n'), ui.ButtonSet.OK);
}

function showSMSConfig() {
  const props = PropertiesService.getScriptProperties();
  const config = {
    'TWILIO_ACCOUNT_SID': props.getProperty('TWILIO_ACCOUNT_SID') ? '✓ Set' : '✗ Missing',
    'TWILIO_AUTH_TOKEN': props.getProperty('TWILIO_AUTH_TOKEN') ? '✓ Set' : '✗ Missing',
    'TWILIO_FROM': props.getProperty('TWILIO_FROM') || '✗ Not Set',
    'TWILIO_MESSAGING_SERVICE_SID': props.getProperty('TWILIO_MESSAGING_SERVICE_SID') || '(Optional)',
    'WEBAPP_URL': props.getProperty('WEBAPP_URL') || '✗ Not Set (Recommended)',
    'DISABLE_TWILIO_SIGNATURE_CHECK': props.getProperty('DISABLE_TWILIO_SIGNATURE_CHECK') || 'false'
  };

  let message = '📋 SMS Configuration Status:\n\n';
  for (const key in config) {
    message += key + ': ' + config[key] + '\n';
  }
  
  message += '\n⚠️ Set these in:\nExtensions → Apps Script → Project Settings → Script Properties';

  SpreadsheetApp.getUi().alert('SMS Configuration', message, SpreadsheetApp.getUi().ButtonSet.OK);
}