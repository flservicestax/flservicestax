# Google Sheets ↔ SMS (Apps Script) — Send & Receive (Twilio-ready)

This project gives you a **production-grade** Google Apps Script that:
- **Sends SMS** from a Google Sheet (`Outbox` tab) via **Twilio** (ready to adapt to SignalWire/Vonage).
- **Receives SMS** via a **Webhook** (`doPost`) and logs to the `Inbox` tab.
- Adds a custom **menu**, safe **retry**, **idempotency** (by Message SID), and **Twilio signature verification**.
- Stores secrets in **Script Properties** (never hardcode credentials).

> Works with Sheets whether rows come from manual entry or **Google Forms** (`On form submit` trigger).

---

## 1) Sheet structure

Create/open a Sheet and ensure these tabs exist (the script can auto-create with the menu → Setup → **Ensure tabs & headers**):

### `Outbox`
| Timestamp | To | Message | Provider | Status | Error | MessageSid | SentAt |
|---|---|---|---|---|---|---|---|

- **To**: E.164 phone (e.g., `+13215550123`)
- **Message**: Text to send
- **Provider**: optional (`twilio` default)
- **Status**: `QUEUED` (new), `SENT`, `FAILED`
- **MessageSid**: set after successful send

### `Inbox`
| Timestamp | Provider | From | To | Body | MessageSid | RawJSON |
|---|---|---|---|---|---|---|

### `AutoReplies` (optional)
| Keyword | Reply |
|---|---|
- If a received SMS body **contains** `Keyword` (case-insensitive), the webhook auto-replies with `Reply`.

---

## 2) Credentials (Script Properties)

In Apps Script editor: **Project Settings → Script properties**. Add:

- `TWILIO_ACCOUNT_SID` — e.g., `ACxxxxxxxx...`
- `TWILIO_AUTH_TOKEN` — your Twilio Auth Token
- **One of:**
  - `TWILIO_FROM` — your Twilio phone (e.g., `+13215550123`), **or**
  - `TWILIO_MESSAGING_SERVICE_SID` — if you use a Messaging Service

Optionally:
- `DEFAULT_PROVIDER` → `twilio`

> Do **not** put secrets in code or in the Sheet.

---

## 3) Deploy & Triggers

1. **Paste `src/code.gs` into your Apps Script project**, and set `appsscript.json` (see below) via *Project Settings → Show "appsscript.json"*.
2. **Authorize** when prompted.
3. Menu → **Setup → Ensure tabs & headers** (creates `Outbox`, `Inbox`, `AutoReplies` if missing).
4. **Triggers** (Apps Script editor → Triggers):
   - Add **On form submit** for `onFormSubmit` (if Sheet is fed by a Google Form).
   - Add **Time-driven** (every 1 min / 5 min) for `timeDrivenDispatch` (safe background sender).
5. **Web app deployment** (for inbound SMS):
   - Deploy → **New deployment** → type **Web app**
   - **Execute as**: Me
   - **Who has access**: **Anyone**
   - Copy the **Web app URL** (HTTPS).
   - In **Twilio Console → Active Number → Messaging → A MESSAGE COMES IN**, set the webhook to the Web app URL.
   - For **Status Callbacks** (optional), also point to the same URL or create another handler.

> Apps Script web apps are HTTPS and publicly reachable; Twilio can POST to them.

---

## 4) Test sending

Add a row in `Outbox` with **To** and **Message**. In the menu: **Run → Send pending now** or wait for the time-driven trigger.

**Manual function:** from the Script editor, run `sendTest()` (edits the sheet to queue one message).

---

## 5) Test receiving

Use Twilio to text your number. You should see a new row in `Inbox`.  
If you created `AutoReplies` and a keyword matches, Twilio will send that back to the user automatically.

**cURL simulation** (Twilio-like form POST, without signature):
```bash
curl -X POST "{WEB_APP_URL}"   -H "Content-Type: application/x-www-form-urlencoded"   --data "From=%2B15556667777&To=%2B15558889999&Body=hello&MessageSid=SM123"
```

---

## 6) Security & Verification

- **Twilio Signature Verification** is enabled by default. In production, Twilio will include `X-Twilio-Signature`. The script verifies HMAC-SHA1 with your `TWILIO_AUTH_TOKEN`.
- If you need to test without signature, set Script Property `DISABLE_TWILIO_SIGNATURE_CHECK` to `true` **temporarily**.

---

## 7) Provider notes

- **Twilio** is fully implemented (Messages API).  
- **SignalWire**/**Vonage** can be added via `sendViaSignalWire_`/`sendViaVonage_` stubs.

---

## 8) `appsscript.json`

Make sure your project has these scopes:
```json
{
  "timeZone": "America/New_York",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/script.scriptapp"
  ]
}
```

---

## 9) Troubleshooting

- **403 on webhook**: Ensure Web app is deployed with **Anyone** access and you used the **latest** URL (each deployment has a new URL).
- **Signature fail**: Confirm your Web app URL exactly matches what Twilio posts to. Re-deploy if you changed the script.
- **No sends**: Check Script Properties, `Outbox` Status column, and **Executions** logs.
- **Rate limits**: Use `timeDrivenDispatch` to drip-send.

---

© 2025-10-20 — MIT License. Ship it. 🚀
