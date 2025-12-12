# Deploying Vox Librorum to GitHub

Your Vox Librorum archive is now **"Amphibious"**. This means it can run in two modes:

1. **Full Server Mode (Localhost / Node.js Host):**
    * Uses a real database (`sqlite`).
    * Secure User Accounts.
    * Persistent Data.
    * *To run locally:* `npm install` then `node server.js`.

2. **Static Simulation Mode (GitHub Pages):**
    * If you upload this code to GitHub Pages, the backend server *will not run* (GitHub doesn't support Node.js servers).
    * **However, the site will still work!**
    * It automatically detects that the server is "Offline" and switches to `localStorage`.
    * You can "Login" with password `EMBER`.
    * You can "Create Projects" (saved to your browser cache).
    * It looks and feels complete for visitors/demos.

## How to Upload to GitHub

1. Create a new Repository on GitHub.
2. Run the following commands in your project folder:

    ```bash
    git init
    git add .
    git commit -m "Initial Launch: Vox Librorum"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    git push -u origin main
    ```

3. Go to your GitHub Repo -> **Settings** -> **Pages**.
4. Set Source to `main branch` (or `/root`).
5. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`!

## Notes for the Future

If you want the *Real* database live on the web, you will need to deploy this repository to a service like **Render** or **Railway** instead of GitHub Pages. But for now, the Simulation Mode is perfect for sharing the design!
