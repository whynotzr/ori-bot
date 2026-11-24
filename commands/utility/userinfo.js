// commands/utility/userinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('👤 Afficher les infos d\'un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre (défaut: toi)').setRequired(false)),

  async execute(interaction) {
    const user   = interaction.options.getUser('membre') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const roles = member?.roles.cache
      .filter(r => r.id !== interaction.guildId)
      .sort((a, b) => b.position - a.position)
      .map(r => `<@&${r.id}>`)
      .slice(0, 10)
      .join(' ') || 'Aucun rôle';

    const embed = new EmbedBuilder()
      .setColor(member?.displayHexColor || 0x5865F2)
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: '🆔 ID',            value: user.id,                                                    inline: true },
        { name: '🤖 Bot ?',          value: user.bot ? 'Oui' : 'Non',                                  inline: true },
        { name: '📅 Compte créé',    value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,        inline: true },
        { name: '📥 A rejoint',      value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Inconnu', inline: true },
        { name: `🎭 Rôles (${member?.roles.cache.size - 1 || 0})`, value: roles },
      )
      .setTimestamp();

    if (member?.premiumSinceTimestamp) {
      embed.addFields({ name: '💎 Booster depuis', value: `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`, inline: true });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
