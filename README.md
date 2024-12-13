# TorrentBD RSS Fetcher

A Node.js application that fetches RSS feed updates, filters out duplicate entries, and sends the latest updates via email on a schedule. The application uses `node-cron` for scheduling tasks and includes a lightweight `express` server for Uptime.

---

## Features
- **RSS Feed Parsing**: Fetches and parses RSS feed data.
- **Email Notifications**: Sends formatted email updates using `nodemailer`.
- **Duplicate Filtering**: Ensures no duplicate titles are emailed using a JSON-based storage mechanism.
- **Scheduled Execution**: Uses `node-cron` to run tasks every 5 minutes (or any customizable interval).
- **Express Server**: Ready for expansion to add API endpoints for managing tasks or viewing logs.

---

## Requirements
- Node.js (v14 or higher)
- npm (v6 or higher)

---

## Installation

### Step 1: Clone the Repository
- Run the following command in your terminal:
  - `git clone https://github.com/Sadman-11/TBD-RSS-Fetcher.git`
  - `cd TBD-RSS-Fetcher`

### Step 2: Install Dependencies
- Run `npm install` to install all required dependencies.

### Step 3: Configure Email and RSS Feed
1. Open the code and replace placeholders with your information:
   - **RSS Feed URL**: Update `RSS_FEED_URL` with your RSS feed URL.
   - **Email Configuration**: Update `EMAIL_CONFIG.auth.user` and `EMAIL_CONFIG.auth.pass` with your email and app password.
   - **Recipient Email**: Update `RECIPIENT_EMAIL` with the recipient's email address.

2. Rename `.env.example` to `.env` file:
   - Add the following content to the `.env` file:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     RSS_FEED_URL=RSS_FEED_URL
     ```
---

## Usage

1. Start the application:
   - Run `npm start / node index` in your terminal.

2. The script will:
   - Fetch the RSS feed every 5 minutes.
   - Send email updates for new Torrent(s).
   - Save already sent titles in `sent_titles.json` to prevent duplicates.

3. (Optional) If you plan to use the Express server, it will run on `http://localhost:3000` and if you host it on https://render.com use betteruptime to ping and keep server alive 24/7

---

## Customization

### Schedule Interval
- Update the `node-cron` schedule in the `cron.schedule()` function:
```bash
cron.schedule("*/5 * * * *", main); // Runs every 5 minutes
```
- For hourly: `0 * * * *`

### Email Template
- Modify the `formatEmailContent()` function to customize the email content.

---

## Dependencies
- [rss-parser](https://www.npmjs.com/package/rss-parser) - Parse RSS feeds.
- [nodemailer](https://www.npmjs.com/package/nodemailer) - Send emails.
- [node-cron](https://www.npmjs.com/package/node-cron) - Schedule tasks.
- [express](https://www.npmjs.com/package/express) - Create a web server.

## Big Shout Out to ChatGPT for creating this 