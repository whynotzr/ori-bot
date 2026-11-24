// commands/levels/ranking.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "../../ranking.db"));

db.run(`CREATE TABLE IF NOT EXISTS levels (
    userId TEXT,
    guildId TEXT,
    xp INTEGER,
    level INTEGER,
    PRIMARY KEY (userId, guildId)
)`);

function getUserRank(userId, guildId) {
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM levels WHERE userId = ? AND guildId = ?`,
      [userId, guildId],
      (err, row) => {
        if (!row) return resolve({ xp: 0, level: 0, position: "N/A" });

        // Calcule la position dans le classement du serveur (#1, #2, etc.)
        db.get(
          `SELECT COUNT(*) as position FROM levels WHERE guildId = ? AND xp > ?`,
          [guildId, row.xp],
          (err, posRow) => {
            resolve({
              xp: row.xp,
              level: row.level,
              position: (posRow ? posRow.position : 0) + 1,
            });
          },
        );
      },
    );
  });
}

function addXp(userId, guildId, xpToAdd) {
  return new Promise((resolve) => {
    db.get(
      `SELECT * FROM levels WHERE userId = ? AND guildId = ?`,
      [userId, guildId],
      (err, row) => {
        if (!row) {
          db.run(
            `INSERT INTO levels (userId, guildId, xp, level) VALUES (?, ?, ?, ?)`,
            [userId, guildId, xpToAdd, 0],
          );
          resolve({ leveledUp: false, newLevel: 0 });
        } else {
          const currentXp = row.xp + xpToAdd;
          const currentLevel = row.level;
          const newLevel = Math.floor(0.1 * Math.sqrt(currentXp));
          const leveledUp = newLevel > currentLevel;

          db.run(
            `UPDATE levels SET xp = ?, level = ? WHERE userId = ? AND guildId = ?`,
            [currentXp, newLevel, userId, guildId],
          );
          resolve({ leveledUp, newLevel, currentXp });
        }
      },
    );
  });
}

module.exports = { getUserRank, addXp };
