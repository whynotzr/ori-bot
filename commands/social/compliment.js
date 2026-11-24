// commands/social/compliment.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const COMPLIMENTS = [
  "a un talent fou et ne le sait pas encore assez.",
  "illumine cette communauté rien qu'en étant présent(e).",
  "a un sens de l'humour qui rend chaque conversation meilleure.",
  "est quelqu'un sur qui on peut vraiment compter.",
  "a une énergie qui donne envie de se surpasser aussi.",
  "mérite clairement plus de reconnaissance qu'il/elle n'en reçoit.",
  "a un goût irréprochable (oui, même en jeu).",
  "rend ce serveur meilleur juste en étant là.",
  "a une patience à toute épreuve, et ça se voit.",
  "est la définition même de la loyauté.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('compliment')
    .setDescription('💐 Envoie un compliment à un membre !')
    .addUserOption(o => o.setName('membre').setDescription('Membre à complimenter').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const cible = interaction.options.getUser('membre');
    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];

    const texte = cible.id === interaction.user.id
      ? `${interaction.user} se complimente soi-même : *"Je ${compliment.replace(/^a /, 'ai ')}"* — l'auto-amour, c'est important ! 💖`
      : `${cible}, tu ${compliment}`;

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(0xFF73FA)
      .setTitle('💐 Compliment du jour')
      .setDescription(texte)
      .setFooter({ text: `Envoyé par ${interaction.user.tag}` })
    ]});
  }
};
