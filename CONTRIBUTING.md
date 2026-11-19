# Contributing to HackHub

Thank you for your interest in contributing to **HackHub**! We welcome contributions from developers, designers, data curators, and hackathon organizers to make HackHub the best student hackathon and builder intelligence platform.

---

## Getting Started

### 1. Prerequisites
Before contributing code, ensure you have the following installed on your machine:
* **Node.js** (v20 or higher) or **Bun** (v1.2 or higher — recommended)
* **Git**
* *(Optional for local AI features)* **Ollama** running locally (`brew install ollama && brew services start ollama`)

### 2. Fork and Clone
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/<your-username>/HackHub.git
cd HackHub

# Install dependencies using Bun
bun install
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Fill in your local Supabase credentials and configure your local AI URL:
```env
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
LOCAL_AI_URL="http://127.0.0.1:11434/v1"
LOCAL_AI_MODEL="qwen2.5:3b"
```

### 4. Running the Development Server
```bash
bun dev
```
Navigate to `http://localhost:8080` in your browser.

---

## Contribution Workflow

### 1. Create a Topic Branch
Always branch off from `main`:
```bash
git checkout -b feat/your-feature-name
# or for bug fixes:
git checkout -b fix/issue-description
```

Branch naming conventions:
* `feat/` — New feature or major enhancement (e.g., `feat/hackathon-filter-tags`)
* `fix/` — Bug fix (e.g., `fix/avatar-crop-aspect-ratio`)
* `docs/` — Documentation updates (e.g., `docs/readme-setup-guide`)
* `refactor/` — Code refactoring without changing functionality
* `chore/` — Build tools, dependencies, or configuration changes

### 2. Coding Guidelines & Standards
* **Framework:** We use **TanStack Start** with **React 19** and **Vite**.
* **Styling:** Follow HackHub's custom obsidian glass and warm gold aesthetic (`glass`, `clay`, `neo-inset`, `text-gold`, `bg-gold-gradient`).
* **Type Safety:** Ensure all TypeScript interfaces, server function inputs (using Zod schemas), and props are strictly typed.
* **Local AI Invariant:** AI logic must always include graceful deterministic fallbacks in `src/lib/ai.server.ts` so the platform operates smoothly even if local LLM daemons are offline.
* **Component Placement:**
  * Hub-specific reusable components go in `src/components/hub/`.
  * Generic UI design tokens go in `src/components/ui/`.
  * Server-side functions and RPC calls go in `src/lib/hub.functions.ts`.

### 3. Testing Your Changes
Before submitting a pull request, verify that the project builds cleanly without errors:
```bash
# Run linting
bun run lint

# Run unit tests
bun test

# Run full production build
bun run build
```

---

## Submitting a Pull Request (PR)

1. **Commit your changes:**
   Write clear, imperative commit messages:
   ```bash
   git commit -m "feat(hackathons): add search filter by mode and prize pool"
   ```
2. **Push to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```
3. **Open a Pull Request:**
   * Go to the original [HackHub Repository](https://github.com/BhavyaKansal20/HackHub).
   * Click **New Pull Request** and select your branch.
   * Provide a concise description of the changes, referencing any relevant issue numbers.
   * Include before/after screenshots if making UI changes.

---

## Community & Questions

Have questions or want to propose a large architectural change before writing code?
Feel free to open an **Issue** or contact the maintainer at **multimodexai@gmail.com**.
