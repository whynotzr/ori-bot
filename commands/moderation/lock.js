// commands/moderation/lock.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🔒 Verrouiller un salon (personne ne peut écrire)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(o => o.setName('salon').setDescription('Salon à verrouiller (défaut: salon actuel)').setRequired(false))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('salon') || interaction.channel;
    const raison  = interaction.options.getString('raison') || 'Aucune raison';

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
      await interaction.reply({ embeds: [success('Salon verrouillé 🔒', `${channel} est maintenant verrouillé.\n**Raison :** ${raison}`)] });
    } catch (e) {
      await interaction.reply({ embeds: [error('Erreur', e.message)], ephemeral: true });
    }
  }
};
