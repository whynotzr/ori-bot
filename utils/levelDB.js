// utils/levelDB.js
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'levels.json');

// S'assurer que le dossier data existe
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: {}, config: {} }, null, 2));
}

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
  // Gestion des utilisateurs (XP / Niveaux)
  getUserData(userId, guildId) {
    const db = readDB();
    const key = `${guildId}-${userId}`;
    if (!db.users[key]) {
      db.users[key] = { xp: 0, level: 0 };
      writeDB(db);
    }
    return db.users[key];
  },

  saveUserData(userId, guildId, xp, level) {
    const db = readDB();
    const key = `${guildId}-${userId}`;
    db.users[key] = { xp, level };
    writeDB(db);
  },

  getTopPlayers(guildId) {
    const db = readDB();
    return Object.keys(db.users)
      .filter(key => key.startsWith(`${guildId}-`))
      .map(key => {
        const userId = key.split('-')[1];
        return { userId, ...db.users[key] };
      })
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10);
  },

  // Gestion de la configuration
  getConfig(guildId) {
    const db = readDB();
    if (!db.config[guildId]) {
      db.config[guildId] = { channelId: null, roles: {} }; // roles format: { "5": "ROLE_ID_NIV_5" }
      writeDB(db);
    }
    return db.config[guildId];
  },

  saveConfig(guildId, config) {
    const db = readDB();
    db.config[guildId] = config;
    writeDB(db);
  }
};