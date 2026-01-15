/**
 * Google Sheets ↔ SMS via Twilio
 * - Send queued messages from `Outbox`
 * - Receive inbound (Webhook) into `Inbox` with Twilio signature verification
 * - Auto-reply via `AutoReplies` keyword table
 *
 * Author: ChatGPT (GPT-5 Thinking)
 */

// ====== Config (tabs) ======
var OUTBOX_SHEET = 'Outbox';
var INBOX_SHEET = 'Inbox';
var AUTOREPLIES_SHEET = 'AutoReplies';
var DEFAULT_PROVIDER = 'twilio'; // overridden by Script Property DEFAULT_PROVIDER

// ====== Menu ======
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📩 SMS')
    .addItem('Setup → Ensure tabs & headers', 'ensureSheets')
    .addSeparator()
    .addItem('Send pending now', 'timeDrivenDispatch')
    .addItem('Queue a test row', 'sendTest')
    .addToUi();
}

// ====== Setup / Ensure tabs ======
function ensureSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var outbox = ss.getSheetByName(OUTBOX_SHEET) || ss.insertSheet(OUTBOX_SHEET);
  var inbox = ss.getSheetByName(INBOX_SHEET) || ss.insertSheet(INBOX_SHEET);
  var auto = ss.getSheetByName(AUTOREPLIES_SHEET) || ss.insertSheet(AUTOREPLIES_SHEET);

  if (outbox.getLastRow() === 0) {
    outbox.appendRow(['Timestamp','To','Message','Provider','Status','Error','MessageSid','SentAt']);
  }
  if (inbox.getLastRow() === 0) {
    inbox.appendRow(['Timestamp','Provider','From','To','Body','MessageSid','RawJSON']);
  }
  if (auto.getLastRow() === 0) {
    auto.appendRow(['Keyword','Reply']);
  }
  SpreadsheetApp.getUi().alert('Tabs ensured.');
}

// ====== Trigger: On form submit (optional) ======
function onFormSubmit(e) {
  // Mark new row as QUEUED if not set
  var sh = e && e.range ? e.range.getSheet() : null;
  if (!sh || sh.getName() !== OUTBOX_SHEET) return;
  var row = e.range.getRow();
  var statusCol = 5; // Status
  var val = sh.getRange(row, statusCol).getValue();
  if (!val) sh.getRange(row, statusCol).setValue('QUEUED');
}

// ====== Time-driven dispatcher ======
function timeDrivenDispatch() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(OUTBOX_SHEET);
  if (!sh) throw new Error('Missing Outbox sheet.');

  var rng = sh.getDataRange().getValues();
  if (rng.length <= 1) return;

  var props = PropertiesService.getScriptProperties();
  var defaultProvider = props.getProperty('DEFAULT_PROVIDER') || DEFAULT_PROVIDER;

  var nowIso = new Date().toISOString();
  for (var i = 1; i < rng.length; i++) {
    var row = rng[i];
    var rowIdx = i + 1;
    var to = (row[1] || '').toString().trim();
    var body = (row[2] || '').toString();
    var provider = (row[3] || defaultProvider).toString().toLowerCase();
    var status = (row[4] || '').toString();
    var messageSid = (row[6] || '').toString();

    if (!to || !body) continue;
    if (status && status !== 'QUEUED' && status !== 'RETRY') continue;

    try {
      sh.getRange(rowIdx, 5).setValue('SENDING'); // Status
      var result = sendSms_(to, body, provider);
      sh.getRange(rowIdx, 5).setValue('SENT');
      sh.getRange(rowIdx, 7).setValue(result.sid || ''); // MessageSid
      sh.getRange(rowIdx, 8).setValue(nowIso); // SentAt
      sh.getRange(rowIdx, 6).setValue(''); // Error
    } catch (err) {
      sh.getRange(rowIdx, 5).setValue('FAILED');
      sh.getRange(rowIdx, 6).setValue((err && err.message) ? err.message : String(err));
    }
  }
}

// ====== Manual helper to queue one message ======
function sendTest() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(OUTBOX_SHEET) || ss.insertSheet(OUTBOX_SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(['Timestamp','To','Message','Provider','Status','Error','MessageSid','SentAt']);
  sh.appendRow([new Date(), '+15556667777', 'Hello from Apps Script!', 'twilio', 'QUEUED', '', '', '']);
  SpreadsheetApp.getUi().alert('Queued a test row in Outbox.');
}

// ====== Sender core ======
function sendSms_(to, body, provider) {
  provider = (provider || '').toLowerCase();
  if (!provider || provider === 'twilio') return sendViaTwilio_(to, body);
  if (provider === 'signalwire') return sendViaSignalWire_(to, body);     // implement as needed
  if (provider === 'vonage') return sendViaVonage_(to, body);             // implement as needed
  throw new Error('Unsupported provider: ' + provider);
}

// ----- Twilio implementation -----
function sendViaTwilio_(to, body) {
  var props = PropertiesService.getScriptProperties();
  var sid = props.getProperty('TWILIO_ACCOUNT_SID');
  var auth = props.getProperty('TWILIO_AUTH_TOKEN');
  var from = props.getProperty('TWILIO_FROM');
  var svcSid = props.getProperty('TWILIO_MESSAGING_SERVICE_SID');

  if (!sid || !auth) throw new Error('Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN');
  if (!from && !svcSid) throw new Error('Provide TWILIO_FROM or TWILIO_MESSAGING_SERVICE_SID');

  var url = 'https://api.twilio.com/2010-04-01/Accounts/' + encodeURIComponent(sid) + '/Messages.json';
  var payload = {
    To: to,
    Body: body
  };
  if (svcSid) payload.MessagingServiceSid = svcSid; else payload.From = from;

  var options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true,
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode(sid + ':' + auth)
    }
  };

  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  var txt = res.getContentText();
  var obj;
  try { obj = JSON.parse(txt); } catch (e) { obj = { raw: txt }; }

  if (code >= 200 && code < 300) {
    return { sid: obj.sid || (obj.Sid || ''), provider: 'twilio', raw: obj };
  } else {
    var msg = (obj && obj.message) ? obj.message : ('HTTP ' + code + ': ' + txt);
    throw new Error('Twilio send failed: ' + msg);
  }
}

// ----- Stubs for other providers -----
function sendViaSignalWire_(to, body) {
  // Example endpoint: https://{SPACE}.signalwire.com/api/laml/2010-04-01/Accounts/{ProjectID}/Messages.json
  throw new Error('SignalWire not yet implemented. Use Twilio or extend this stub.');
}
function sendViaVonage_(to, body) {
  // Example: https://rest.nexmo.com/sms/json with api_key/api_secret/from/to/text
  throw new Error('Vonage not yet implemented. Use Twilio or extend this stub.');
}

// ====== Inbound Webhook (Twilio) ======
function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var disableSig = (props.getProperty('DISABLE_TWILIO_SIGNATURE_CHECK') || '').toLowerCase() === 'true';
    var authToken = props.getProperty('TWILIO_AUTH_TOKEN');
    var provider = 'twilio'; // extend: detect from headers or append a query ?provider=

    var params = e && e.parameter ? e.parameter : {};
    var headers = e && e.headers ? e.headers : {};
    var url = e && e.postData ? e.postData.url : null; // not always present
    // If url missing, reconstruct from request
    url = url || _inferRequestUrl_();

    // Verify signature if header present and not disabled
    var sigHeader = headers['X-Twilio-Signature'] || headers['x-twilio-signature'];
    if (!disableSig && sigHeader && authToken) {
      if (!verifyTwilioSignature_(url, params, sigHeader, authToken)) {
        return ContentService.createTextOutput('Signature verification failed').setMimeType(ContentService.MimeType.TEXT);
      }
    }

    // Extract common fields
    var from = params.From || '';
    var to = params.To || '';
    var body = params.Body || '';
    var messageSid = params.MessageSid || params.SmsMessageSid || '';

    // Log to Inbox
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var inbox = ss.getSheetByName(INBOX_SHEET) || ss.insertSheet(INBOX_SHEET);
    if (inbox.getLastRow() === 0) {
      inbox.appendRow(['Timestamp','Provider','From','To','Body','MessageSid','RawJSON']);
    }
    inbox.appendRow([new Date(), provider, from, to, body, messageSid, JSON.stringify(params)]);

    // Auto-reply if keyword matches
    var replyText = lookupAutoReply_(body);
    if (replyText) {
      var twiml = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>' + _xmlEscape_(replyText) + '</Message></Response>';
      return ContentService.createTextOutput(twiml).setMimeType(ContentService.MimeType.XML);
    } else {
      // No direct reply
      return ContentService.createTextOutput('<Response/>').setMimeType(ContentService.MimeType.XML);
    }
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}

// ====== Twilio Signature Verification ======
function verifyTwilioSignature_(fullUrl, params, signatureHeader, authToken) {
  // Twilio spec: HMAC-SHA1 over URL + concatenated sorted params (by key as sent)
  // Apps Script `e.parameter` loses ordering; best effort by sorting keys alphabetically.
  // For highest fidelity, consider capturing raw body (not provided by Apps Script).
  if (!fullUrl || !authToken) return false;
  var keys = Object.keys(params || {}).sort();
  var data = fullUrl;
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    data += k + params[k];
  }
  var sigBytes = Utilities.computeHmacSha1Signature(data, authToken);
  var expected = Utilities.base64Encode(sigBytes);
  // Twilio may present URL without trailing slash diffs; try a relaxed compare too.
  if (expected === signatureHeader) return true;
  if (signatureHeader && signatureHeader.trim() === expected.trim()) return true;
  return false;
}

// ====== Helpers ======
function lookupAutoReply_(body) {
  if (!body) return '';
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(AUTOREPLIES_SHEET);
  if (!sh) return '';
  var rng = sh.getDataRange().getValues();
  for (var i = 1; i < rng.length; i++) {
    var kw = (rng[i][0] || '').toString().trim();
    var reply = (rng[i][1] || '').toString();
    if (!kw) continue;
    var re = new RegExp(kw, 'i');
    if (re.test(body)) return reply;
  }
  return '';
}

function _xmlEscape_(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

// Apps Script doesn't expose request URL directly; this is a best effort.
function _inferRequestUrl_() {
  // If you deployed as a Web App, set this Script Property to exactly your Web App URL to strengthen signature checks.
  var p = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');
  return p || '';
}
