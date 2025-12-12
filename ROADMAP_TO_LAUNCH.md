# 🗺️ Vox Librorum: The Ascension Roadmap
*From Prototype to Production in 5 Days*

This roadmap is designed to take the beautiful "shell" of Vox Librorum and install a working engine inside it. By the end of this week, your application will have memory, security, and the ability to truly share data.

---

## 📅 Day 1: The Backbone (Server & Database)
**Objective:** Give the application a brain that remembers data.
Currently, your app forgets everything when you refresh. We will fix that.

1.  **Select a Database:**
    *   We will use **SQLite**. It is lightweight, requires no external server installation, and lives right in your project folder (perfect for an "Archive").
2.  **Install Dependencies:**
    *   `npm install sqlite3 sequelize` (Sequelize makes talking to the DB easier).
3.  **Create the Schema:**
    *   Define what a **User** looks like (id, username, password_hash).
    *   Define what a **Project** looks like (id, title, owner_id, data_json).
4.  **Build the API Skeleton:**
    *   Update `server.js` to accept JSON data (`app.use(express.json())`).
    *   Create a test route `GET /api/status` that returns `{ status: "Online" }`.

---

## 📅 Day 2: The Gatekeeper (Authentication)
**Objective:** creating real keys for the archive. No more "NOVA" hardcodes.

1.  **Security Setup:**
    *   `npm install bcrypt jsonwebtoken cookie-parser`
    *   **Bcrypt** scrambles passwords so they aren't saved as plain text.
    *   **JWT (JSON Web Token)** creates a digital "badge" the user wears after logging in.
2.  **Build Routes:**
    *   `POST /auth/register`: Takes username/password -> Saves new user to DB.
    *   `POST /auth/login`: Checks password -> Sends back a cookie/token.
3.  **Frontend Wiring:**
    *   Connect your beautiful `login.html` form to these new routes.
    *   Show real error messages from the server (e.g., "Username taken").

---

## 📅 Day 3: The Memory (Connecting the Desk)
**Objective:** Make the "Project Desk" actually load *your* projects.

1.  **API Endpoints:**
    *   `GET /api/projects`: Fetches only projects belonging to the logged-in user.
    *   `POST /api/projects`: Creates a new project in the DB.
    *   `PUT /api/projects/:id`: Saves changes (like adding a resource).
2.  **Refactor `desk.js`:**
    *   Remove the fake `DB` variable.
    *   Replace `this.projects` with an async fetch call to your new API.
    *   Make the **"Create Project"** button actually send data to the server.

---

## 📅 Day 4: The Vault (Resource Management)
**Objective:** Allow users to create *new* resources, not just pick from the demo list.

1.  **Resource API:**
    *   Create a table/model for `Resources`.
    *   Since resources in your app are complex (Oral Histories, Maps), we need a flexible way to store them.
2.  **The "Add" Form:**
    *   Create a simple modal in the UI to "Mint a New Asset".
    *   Inputs: Title, Type (Map/Audio/Text), and Description.
3.  **Wiring:**
    *   When a user clicks "Save Resource", it writes to your database and immediately appears on their desk.

---

## 📅 Day 5: The Conduit (Sharing & Deployment)
**Objective:** The final connection. Letting others see your work.

1.  **The "Share" Button:**
    *   Build a public route: `GET /share/:projectId`.
    *   If a user visits this link, the server finds the project and renders a "Read Only" version of the desk.
2.  **Environment Variables:**
    *   Create a `.env` file to hide secrets (like your database password or session secrets).
3.  **Launch Prep:**
    *   Run a final walkthrough. Login -> Create Project -> Add Resource -> Share Link.
    *   If that flow works, you are ready to publish!

---

### 🛡️ Technical Summary (The Stack)
By Day 5, your stack will evolve to:
*   **Frontend:** HTML5, Tailwind, Vanilla JS (Existing)
*   **Backend:** Node.js + Express (Existing)
*   **Database:** SQLite (New)
*   **Auth:** JWT + Bcrypt (New)

🔥 **Ready to begin Day 1? Just ask.**
