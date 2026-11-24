// commands/moderation/unlock.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🔓 Déverrouiller un salon')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(o => o.setName('salon').setDescription('Salon à déverrouiller (défaut: actuel)').setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('salon') || interaction.channel;
    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
      await interaction.reply({ embeds: [success('Salon déverrouillé 🔓', `${channel} est de nouveau accessible à tous.`)] });
    } catch (e) {
      await interaction.reply({ embeds: [error('Erreur', e.message)], ephemeral: true });
    }
  }
};
