// commands/fun/coinflip.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pile-ou-face')
    .setDescription('🪙 Lancer une pièce !'),
  cooldown: 2,
  async execute(interaction) {
    const result = Math.random() < 0.5;
    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(result ? 0xFFD700 : 0xC0C0C0)
      .setTitle('🪙 Pile ou Face ?')
      .setDescription(`La pièce est tombée sur... **${result ? '⭕ PILE' : '✖️ FACE'}** !`)
      .setFooter({ text: `${interaction.user.tag}` })
    ]});
  }
};
