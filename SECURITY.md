# Security Policy

The HackHub team takes the security and privacy of our student users, collegiate data, and institutional integrations seriously. We appreciate the responsible disclosure of any security vulnerabilities discovered by independent researchers, students, and community members.

---

## Supported Versions

Security updates and patches are continuously applied to the latest release on the `main` branch.

| Version / Branch | Supported          |
| ---------------- | ------------------ |
| `main`           | :white_check_mark: |
| Older releases   | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability or sensitive data exposure in HackHub:

1. **Do NOT open a public GitHub issue.** Public disclosure puts active student accounts and institutional data at risk.
2. Please email a detailed advisory privately to:
   * **Security Contact:** `multimodexai@gmail.com`
   * **Subject Line:** `[SECURITY] Vulnerability Report - HackHub`
3. Include in your report:
   * Description of the vulnerability and its potential impact.
   * Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
   * Affected URLs, endpoints, or source code files.
   * Any suggested remediations or mitigations.

---

## Response Process & Timelines

* **Initial Acknowledgment:** Within **48 hours** of receiving your report.
* **Triage & Assessment:** We will investigate and confirm the issue within **5 business days**.
* **Remediation & Patching:** High-severity vulnerabilities will be patched promptly on `main` and deployed to production.
* **Credit & Recognition:** Once resolved, we will gladly credit you in our release notes (unless you prefer to remain anonymous).

---

## Core Security Invariants of HackHub

* **Institutional Authentication:** Student profiles and builder actions are authenticated via verified Google OAuth accounts.
* **Contact Data Isolation:** Student phone numbers and contact emails remain strictly hidden in the Team Builder database until a team lead explicitly accepts an application.
* **Local AI Privacy:** HACKBOT operates locally or in sandbox mode and never transmits sensitive student roll numbers, passwords, or session tokens across external networks.
* **Legitimate URL Verification:** HackHub only routes users to verified, official hackathon portals to protect students from phishing or fraudulent competitions.
