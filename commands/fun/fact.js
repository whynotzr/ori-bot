// commands/fun/fact.js
const { SlashCommandBuilder } = require("discord.js");
const { fun } = require("../../utils/embeds");

const facts = [
  "🐝 Une abeille doit visiter environ 2 millions de fleurs pour produire 500g de miel.",
  "🦈 Les requins existaient déjà avant les arbres — il y a plus de 400 millions d'années.",
  "🌊 L'océan contient 97 % de toute l'eau de la Terre.",
  "🧠 Le cerveau humain génère assez d'électricité pour allumer une petite ampoule.",
  "🐜 La force combinée des fourmis de la Terre dépasse le poids total des humains.",
  "🌍 Il y a plus d'arbres sur Terre que d'étoiles dans la Voie Lactée.",
  "🦋 Les papillons goûtent avec leurs pieds.",
  "🐙 Les pieuvres ont trois cœurs et du sang bleu.",
  "🦅 Les aigles peuvent voir 4 à 5 fois mieux que les humains.",
  "🐬 Les dauphins ont des noms pour s'appeler les uns les autres.",
  "🌙 La Lune s'éloigne de la Terre de ~3,8 cm par an.",
  "💤 On passe environ 1/3 de sa vie à dormir.",
  "🍌 Les bananes sont légèrement radioactives à cause du potassium-40.",
  "🧬 L'ADN humain est similaire à 60 % à celui d'une banane.",
  "🌡️ Vénus est la planète la plus chaude du système solaire, pas Mercure.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fact")
    .setDescription("🔬 Un fait insolite aléatoire !"),
  cooldown: 5,
  async execute(interaction) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await interaction.reply({
      embeds: [fun("🔬 Fait insolite", fact, 0x00d4ff)],
    });
  },
};
