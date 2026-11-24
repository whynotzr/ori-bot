// commands/utility/stats.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return `${days}j ${hours}h ${minutes}m ${seconds}s`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('📈 Affiche les statistiques du bot'),
  cooldown: 5,
  async execute(interaction) {
    const client = interaction.client;
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024;

    const totalMembers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(0xFF0080)
      .setTitle('📈 Statistiques du bot')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '🖥️ Serveurs',   value: `${client.guilds.cache.size}`,        inline: true },
        { name: '👥 Membres',     value: `${totalMembers}`,                    inline: true },
        { name: '⚙️ Commandes',   value: `${client.commands.size}`,            inline: true },
        { name: '⏱️ Uptime',      value: formatUptime(client.uptime),          inline: true },
        { name: '💾 Mémoire',     value: `${memUsage.toFixed(1)} MB`,          inline: true },
        { name: '📡 Latence API', value: `${Math.round(client.ws.ping)}ms`,    inline: true },
      )
      .setTimestamp()
      .setFooter({ text: '🌸 Anime & Gaming Bot' })
    ]});
  }
};
