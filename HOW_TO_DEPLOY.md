
# 🚀 How to Deploy Your TaxPrep Application

This guide will walk you through every step to get your application live on the internet, backed up safely, and connected to your Google Sheets database.

## ✅ Overview of what we are doing
1.  **Backend:** Setting up the Google Sheets & Apps Script to handle form submissions and emails.
2.  **Backup:** Saving your code to GitHub and Google Drive.
3.  **Deployment:** Hosting your frontend website on Google Firebase (a part of Google Cloud).

---

## Part 1: Backend Setup (Google Sheets)

This is the "Brain" of your contact forms. It receives data and sends emails.

### 1. Prepare the Google Sheet
1.  Go to [Google Sheets](https://sheets.google.com) and create a New Spreadsheet.
2.  Name it: `TaxPrep Database 2026`.
3.  **Copy the Spreadsheet ID:**
    *   Look at the URL in your browser: `https://docs.google.com/spreadsheets/d/1U0L4-Y83oYbEulp6MhBSqrRWB9sENbd9As_pbX9BwJA/edit`
    *   The ID is the long string between `/d/` and `/edit`.
    *   **Save this ID for later.**

### 2. Prepare the Script
1.  In your Spreadsheet, click **Extensions** > **Apps Script**.
2.  Delete any code currently in the `Code.gs` file.
3.  Open the file `code.gs` from your project folder on your computer.
4.  Copy **ALL** the text from your local `code.gs` and paste it into the online script editor.
5.  **Edit Line 2:** Replace `SPREADSHEET_ID` with the ID you copied in Step 1.
    ```javascript
    const SPREADSHEET_ID = 'YOUR_PASTED_ID_HERE';
    ```
6.  **Edit the CORS origin:**
    *   In `code.gs`, set your production domain:
    ```javascript
    const CORS_ALLOW_ORIGIN = 'https://taxfloridapro.com';
    ```
7.  Click the **Floppy Disk icon** (Save).

### 3. Deploy the Backend
1.  Click the blue **Deploy** button > **New deployment**.
2.  Click the **Gear icon** next to "Select type" > select **Web app**.
3.  **Description:** Enter "v1".
4.  **Execute as:** Select **Me (your_email@gmail.com)**.
5.  **Who has access:** Select **Anyone**. (Crucial: This allows your website to talk to the sheet).
6.  Click **Deploy**.
7.  **Authorize Access:**
    *   It will ask for permission. Click "Review Permissions".
    *   Choose your account.
    *   ***Security Warning:*** You might see "Google hasn't verified this app". Click **Advanced** > **Go to (Script Name) (unsafe)**. This is safe because *you* are the developer.
    *   Click **Allow**.
8.  **Copy the Web App URL**: It looks like `https://script.google.com/macros/s/.../exec`.
9.  **Update your Code:**
    *   Go back to your project code on your computer.
    *   Open `lib/formSubmission.js`.
    *   Replace `WEB_APP_URL` on line 2 with this new URL.
10. **Set the client API key (Vite env):**
    *   Create a `.env.local` file in the project root:
    ```bash
    VITE_TP_API_KEY=TP_SECURE_2026_FL
    ```

---

## Part 2: Backup Your Code

Never lose your work!

### Option A: GitHub (Professional Standard)
1.  **Create a Repository:**
    *   Go to [GitHub.com](https://github.com) and log in.
    *   Click the **+** icon > **New repository**.
    *   Name it `taxprep-landing`.
    *   Make it **Private** (recommended for unfinished business) or **Public**.
    *   Click **Create repository**.
2.  **Upload Code:**
    *   Since you are using GitHub Desktop or the command line:
    ```bash
    git init
    git add .
    git commit -m "Initial backup"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/taxprep-landing.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` with your actual GitHub username)*

### Option B: Google Drive (Simple Manual Backup)
1.  On your computer, right-click your project folder `TaxPrep_Landing`.
2.  Select **Send to** > **Compressed (zipped) folder**.
3.  Go to Google Drive.
4.  Drag and drop this new `.zip` file into your Drive.
5.  Repeat this every time you make major changes.

---

## Part 3: Deploy Frontend to Google Firebase

This hosts your actual website so people can visit it.

### 1. Install Firebase Tools
Open your terminal (Command Prompt or PowerShell) in your project folder and run:
```bash
npm install -g firebase-tools
```

### 2. Login to Google
```bash
firebase login
```
*   This will open your browser. Login with your Google account and click Allow.

### 3. Initialize Project
```bash
firebase init hosting
```
*   **Are you ready to proceed?** Type `y` and Enter.
*   **Please select an option:** Use arrow keys to select `Create a new project` (or select an existing one if you made one in Cloud Console).
*   **Project UID:** Enter a unique name, e.g., `taxprep-florida-2026`.
*   **What do you want to use as your public directory?** Type `dist` and Enter. (Important! Vite builds to `dist`).
*   **Configure as a single-page app?** Type `y` (Yes).
*   **Set up automatic builds and deploys with GitHub?** Type `n` (No, for now).
*   **File dist/index.html already exists. Overwrite?** Type `n` (No).

### 4. Build Your Site
This compiles your code into the final version for the web.
```bash
npm run build
```

### 5. Deploy!
```bash
firebase deploy
```

🎉 **Success!** The terminal will show you a **Hosting URL** (e.g., `https://taxprep-florida-2026.web.app`). Click it to see your live site!

---

## ✅ Checklist for Success

*   [ ] **Code.gs** deployed as Web App (Access: Anyone).
*   [ ] **Web App URL** pasted into `lib/formSubmission.js`.
*   [ ] **Project built** (`npm run build`).
*   [ ] **Deployed** (`firebase deploy`).
*   [ ] **Form Testing:**
    *   Go to your live site, fill out a form (e.g., the Free Review form).
    *   Check your Google Sheet. Did the row appear?
    *   Check the email `flservicestx@gmail.com`. Did you get an alert?

If everything works, you are done!
