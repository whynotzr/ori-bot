// commands/utility/ping.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('🏓 Vérifie la latence du bot'),
  cooldown: 3,
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Ping...', fetchReply: true });
    const latence = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatence = Math.round(interaction.client.ws.ping);

    await interaction.editReply({
      content: null,
      embeds: [new EmbedBuilder()
        .setColor(0x00D4FF)
        .setTitle('🏓 Pong !')
        .addFields(
          { name: '📨 Latence bot', value: `${latence}ms`, inline: true },
          { name: '💓 Latence API', value: `${apiLatence}ms`, inline: true },
        )
      ]
    });
  }
};
