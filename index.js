const RSSParser = require("rss-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cron = require("node-cron");
require("dotenv").config();
const express = require('express');

const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Rss fetcher running!'));

const EMAIL_CONFIG = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
const RECIPIENT_EMAIL = "s@gmail.com";
const SENT_TITLES_FILE = "sent_titles.json";

/**
 * Load sent titles from JSON file.
 */
function loadSentTitles() {
  if (fs.existsSync(SENT_TITLES_FILE)) {
    const data = fs.readFileSync(SENT_TITLES_FILE, "utf-8");
    return new Set(JSON.parse(data));
  }
  return new Set();
}

/**
 * Save sent titles to JSON file.
 */
function saveSentTitles(sentTitles) {
  fs.writeFileSync(SENT_TITLES_FILE, JSON.stringify([...sentTitles], null, 2));
}

/**
 * Fetch the RSS feed.
 */
async function fetchRSSFeed(url) {
  try {
    const parser = new RSSParser();
    const feed = await parser.parseURL(url);
    return feed.items;
  } catch (error) {
    console.error("Error fetching RSS feed:", error.message);
    return [];
  }
}

/**
 * Format the RSS entries into HTML content.
 */
function formatEmailContent(entries) {
  let content = "<h1>Exclusive Torrent(s) Update</h1>";
  entries.forEach((entry) => {
    content += `
      <h3>${entry.title}</h3>
      <p><strong>Published:</strong> ${entry.pubDate}</p>
      <p>${entry.contentSnippet || entry.content}</p>
      <a href="${entry.link}">Download Link</a>
      <hr>
    `;
  });
  return content;
}

/**
 * Send email with the RSS feed content.
 */
async function sendEmail(subject, body) {
  const transporter = nodemailer.createTransport(EMAIL_CONFIG);

  const mailOptions = {
    from: EMAIL_CONFIG.auth.user,
    to: RECIPIENT_EMAIL,
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
}

/**
 * Main function to fetch RSS feed and send it via email.
 */
async function main() {
  const sentTitles = loadSentTitles();
  const entries = await fetchRSSFeed(process.env.RSS_FEED_URL);
  const newEntries = entries.filter((entry) => !sentTitles.has(entry.title));

  if (newEntries.length > 0) {
    const emailContent = formatEmailContent(newEntries);
    await sendEmail("New Exlcusive Torrent(s) Found!", emailContent);

    // Update sent titles and save to file
    newEntries.forEach((entry) => sentTitles.add(entry.title));
    saveSentTitles(sentTitles);
  } else {
    console.log("No new entries found.");
  }
}

/**
 * Schedule the script to run every 5 minutes.
 */
cron.schedule("*/5 * * * *", main); // 5 minutes in milliseconds

// Initial run
main();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))