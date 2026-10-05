/* ============================================================
   ALGOFORGE — site configuration
   Fill these in before you host the site. See README.md for
   step-by-step instructions on getting each value.
   ============================================================ */
window.APP_CONFIG = {
  // Create an OAuth Client ID (Web application) at
  // https://console.cloud.google.com/apis/credentials
  // and paste it here to enable the real "Sign in with Google" button.
  // Until this is set, the button falls back to a clearly-labeled demo mode.
  GOOGLE_CLIENT_ID: "",

  // Every signup / login event is logged in-app either way (see the
  // Admin Activity Log on the dashboard). To ALSO get a real email sent
  // to you for every signup, create a free account at https://www.emailjs.com,
  // add an Email Service + Template, set EMAILJS_ENABLED to true below,
  // and fill in the three IDs. Full steps are in README.md.
  EMAILJS_ENABLED: false,
  EMAILJS_SERVICE_ID: "",
  EMAILJS_TEMPLATE_ID: "",
  EMAILJS_PUBLIC_KEY: "",

  // Where account activity should be addressed to (used in the email
  // template variables and in the in-app activity log).
  NOTIFY_EMAIL: "prithwinanonymous@gmail.com"
};
