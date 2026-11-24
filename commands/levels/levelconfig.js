// commands/levels/levelconfig.js
const path = require("path");

const LEVEL_UP_CHANNEL_ID = "";

// 🚀 MULTIPLICATEURS D'XP
const GLOBAL_XP_MULTIPLIER = 2; // Multiplicateur global (ex: 2 pour XP x2)

// Multiplicateurs spécifiques par rôle (optionnel)
const ROLE_MULTIPLIERS = {
  // "ID_DU_ROLE_BOOSTER": 1.5,
};

const defaultBg = path.join(__dirname, "../../assets/inoue.jpg");

const tiers = [
  {
    minLevel: 0,
    name: "Rang E",
    color: "#95A5A6",
    roleId: "1374485037726040304",
    background: defaultBg,
  },
  {
    minLevel: 5,
    name: "Rang D",
    color: "#7F8C8D",
    roleId: "1374485077794492448",
    background: defaultBg,
  },
  {
    minLevel: 10,
    name: "Rang C",
    color: "#2ECC71",
    roleId: "1374485270971285624",
    background: defaultBg,
  },
  {
    minLevel: 20,
    name: "Rang B",
    color: "#3498DB",
    roleId: "1374485301174472714",
    background: defaultBg,
  },
  {
    minLevel: 30,
    name: "Rang A",
    color: "#9B59B6",
    roleId: "1374485350633963633",
    background: defaultBg,
  },
  {
    minLevel: 40,
    name: "Rang S",
    color: "#F1C40F",
    roleId: "1374485403872002190",
    background: defaultBg,
  },
  {
    minLevel: 50,
    name: "Rang S+",
    color: "#E67E22",
    roleId: "1420851412874563594",
    background: defaultBg,
  },
  {
    minLevel: 60,
    name: "Rang N",
    color: "#E74C3C",
    roleId: "1420851493568905317",
    background: defaultBg,
  },
  {
    minLevel: 70,
    name: "Rang N+",
    color: "#1ABC9C",
    roleId: "1420851497314554039",
    background: defaultBg,
  },
  {
    minLevel: 80,
    name: "Rang M",
    color: "#FF007F",
    roleId: "1420851501903122503",
    background: defaultBg,
  },
];

function getTierForLevel(level) {
  const sortedTiers = [...tiers].sort((a, b) => b.minLevel - a.minLevel);
  return sortedTiers.find((t) => level >= t.minLevel) || tiers[0];
}

module.exports = {
  LEVEL_UP_CHANNEL_ID,
  GLOBAL_XP_MULTIPLIER,
  ROLE_MULTIPLIERS,
  tiers,
  getTierForLevel,
};
