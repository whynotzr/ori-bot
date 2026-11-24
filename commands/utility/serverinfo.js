// commands/utility/serverinfo.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('🌐 Afficher les informations du serveur'),

  async execute(interaction) {
    const guild = interaction.guild;
    await guild.fetch();

    const totalChannels = guild.channels.cache.size;
    const textChannels  = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const boosts        = guild.premiumSubscriptionCount || 0;
    const boostTier     = ['Aucun', 'Niveau 1', 'Niveau 2', 'Niveau 3'][guild.premiumTier] || 'Inconnu';

    const embed = new EmbedBuilder()
      .setColor(0xFF0080)
      .setTitle(`🌸 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: '🆔 ID',            value: guild.id,                                                      inline: true },
        { name: '👑 Propriétaire',   value: `<@${guild.ownerId}>`,                                        inline: true },
        { name: '📅 Créé le',        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,         inline: true },
        { name: '👥 Membres',        value: guild.memberCount.toString(),                                  inline: true },
        { name: '💬 Salons',         value: `📝 ${textChannels} • 🔊 ${voiceChannels} • Total: ${totalChannels}`, inline: true },
        { name: '🎭 Rôles',          value: guild.roles.cache.size.toString(),                             inline: true },
        { name: '💎 Boosts',         value: `${boosts} boosts (${boostTier})`,                            inline: true },
        { name: '😀 Emojis',         value: guild.emojis.cache.size.toString(),                           inline: true },
      )
      .setTimestamp()
      .setFooter({ text: '🌸 Anime & Gaming Bot' });

    if (guild.bannerURL()) embed.setImage(guild.bannerURL({ size: 1024 }));

    await interaction.reply({ embeds: [embed] });
  }
};
