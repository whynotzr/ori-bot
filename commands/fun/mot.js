// commands/fun/mot.js
const { SlashCommandBuilder } = require("discord.js");
const { fun } = require("../../utils/embeds");

const mots = [
  { mot: "Sérendipité", def: "Faire une découverte heureuse par hasard." },
  { mot: "Farniente", def: "Doux plaisir de ne rien faire." },
  { mot: "Ineffable", def: "Trop grand pour être exprimé par des mots." },
  { mot: "Pétrichor", def: "Odeur de la pluie sur la terre sèche." },
  { mot: "Cafard", def: "Sentiment de mélancolie légère sans raison précise." },
  {
    mot: "Saudade",
    def: "Nostalgie mélancolique d'une chose absente (Portugal).",
  },
  {
    mot: "Hiraeth",
    def: "Nostalgie d'un endroit ou d'une époque inaccessible (Galles).",
  },
  {
    mot: "Vellichor",
    def: "Étrangeté de sentir que chaque passant a une vie aussi vivace que la tienne.",
  },
  { mot: "Ephémère", def: "Qui dure très peu de temps." },
  { mot: "Funambule", def: "Acrobate qui marche sur un fil tendu." },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mot")
    .setDescription("📖 Découvre un mot rare ou beau du jour !"),
  cooldown: 5,
  async execute(interaction) {
    const { mot, def } = mots[Math.floor(Math.random() * mots.length)];
    await interaction.reply({
      embeds: [fun(`📖 Mot du jour : **${mot}**`, def, 0xf39c12)],
    });
  },
};
