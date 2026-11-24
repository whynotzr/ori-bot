// commands/fun/pseudo.js
const { SlashCommandBuilder } = require("discord.js");
const { fun } = require("../../utils/embeds");

const adjectifs = [
  "Ultra",
  "Mega",
  "Dark",
  "Shadow",
  "Neon",
  "Cyber",
  "Hyper",
  "Epic",
  "Turbo",
  "Chaos",
  "Void",
  "Storm",
  "Blaze",
  "Frost",
];
const noms = [
  "Dragon",
  "Wolf",
  "Phoenix",
  "Titan",
  "Reaper",
  "Ghost",
  "Blade",
  "Viper",
  "Nova",
  "Hunter",
  "Storm",
  "Nexus",
  "Raven",
  "Specter",
];
const suffixes = [
  "X",
  "99",
  "Pro",
  "01",
  "XL",
  "Max",
  "777",
  "Zero",
  "One",
  "Neo",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pseudo")
    .setDescription("💬 Génère un pseudo gaming aléatoire !"),
  cooldown: 5,
  async execute(interaction) {
    const adj = adjectifs[Math.floor(Math.random() * adjectifs.length)];
    const nom = noms[Math.floor(Math.random() * noms.length)];
    const suf = suffixes[Math.floor(Math.random() * suffixes.length)];
    await interaction.reply({
      embeds: [
        fun("💬 Pseudo gaming généré", `**${adj}${nom}${suf}**`, 0x00d4ff),
      ],
    });
  },
};
