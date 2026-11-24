// commands/fun/rate.js — Note quelque chose /100
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('note')
    .setDescription('⭐ Note n\'importe quoi sur 10 !')
    .addStringOption(o => o.setName('chose').setDescription('Qu\'est-ce que tu veux noter ?').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const chose = interaction.options.getString('chose');
    const score = Math.floor(Math.random() * 11);
    const stars = '⭐'.repeat(score) + '☆'.repeat(10 - score);
    const colors = [0xED4245, 0xED4245, 0xFF6B35, 0xFF6B35, 0xFEE75C, 0xFEE75C, 0x57F287, 0x57F287, 0x00D4FF, 0xFF0080, 0xFF0080];

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(colors[score])
      .setTitle('⭐ Noteur Officiel')
      .setDescription(`Je donne **${score}/10** à : *${chose}*\n\n${stars}`)
      .setFooter({ text: `Demandé par ${interaction.user.tag} • Résultat totalement objectif` })
    ]});
  }
};
