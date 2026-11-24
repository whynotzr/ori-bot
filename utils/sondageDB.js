// utils/sondageDB.js
const fs = require("fs");
const path = "./data/sondages.json";

module.exports = {
  addVote(messageId, type, userId) {
    if (!fs.existsSync("./data")) fs.mkdirSync("./data");
    let data = {};
    if (fs.existsSync(path)) {
      data = JSON.parse(fs.readFileSync(path, "utf8"));
    }

    if (!data[messageId]) data[messageId] = { votes: {}, oui: 0, non: 0 };

    // Si l'utilisateur a déjà voté, on renvoie false pour dire "déjà voté"
    if (data[messageId].votes[userId]) return false;

    // Enregistre le vote
    data[messageId].votes[userId] = type;
    data[messageId][type]++;

    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    return data[messageId]; // Retourne les scores mis à jour
  },
};
