/* ============================================================
   ALGOFORGE — auth logic (signup / login / Google Sign-In)
   ============================================================ */

function notifyOwnerOfSignup(user) {
  // Always log locally so the admin activity log on the dashboard works
  // even with zero configuration.
  logActivity({
    type: "signup",
    email: user.email,
    name: user.name,
    provider: user.provider,
    notifyTo: window.APP_CONFIG.NOTIFY_EMAIL
  });

  // Optionally ALSO send a real email via EmailJS if the site owner has
  // configured it in js/config.js. Silently no-ops otherwise.
  if (window.APP_CONFIG.EMAILJS_ENABLED && window.emailjs) {
    emailjs.send(window.APP_CONFIG.EMAILJS_SERVICE_ID, window.APP_CONFIG.EMAILJS_TEMPLATE_ID, {
      to_email: window.APP_CONFIG.NOTIFY_EMAIL,
      user_name: user.name,
      user_email: user.email,
      provider: user.provider,
      event: "New AlgoForge signup"
    }, window.APP_CONFIG.EMAILJS_PUBLIC_KEY).catch(err => {
      console.warn("EmailJS notification failed (non-blocking):", err);
    });
  }
}

function doSignup({ name, email, password }) {
  const users = getUsers();
  const key = email.trim().toLowerCase();
  if (users[key]) return { ok: false, error: "An account with this email already exists. Try logging in." };
  users[key] = {
    name: name.trim(),
    email: key,
    passwordHash: simpleHash(password),
    provider: "email",
    createdAt: new Date().toISOString()
  };
  saveUsers(users);
  setSession(key, users[key].name, "email");
  notifyOwnerOfSignup(users[key]);
  return { ok: true };
}

function doLogin({ email, password }) {
  const users = getUsers();
  const key = email.trim().toLowerCase();
  const user = users[key];
  if (!user) return { ok: false, error: "No account found with that email. Try signing up instead." };
  if (user.passwordHash !== simpleHash(password)) return { ok: false, error: "Incorrect password." };
  setSession(key, user.name, user.provider);
  logActivity({ type: "login", email: key, name: user.name, provider: user.provider });
  return { ok: true };
}

function doGoogleSignIn(profile) {
  // profile: { email, name }
  const users = getUsers();
  const key = profile.email.trim().toLowerCase();
  if (!users[key]) {
    users[key] = {
      name: profile.name,
      email: key,
      passwordHash: null,
      provider: "google",
      createdAt: new Date().toISOString()
    };
    saveUsers(users);
    notifyOwnerOfSignup(users[key]);
  } else {
    logActivity({ type: "login", email: key, name: users[key].name, provider: "google" });
  }
  setSession(key, users[key].name, "google");
  return { ok: true };
}

/* ---------- Google Identity Services wiring ---------- */
function initGoogleSignIn(onSuccess) {
  const clientId = window.APP_CONFIG.GOOGLE_CLIENT_ID;
  const btnMount = $("#googleBtnMount");
  const fallbackBtn = $("#googleFallbackBtn");

  if (!clientId) {
    // No client ID configured yet -- show a clearly-labeled demo button
    // instead of a broken real one. See README.md to enable the real flow.
    if (fallbackBtn) fallbackBtn.style.display = "flex";
    return;
  }

  if (!window.google || !window.google.accounts) {
    if (fallbackBtn) fallbackBtn.style.display = "flex";
    return;
  }

  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      try {
        const payload = JSON.parse(atob(response.credential.split(".")[1]));
        onSuccess({ email: payload.email, name: payload.name || payload.email.split("@")[0] });
      } catch (e) {
        showToast("Google Sign-In failed to parse response.");
      }
    }
  });
  if (btnMount) {
    google.accounts.id.renderButton(btnMount, { theme: "filled_black", size: "large", width: 360 });
  }
}
