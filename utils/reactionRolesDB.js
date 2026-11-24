// utils/reactionRolesDB.js
// Stockage JSON simple (pas besoin de base de données externe)

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'reaction_roles.json');

function ensureFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}));
}

function load() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function save(data) {
  ensureFile();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Sauvegarder un panel de reaction roles
// key = messageId, value = { channelId, guildId, roles: [{ emoji, roleId, label }] }
function setPanel(messageId, panelData) {
  const db = load();
  db[messageId] = panelData;
  save(db);
}

function getPanel(messageId) {
  const db = load();
  return db[messageId] || null;
}

function deletePanel(messageId) {
  const db = load();
  delete db[messageId];
  save(db);
}

function getAllPanels() {
  return load();
}

module.exports = { setPanel, getPanel, deletePanel, getAllPanels };
