# 🪶 Kai’s Before-You-Commit Checklist

This quick reference keeps every commit smooth and frustration-free 💫

---

## 🧩 1. Check What’s Changed
```bash
git status
Look for:

New (untracked) files → “use git add to include in what will be committed”

Modified files → already tracked but changed

🧱 2. Stage the Files
To add everything in a folder:

bash
Copy code
git add docs/
Or only markdown files:

bash
Copy code
git add docs/*.md
Or one specific file:

bash
Copy code
git add path/to/filename.md
💬 3. Confirm
bash
Copy code
git status
Everything you expect to commit should now show as “Changes to be committed.”

💾 4. Commit
Use a descriptive message:

bash
Copy code
git commit -m "Docs: add or update collaboration files"
☁️ 5. Push to Branch
Make sure you push to your active branch:

bash
Copy code
git push origin <branch-name>
Example:

bash
Copy code
git push origin suggestion/fix-login-flow
🌿 6. Verify on GitHub
Go to your fork → “Branches” → select your branch.

Confirm the files are visible.

Click Compare & Pull Request when ready.

✨ Tip:
If you get an “untracked files” or “nothing added to commit” message — it just means you missed the git add step. Run it again, check with git status, then retry your commit.

yaml


---



commiting new codes
🪶 Step-by-Step

1️⃣ Check what’s untracked or modified

git status


You should see something like:

Untracked files:
  docs/suggestion_index.md
  docs/CONTRIBUTING.md
  docs/repo_sync_notes.md
  docs/guardian_repo_structure.md


2️⃣ Stage the files

git add docs/


(This grabs all the new .md files inside the docs folder.)

3️⃣ Commit your work

git commit -m "Docs: add collaboration and organization markdown files"


4️⃣ Push to your suggestion branch
Since you’re on suggestion/fix-login-flow, push to that same branch:

git push origin suggestion/fix-login-flow


5️⃣ Confirm in GitHub

Go to your fork on GitHub → Branches → select suggestion/fix-login-flow.

You’ll see your new markdown files appear in /docs/.

If everything looks good, click Compare & pull request to open it for Guardian.

✨ Tip for later
If you ever want to commit multiple new docs again, you can run:

git add docs/*.md
git commit -m "Docs: update collaboration notes"
git push


That will catch all Markdown files in one go.
