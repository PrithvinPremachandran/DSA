# AlgoForge — DSA Interview Prep Platform

A static HTML/CSS/JavaScript website: 10 core Data Structures & Algorithms
modules (each with Beginner / Intermediate / Expert content), an in-browser
interactive code terminal, level-based assessments, and a 20+ question
interview prep bank — plus sign-up/login with progress tracking.

## 1. Hosting it

This is a 100% static site — no build step, no server required. Upload the
whole folder to any static host and it works:

- **Netlify / Vercel**: drag-and-drop the folder onto their dashboard, or
  connect a Git repo.
- **GitHub Pages**: push this folder to a repo and enable Pages on the
  `main` branch.
- **Any regular web host / shared hosting**: upload via FTP into your
  public/www folder.

Just make sure `index.html` stays at the root and the `css/` and `js/`
folders stay alongside it.

## 2. Important — please read: what "sign in" actually does here

This site has **no backend server or database**. Because of that:

- **Email/password accounts** are stored in the visitor's own browser
  (`localStorage`), not on a central server. Two different people on two
  different devices have two separate, disconnected account lists. This is
  fine for a personal learning tool or demo, but it is **not** a real
  multi-device user system — for that you'd need an actual backend
  (e.g. Firebase Auth, Supabase, or a custom API).
- **"Sign in with Google"** ships wired up to Google's real Identity
  Services SDK, but it needs *your own* Google OAuth Client ID before it
  will work for real (Google requires every site to register its own
  credentials — I can't generate one for you). Steps:
  1. Go to <https://console.cloud.google.com/apis/credentials>.
  2. Create a project (or use an existing one) → **Create Credentials** →
     **OAuth client ID** → Application type: **Web application**.
  3. Under "Authorized JavaScript origins," add the exact URL you'll host
     the site at (e.g. `https://yoursite.netlify.app`).
  4. Copy the generated Client ID into `js/config.js`:
     ```js
     GOOGLE_CLIENT_ID: "1234567890-abcxyz.apps.googleusercontent.com",
     ```
  5. Redeploy. The real Google button will now render automatically.

  **Until you do this**, the button falls back to a clearly-labeled "demo
  mode" so the site still works end-to-end for testing.

- **"Direct all status to prithwinanonymous@gmail.com"** — a static site
  genuinely cannot send real emails on its own; doing so always requires
  either a backend server or a third-party email API, because email
  credentials can't be safely exposed in public JavaScript. To get real
  emails for every signup, the closest fully-static option is
  **EmailJS** (free tier available, no server needed):
  1. Create a free account at <https://www.emailjs.com>.
  2. Add an **Email Service** (e.g. connect your Gmail).
  3. Create an **Email Template** with variables `user_name`,
     `user_email`, `provider`, `event`, and set the "To" address to
     `prithwinanonymous@gmail.com`.
  4. In `js/config.js`, set:
     ```js
     EMAILJS_ENABLED: true,
     EMAILJS_SERVICE_ID: "your_service_id",
     EMAILJS_TEMPLATE_ID: "your_template_id",
     EMAILJS_PUBLIC_KEY: "your_public_key",
     ```
  5. Add this line to the `<head>` of `auth.html`, above the existing
     `<script>` tags:
     ```html
     <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
     ```

  **Until this is configured**, every signup/login is still fully logged
  in-app — visible on each user's Dashboard under "Account activity log" —
  so nothing is silently lost; it just isn't emailed automatically.

## 3. What's included

```
index.html            Landing page
auth.html              Login / sign-up (email+password and Google)
dashboard.html          Progress gauge, module tracker, quiz badges, activity log
learn.html              Curriculum viewer (10 modules × 3 levels)
practice.html           Interactive code terminal (sandboxed JS execution)
assessment.html         Level-based quizzes (Beginner/Intermediate/Expert)
interview-prep.html     20+ curated interview questions with solutions
css/style.css           Design system + all page styles
js/data.js              All course content, quiz bank, interview bank, problems
js/app.js               Shared logic: session, progress, nav rendering
js/auth.js              Signup/login/Google sign-in logic
js/editor.js            Sandboxed code runner (iframe-isolated, with timeout)
js/quiz.js              Assessment engine
js/config.js            Your Google Client ID / EmailJS keys go here
```

## 4. Customizing content

Everything content-related lives in `js/data.js`:

- `COURSE_DATA.modules` — the 10 curriculum modules and their lesson text
  (edit the `tiers.beginner / .intermediate / .expert` HTML strings).
- `QUIZ_DATA` — the assessment question bank, split by level.
- `INTERVIEW_QUESTIONS` — the interview prep bank.
- `PRACTICE_PROBLEMS` — the coding terminal's problems, starter code, and
  hidden test cases (`tests: [{ args, expected }]`).

No build tools are needed — edit the file and refresh the page.

## 5. A note on the code terminal

The in-browser terminal runs JavaScript only (this is a JS-focused DSA
track). Submitted code executes inside a sandboxed `<iframe>` with
`sandbox="allow-scripts"` (isolated from the main page, no access to
cookies/localStorage/parent DOM) and a 4-second timeout to catch infinite
loops. It checks basic syntax first via `new Function(code)`, then runs the
hidden test cases and reports pass/fail with actual vs. expected output.
