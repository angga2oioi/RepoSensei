# RepoSensei

### AI-Powered PR Review & Approval

RepoSensei is an automated pull request (PR) reviewer and approver for git repositories. It analyzes code changes using AI and applies custom approval rules to streamline your development workflow.

---

## 🚀 Features
- **Automated PR Analysis** – Uses AI to review code changes and decide whether to approve or request changes.
- **Custom Approval Rules** – Configure rules for auto-approval, merge conditions, and notifications.
- **Bitbucket Integration** – Monitors PRs using webhooks and fetches changed files via the Bitbucket API.
- **Dashboard UI** – Web interface (Next.js) for configuring repositories, authentication, and monitoring PR status.
- **Secure Authentication** – Stores Bitbucket credentials securely.

---

## 🔧 Installation & Setup

### 1️⃣ Clone the repository
```bash
  git clone https://github.com/angga2oioi/repo-sensei.git
  cd repo-sensei
```

### 2️⃣ Install dependencies
```bash
  npm install
```

### 3️⃣ Set up environment variables
Create a `.env.local` file in the project root and add:
```env
ACCOUNT_TOKEN_JWT_SECRET=
REFRESH_TOKEN_JWT_SECRET=
CRYPTO_SECRET=

MONGO_DB_SERVER=
```

### 4️⃣ Run the application
```bash
  npm run dev
```

---

## 🔗 Bitbucket Webhook Setup
1. Go to your Bitbucket repository settings.
2. Navigate to **Webhooks**.
3. Click **Add Webhook** and enter:
   - **URL**: `https://your-app.com/api/webhook`
   - **Events**: `pullrequest:created`, `pullrequest:updated`
4. Save the webhook.

---

## 📌 How It Works
1. **PR Created** → Webhook triggers RepoSensei.
2. **Fetch Changed Files** → Calls Bitbucket API to retrieve modified files.
3. **AI Code Review** → Sends code snippets to OpenAI for analysis.
4. **Auto-Approval Logic** → Based on AI feedback and custom rules.
5. **Approve/Merge PR** → Uses Bitbucket API to approve and optionally merge the PR.
6. **Dashboard Logs** → View PR status and AI decisions.

---

## 🎯 Roadmap
- [ ] Add GitHub & GitLab support
- [ ] Implement custom rule-based approvals
- [ ] Slack & Email notifications
- [ ] Extend AI capabilities (custom models, security checks, best practices)

---

## 🤝 Contributing
Pull requests are welcome! Open an issue if you’d like to suggest a feature or report a bug.

---

## 📜 License
MIT License. See `LICENSE` for details.

---

## 📬 Contact
🔗 GitHub: [angga2oioi](https://github.com/angga2oioi)

