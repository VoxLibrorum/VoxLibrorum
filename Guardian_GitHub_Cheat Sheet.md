# 🌿 Guardian GitHub Cheat Sheet

_A friendly guide for reviewing Rebecca’s suggestions and safely managing your code._

---

## 🧭 1. Core Concepts

### 🗂 Repository (Repo)
Your project folder on GitHub.  
All your code, documentation, and version history live here.

### 🌱 Fork
A personal copy of your repo made by someone else (like Rebecca) to experiment safely.  
She can make improvements in her fork without changing your original project.

### 🌳 Branch
A version of your repo used to work on new ideas without touching `main`.  
You can merge it later if you like the results.

> Think of it like this:
> **Main** = your published book.  
> **Branch** = your notebook full of drafts and ideas.

---

## 🛠️ 2. Reviewing Rebecca’s Work

1. Go to your GitHub repository.  
2. Click the **Pull Requests** tab at the top.  
3. You’ll see a list of pull requests (PRs) Rebecca has opened.  
4. Click on a PR to review it:
   - **Files changed** → see exactly what code she added or removed.
   - **Comments** → read her notes or explanations.
5. You can:
   - Add your own comments and ask questions.
   - Click **Merge pull request** to accept her changes.
   - Click **Close** if you don’t want to merge it.
   - Do nothing if you just want to leave it open for now — nothing breaks.

---

## 🔍 3. Testing Her Code Safely (Optional)

If you’d like to try her suggested changes locally without merging:

```bash
# Open your terminal or Git Bash
git fetch origin pull/<PR-number>/head:review-branch
git checkout review-branch
npm install
npm run dev

Then you can preview the code on your machine.
When finished, switch back to your main branch:

git checkout main

🧩 4. Keeping Things Organized

You can use GitHub’s built-in tools to track ideas and changes:

Labels: tag PRs as suggestion, in review, merged, or testing.

Projects: create a simple board (like a to-do list) for open and merged PRs.

Discussions: if you want a space to talk about big ideas before coding them.

🧑‍💻 5. Everyday Commands Reference
Action	Command
Get the latest version of your code	git pull
Make a new branch	git checkout -b feature/new-feature
Stage changes	git add .
Commit your edits	git commit -m "describe what you changed"
Upload branch to GitHub	git push origin feature/new-feature
💡 6. Etiquette & Safety Tips

Always make a new branch before working on changes.

Never commit directly to main.

Read pull requests before merging.

Comment on lines you’re unsure about.

Use .gitignore to keep private files (like .env) out of GitHub.

Keep README.md updated with project goals and setup steps.

✨ 7. Workflow Summary

Rebecca forks your repo and works in her fork.

She makes a branch for each improvement.

She opens a pull request to show you her changes.

You review, test, and decide what to merge.

You stay fully in control — your repo never changes without your approval.

Remember: GitHub is your safety net.
You can explore, experiment, or roll back changes anytime — nothing is ever truly lost.


---

## 🧩 Recommended VS Code / Codespace Extensions

These tools make it easier to review, understand, and format code — all safe to use inside Codespaces (they do not affect your local setup).

| Extension | ID | Purpose |
|------------|----|----------|
| **ESLint** | `dbaeumer.vscode-eslint` | Highlights syntax and style issues automatically. |
| **Prettier – Code Formatter** | `esbenp.prettier-vscode` | Keeps code neatly formatted when you save. |
| **GitHub Pull Requests and Issues** | `GitHub.vscode-pull-request-github` | Lets you open, review, and comment on pull requests directly in the editor. |
| **Markdown Preview Enhanced** | `shd101wyy.markdown-preview-enhanced` | Gives you a live preview for `.md` files like this cheat sheet. |
| **Error Lens** *(optional)* | `usernamehw.errorlens` | Shows errors and warnings inline for faster visual feedback. |
| **GitLens** *(optional, advanced)* | `eamodio.gitlens` | Helps explore commit history and authorship line by line. |

### 💡 How to Install
1. In the Codespace sidebar, click the **Extensions** icon (four squares).  
2. Search for the extension name.  
3. Click **Install in Codespace** — not “locally.”  
4. You can disable or remove any of them later with one click.

---

*All of these stay inside the Codespace environment — they won’t touch your personal WXP setup.*

# 🔒 How to Make This Repository Private (and Keep Rebecca’s Access)

If you’d like to make this project private so only invited people can view it:

### Step 1: Open Repository Settings
1. Go to your repo on GitHub.  
2. Click **Settings** (the rightmost tab near the top).  
3. Scroll down to the **Danger Zone** section.

### Step 2: Change Visibility
1. Click **Change repository visibility**.  
2. Select **Private**.  
3. Confirm the change when prompted.

### Step 3: Re-Invite Collaborators
Once private, only invited collaborators can access it.

1. Go to **Settings → Collaborators and teams**.  
2. Click **Add people**.  
3. Enter **Rebecca’s GitHub username**.  
4. Choose **Write** access so she can open pull requests and push to branches.  

✅ That’s it — your code will now be visible only to you and your invited collaborators.  
Rebecca will still be able to:
- Work from her fork or Codespace.  
- Open pull requests for you to review.  
- See updates if you keep her listed as a collaborator.

---

© 2025 — Collaborative setup by Rebecca & Chris
“Two lanterns, one code path.”
