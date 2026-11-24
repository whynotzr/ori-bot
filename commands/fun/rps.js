// commands/fun/rps.js — Pierre Feuille Ciseaux
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const CHOICES = ['🪨 Pierre', '📄 Feuille', '✂️ Ciseaux'];
const WIN = { 0: 2, 1: 0, 2: 1 }; // index gagnant contre index

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pfc')
    .setDescription('✂️ Jouer à Pierre Feuille Ciseaux contre le bot !')
    .addStringOption(o => o.setName('choix').setDescription('Ton choix').setRequired(true)
      .addChoices(
        { name: '🪨 Pierre',  value: '0' },
        { name: '📄 Feuille', value: '1' },
        { name: '✂️ Ciseaux', value: '2' },
      )),
  cooldown: 3,
  async execute(interaction) {
    const userIdx  = parseInt(interaction.options.getString('choix'));
    const botIdx   = Math.floor(Math.random() * 3);
    let result, color;

    if (userIdx === botIdx) {
      result = '🤝 Égalité !'; color = 0xFEE75C;
    } else if (WIN[userIdx] === botIdx) {
      result = '🎉 Tu gagnes !'; color = 0x57F287;
    } else {
      result = '💀 Tu perds !'; color = 0xED4245;
    }

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(color)
      .setTitle('✂️ Pierre Feuille Ciseaux')
      .addFields(
        { name: `${interaction.user.username}`, value: CHOICES[userIdx], inline: true },
        { name: 'Bot',                          value: CHOICES[botIdx],  inline: true },
      )
      .setDescription(`\n**${result}**`)
    ]});
  }
};
