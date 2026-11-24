// utils/logger.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  /**
   * Envoie un log dans le salon configuré via MOD_LOG_CHANNEL dans .env
   * @param {import('discord.js').Guild} guild
   * @param {string} title
   * @param {string} description
   * @param {number} color
   */
  async sendLog(guild, title, description, color = 0xF47FFF) {
    const logChannelId = process.env.MOD_LOG_CHANNEL;
    if (!logChannelId) return; // Pas configuré -> on ignore silencieusement

    const channel = await guild.channels.fetch(logChannelId).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(`🛡️ LOGS : ${title}`)
      .setDescription(description)
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  }
};
