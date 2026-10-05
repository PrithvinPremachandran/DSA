/* ============================================================
   ALGOFORGE — core app logic
   Client-side "backend" built on localStorage. See README.md
   for what this does and doesn't cover (there is no real server).
   ============================================================ */

const STORE_KEYS = {
  users: "algoforge_users",
  session: "algoforge_session",
  progressPrefix: "algoforge_progress_",
  activityLog: "algoforge_activity_log"
};

/* ---------- tiny helpers ---------- */
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return [...root.querySelectorAll(sel)]; }

function simpleHash(str) {
  // NOT cryptographic security -- this is a static demo site with no server.
  // Good enough to avoid storing raw passwords in plain text in localStorage.
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return "h" + Math.abs(hash).toString(36) + btoa(unescape(encodeURIComponent(str))).slice(0, 8);
}

function initials(name) {
  return (name || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("") || "?";
}

/* ---------- users & session ---------- */
function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS.users)) || {}; }
  catch { return {}; }
}
function saveUsers(users) {
  localStorage.setItem(STORE_KEYS.users, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(STORE_KEYS.session)); }
  catch { return null; }
}
function setSession(email, name, provider) {
  localStorage.setItem(STORE_KEYS.session, JSON.stringify({ email, name, provider, since: Date.now() }));
}
function clearSession() {
  localStorage.removeItem(STORE_KEYS.session);
}

function logActivity(entry) {
  let log = [];
  try { log = JSON.parse(localStorage.getItem(STORE_KEYS.activityLog)) || []; } catch {}
  log.unshift({ ...entry, at: new Date().toISOString() });
  log = log.slice(0, 100);
  localStorage.setItem(STORE_KEYS.activityLog, JSON.stringify(log));
}

/* ---------- progress ---------- */
function getProgress(email) {
  const key = STORE_KEYS.progressPrefix + email;
  try {
    return JSON.parse(localStorage.getItem(key)) || {
      lessons: {},          // { moduleId: { beginner: bool, intermediate: bool, expert: bool } }
      quizScores: {},       // { beginner: {score,total,at}, intermediate: {...}, expert: {...} }
      solvedProblems: []    // [problemId, ...]
    };
  } catch {
    return { lessons: {}, quizScores: {}, solvedProblems: [] };
  }
}
function saveProgress(email, data) {
  localStorage.setItem(STORE_KEYS.progressPrefix + email, JSON.stringify(data));
}
function markLessonComplete(email, moduleId, tier) {
  const p = getProgress(email);
  if (!p.lessons[moduleId]) p.lessons[moduleId] = {};
  p.lessons[moduleId][tier] = true;
  saveProgress(email, p);
  return p;
}
function isLessonComplete(progress, moduleId, tier) {
  return !!(progress.lessons[moduleId] && progress.lessons[moduleId][tier]);
}
function computeCoursePercent(progress) {
  const totalTiers = COURSE_DATA.modules.length * 3;
  let done = 0;
  for (const m of COURSE_DATA.modules) {
    const rec = progress.lessons[m.id];
    if (!rec) continue;
    if (rec.beginner) done++;
    if (rec.intermediate) done++;
    if (rec.expert) done++;
  }
  return Math.round((done / totalTiers) * 100);
}
function computeModulePercent(progress, moduleId) {
  const rec = progress.lessons[moduleId];
  if (!rec) return 0;
  let done = 0;
  if (rec.beginner) done++;
  if (rec.intermediate) done++;
  if (rec.expert) done++;
  return Math.round((done / 3) * 100);
}

/* ---------- nav ---------- */
function renderNav(activePage) {
  const mount = $("#nav-mount");
  if (!mount) return;
  const session = getSession();

  const links = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "learn.html", label: "Curriculum", key: "learn" },
    { href: "practice.html", label: "Code Terminal", key: "practice" },
    { href: "assessment.html", label: "Assessments", key: "assessment" },
    { href: "interview-prep.html", label: "Interview Prep", key: "interview" }
  ];

  const linksHtml = links.map(l =>
    `<a href="${l.href}" class="${activePage === l.key ? "active" : ""}">${l.label}</a>`
  ).join("");

  let rightHtml;
  if (session) {
    const p = getProgress(session.email);
    const pct = computeCoursePercent(p);
    rightHtml = `
      <a href="dashboard.html" class="avatar-chip" style="margin-right:6px;">
        <div class="avatar-circle">${initials(session.name)}</div>
        <div class="hide-mobile">
          <div style="font-size:.82rem;font-weight:600;line-height:1.2;">${session.name}</div>
          <div style="font-size:.7rem;color:var(--text-faint);font-family:var(--f-mono);">${pct}% complete</div>
        </div>
      </a>
      <button class="btn btn-ghost btn-sm" id="navLogoutBtn">Log out</button>`;
  } else {
    rightHtml = `
      <a href="auth.html" class="btn btn-ghost btn-sm hide-mobile">Log in</a>
      <a href="auth.html?mode=signup" class="btn btn-primary btn-sm">Sign up free</a>`;
  }

  mount.innerHTML = `
    <nav class="nav">
      <div class="wrap">
        <a href="index.html" class="brand">
          <span class="brand-mark">&lt;/&gt;</span> AlgoForge
        </a>
        <div class="nav-links">${linksHtml}</div>
        <div class="nav-cta-group">${rightHtml}</div>
      </div>
    </nav>`;

  const logoutBtn = $("#navLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      showToast("Logged out.");
      setTimeout(() => location.href = "index.html", 500);
    });
  }
}

function renderFooter() {
  const mount = $("#footer-mount");
  if (!mount) return;
  mount.innerHTML = `
    <footer class="footer">
      <div class="wrap">
        <div class="avatar-chip">
          <span class="brand-mark">&lt;/&gt;</span>
          <div>
            <div style="font-family:var(--f-display);font-weight:600;">AlgoForge</div>
            <div class="foot-note">Build your interview-ready foundation.</div>
          </div>
        </div>
        <div class="footer-links">
          <a href="learn.html">Curriculum</a>
          <a href="practice.html">Code Terminal</a>
          <a href="assessment.html">Assessments</a>
          <a href="interview-prep.html">Interview Prep</a>
        </div>
      </div>
    </footer>`;
}

/* ---------- auth guard ---------- */
function requireAuth() {
  const session = getSession();
  if (!session) {
    location.href = "auth.html?next=" + encodeURIComponent(location.pathname.split("/").pop());
    return null;
  }
  return session;
}

/* ---------- toast ---------- */
let toastTimer = null;
function showToast(msg) {
  let el = $("#globalToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "globalToast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  renderFooter();
});
