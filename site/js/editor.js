/* ============================================================
   ALGOFORGE — sandboxed code runner
   Executes the learner's JavaScript inside a sandboxed, isolated
   iframe (not the main page context) and reports back test
   results + console output via postMessage. A basic syntax check
   runs first so errors are caught before any test executes.
   ============================================================ */

function checkSyntax(code) {
  try {
    // eslint-disable-next-line no-new-func
    new Function(code);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function runInSandbox(userCode, functionName, tests, onDone) {
  const iframe = document.createElement("iframe");
  iframe.sandbox = "allow-scripts";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const resultChannelId = "run_" + Date.now() + "_" + Math.random().toString(36).slice(2);

  const harness = `
    <script>
      const logs = [];
      const origLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(a => {
          try { return typeof a === "string" ? a : JSON.stringify(a); }
          catch { return String(a); }
        }).join(" "));
      };

      function deepEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
      }

      let output = { id: ${JSON.stringify(resultChannelId)}, ok: true, results: [], logs: [], fatalError: null };

      try {
        ${userCode}

        if (typeof ${functionName} !== "function") {
          throw new Error("Could not find a function named '${functionName}'. Check your function name.");
        }

        const tests = ${JSON.stringify(tests)};
        for (const t of tests) {
          try {
            const actual = ${functionName}(...t.args);
            const pass = deepEqual(actual, t.expected);
            output.results.push({ pass, actual, expected: t.expected, args: t.args });
          } catch (err) {
            output.results.push({ pass: false, error: err.message, args: t.args, expected: t.expected });
          }
        }
      } catch (fatal) {
        output.ok = false;
        output.fatalError = fatal.message;
      }

      output.logs = logs;
      parent.postMessage(output, "*");
    <\/script>
  `;

  let settled = false;
  const timeoutMs = 4000;

  const listener = (event) => {
    if (!event.data || event.data.id !== resultChannelId) return;
    if (settled) return;
    settled = true;
    window.removeEventListener("message", listener);
    cleanup();
    onDone(event.data);
  };
  window.addEventListener("message", listener);

  const timer = setTimeout(() => {
    if (settled) return;
    settled = true;
    window.removeEventListener("message", listener);
    cleanup();
    onDone({ ok: false, fatalError: "Timed out (possible infinite loop). Execution stopped after 4s.", results: [], logs: [] });
  }, timeoutMs);

  function cleanup() {
    clearTimeout(timer);
    setTimeout(() => iframe.remove(), 50);
  }

  iframe.srcdoc = harness;
}
