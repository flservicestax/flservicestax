// Google APIs Integration for Calendar and Gmail
// This file handles creating calendar events and sending confirmation emails

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // Replace with your actual client ID
const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY_HERE'; // Replace with your actual API key
const CALENDAR_ID = 'primary'; // Use 'primary' for the user's primary calendar

// Load Google API script
export const loadGoogleAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Initialize Google API client
export const initGoogleAPI = async () => {
  await loadGoogleAPI();

  await window.gapi.client.init({
    apiKey: GOOGLE_API_KEY,
    clientId: GOOGLE_CLIENT_ID,
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      'https://gmail.googleapis.com/$discovery/rest?version=v1'
    ],
    scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/gmail.send'
  });
};

// Authenticate user
export const authenticateUser = async () => {
  const authInstance = window.gapi.auth2.getAuthInstance();

  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn();
  }

  return authInstance.currentUser.get().getAuthResponse().access_token;
};

// Create calendar event
export const createCalendarEvent = async (eventData) => {
  try {
    const response = await window.gapi.client.calendar.events.insert({
      calendarId: CALENDAR_ID,
      resource: {
        summary: `Tax Strategy Session - ${eventData.name}`,
        description: `Tax consultation appointment for ${eventData.name}\nEmail: ${eventData.email}\nPhone: ${eventData.phone}\n\nMessage: ${eventData.message || 'No additional message'}`,
        start: {
          dateTime: `${eventData.preferredDate}T${eventData.preferredTime}:00`,
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: getEndTime(eventData.preferredDate, eventData.preferredTime),
          timeZone: 'America/New_York'
        },
        attendees: [
          {
            email: eventData.email,
            displayName: eventData.name
          }
        ],
        reminders: {
          useDefault: true
        },
        location: 'Virtual Meeting (Details to be provided)',
        status: 'confirmed'
      }
    });

    return response.result;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
};

// Calculate end time (30 minutes after start)
const getEndTime = (date, startTime) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // Add 30 minutes

  const endHours = endDateTime.getHours().toString().padStart(2, '0');
  const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');

  return `${date}T${endHours}:${endMinutes}:00`;
};

// Send confirmation email via Gmail API
export const sendConfirmationEmail = async (eventData, calendarEvent) => {
  try {
    const emailContent = createEmailContent(eventData, calendarEvent);

    const response = await window.gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: btoa(emailContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }
    });

    return response.result;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};

// Create email content
const createEmailContent = (eventData, calendarEvent) => {
  const startDateTime = new Date(calendarEvent.start.dateTime);
  const endDateTime = new Date(calendarEvent.end.dateTime);

  const formattedDate = startDateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedTime = startDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const emailBody = `
Subject: Your Tax Strategy Session is Confirmed!

Dear ${eventData.name},

Thank you for scheduling your free tax strategy session with Florida Tax Professionals!

Your appointment details:
- Date: ${formattedDate}
- Time: ${formattedTime}
- Duration: 30 minutes
- Location: Virtual meeting (connection details will be provided 24 hours before the session)

What to expect:
1. A review of your current tax situation
2. Identification of potential deductions and credits
3. A personalized tax strategy tailored to your needs
4. Clear next steps and answers to your questions

If you need to reschedule or have any questions, please contact us at:
- Phone: (321) 234-6027
- Email: flservicestax@gmail.com

We look forward to helping you optimize your tax situation!

Best regards,
Florida Tax Professional Team
(321) 234-6027
flservicestax@gmail.com
  `.trim();

  // Create MIME email
  const mimeEmail = [
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${eventData.email}`,
    'From: flservicestax@gmail.com',
    `Subject: Your Tax Strategy Session is Confirmed!`,
    '',
    emailBody
  ].join('\r\n');

  return mimeEmail;
};

// Main function to handle appointment booking with Google integrations
export const bookAppointmentWithGoogle = async (formData) => {
  try {
    // Initialize Google API if not already done
    if (!window.gapi || !window.gapi.client) {
      await initGoogleAPI();
    }

    // Authenticate user (this will prompt for Google sign-in if needed)
    await authenticateUser();

    // Create calendar event
    const calendarEvent = await createCalendarEvent(formData);

    // Send confirmation email
    const emailResult = await sendConfirmationEmail(formData, calendarEvent);

    return {
      success: true,
      calendarEvent,
      emailResult,
      message: 'Appointment booked successfully! Check your email for confirmation.'
    };

  } catch (error) {
    console.error('Error in appointment booking:', error);
    throw error;
  }
};

// Check if Google API is loaded and authenticated
export const isGoogleAuthenticated = () => {
  if (!window.gapi || !window.gapi.auth2) {
    return false;
  }

  const authInstance = window.gapi.auth2.getAuthInstance();
  return authInstance && authInstance.isSignedIn.get();
};

// Sign out from Google
export const signOutGoogle = () => {
  if (window.gapi && window.gapi.auth2) {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signOut();
    }
  }
};
