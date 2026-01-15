## 📚 Documentation
- **[Deployment Guide](HOW_TO_DEPLOY.md):** Step-by-step instructions to deploy to Google Cloud/Firebase.
- **Backend Logic:** See `code.gs`.

## Project Structure (Updated)

```
taxprep_landing/
├── public/                 # Static assets (images, videos)
├── components/            # Reusable components
│   ├── interview/        # Tax Interview Wizard components
│   ├── ui/               # shadcn/ui components
├── pages/                # Page components (Home, Interview, Guides)
├── lib/                  # Utilities
│   ├── formSubmission.js # Google Sheets integration frontend
│   └── utils.js          # Helper functions
├── App.jsx               # Main app component
├── main.jsx              # App entry point
└── index.css             # Global styles
```
=======
## Google Integrations Setup

This application integrates with Google Calendar and Gmail for appointment booking. Follow these steps to set up the integrations:

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Calendar API
   - Gmail API
4. Create credentials (OAuth 2.0 Client ID)
5. Add authorized redirect URIs (your domain)
6. Note down your Client ID and API Key

### 2. Update Configuration

Update the following files with your Google credentials:

**lib/googleIntegrations.js:**
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE';
```

**index.html:**
```html
<meta name="google-signin-client_id" content="YOUR_GOOGLE_CLIENT_ID_HERE">
```

### 3. Google Apps Script Deployment

> **See [HOW_TO_DEPLOY.md](HOW_TO_DEPLOY.md) for the complete novice guide.**

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Copy the code from `code.gs` (in the root folder)
4. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Select type "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
5. Copy the deployment URL

### 3a. CORS + API key settings

Update these values in `code.gs` before deploying:
```javascript
const CORS_ALLOW_ORIGIN = 'https://taxfloridapro.com';
const API_KEY = 'TP_SECURE_2026_FL';
```

Set the client-side key in your environment:
```bash
VITE_TP_API_KEY=TP_SECURE_2026_FL
```

### 4. Update Form Submission URL

Update `lib/formSubmission.js` with your Apps Script URL:
```javascript
const WEB_APP_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
```

## Neon DB Schema Sync (optional)

Run the schema sync script to keep Neon tables aligned with your form fields:
```bash
npm run db:sync
```

Required env var:
```bash
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
```

### 5. Permissions

The application backend handles email sending via `MailApp`. No complex OAuth setup is required for the basic version as it runs as the script owner.

## Project Structure

```
taxprep_landing/
├── public/                 # Static assets
│   ├── faq.json           # FAQ data
│   └── tax-preparation-person-worried-pexels.mp4
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── ChatBubble.jsx    # FAQ chat widget
│   └── VideoPopup.jsx    # Video modal
├── pages/                # Page components
├── lib/                  # Utilities
│   ├── formSubmission.js # Google Sheets integration
│   ├── googleIntegrations.js # Calendar/Gmail integration
│   └── utils.js          # Helper functions
├── sms_sheets/           # Google Apps Script files
│   └── google-apps-script.js
├── App.jsx               # Main app component
├── main.jsx              # App entry point
└── index.css             # Global styles
```
