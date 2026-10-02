# Security policy

Pflanzengilde is a static, client-side web app: it has no backend, no accounts and no server-side storage. Planner state stays in the browser's `localStorage`, and shared plans are encoded in the URL.

## Reporting a vulnerability

Please do not open a public issue for security problems. Report them privately through GitHub instead: go to the **Security** tab of this repository and click **Report a vulnerability**.

Useful reports include the affected page or component, steps to reproduce, and what an attacker could achieve (for example, script injection through a crafted share link).

Only the current `main` branch, which is what runs on [pflanzengilde.de](https://pflanzengilde.de), receives fixes.
