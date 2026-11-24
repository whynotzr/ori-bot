// commands/moderation/unban.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embeds');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('✅ Débannir un utilisateur par son ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('userid').setDescription('ID Discord de l\'utilisateur').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du déban').setRequired(false)),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    try {
      const ban = await interaction.guild.bans.fetch(userId);
      await interaction.guild.members.unban(userId, raison);
      await interaction.reply({ embeds: [success('Déban effectué', `**${ban.user.tag}** a été débanni.\n**Raison :** ${raison}`)] });
      sendLog(interaction.guild, 'Unban', `**${ban.user.tag}** a été débanni par **${interaction.user.tag}**.`, 0x57F287);
    } catch {
      await interaction.reply({ embeds: [error('Erreur', 'Cet utilisateur n\'est pas banni ou l\'ID est invalide.')], ephemeral: true });
    }
  }
};
