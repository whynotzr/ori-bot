// utils/warnsDB.js
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'data', 'warns.json');

function ensureFile() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({}));
}

function load() { ensureFile(); return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); }
function save(data) { ensureFile(); fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }

function addWarn(guildId, userId, reason, moderatorId) {
  const db = load();
  if (!db[guildId]) db[guildId] = {};
  if (!db[guildId][userId]) db[guildId][userId] = [];
  const warn = { id: Date.now().toString(), reason, moderatorId, timestamp: new Date().toISOString() };
  db[guildId][userId].push(warn);
  save(db);
  return warn;
}

function getWarns(guildId, userId) {
  const db = load();
  return db[guildId]?.[userId] || [];
}

function clearWarns(guildId, userId) {
  const db = load();
  if (db[guildId]) delete db[guildId][userId];
  save(db);
}

function removeWarn(guildId, userId, warnId) {
  const db = load();
  if (db[guildId]?.[userId]) {
    db[guildId][userId] = db[guildId][userId].filter(w => w.id !== warnId);
    save(db);
    return true;
  }
  return false;
}

module.exports = { addWarn, getWarns, clearWarns, removeWarn };
