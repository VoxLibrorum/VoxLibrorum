# 🪶 Repo Sync Notes

This file helps track syncs between Guardian’s main repo and Rebecca’s fork.

---

## 🌿 How to Sync (Run in Your Codespace Terminal)

1. Add Guardian’s repo as an **upstream remote**:
   ```bash
   git remote add upstream https://github.com/<GuardianUsername>/<GuardianRepoName>.git
Fetch latest changes:

bash
Copy code
git fetch upstream
Merge them into your fork’s main branch:

bash
Copy code
git checkout main
git merge upstream/main
git push origin main
Your fork is now up to date.

🧭 Notes
Sync once in a while, especially before starting a new suggestion branch.

Always make sure you’re on your own main before merging.

yaml

---


## 📘 `guardian_repo_structure.md` (optional but super helpful)

```markdown
# 📘 Guardian Repo Structure Overview

This file is meant to outline how the repository is organized as of the last sync.

---

## 🧩 Example Layout
/components/ → UI pieces or reusable blocks
/pages/ → Page-level files (if using Next.js)
/api/ → Serverless functions or endpoints
/lib/ → Helper functions or data utilities
/public/ → Static assets (images, icons, etc.)
/docs/ → Documentation, notes, and collaboration files

yaml

---

### 🪄 Tip
Keep this file updated as new sections or features are added.  
It helps both Guardian and Rebecca navigate faster when reviewing or improving parts of the system.
