// commands/moderation/unmute.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { mod, error } = require('../../utils/embeds');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔊 Retirer le timeout d\'un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à unmute').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Membre introuvable.')], ephemeral: true });
    await target.timeout(null);
    await interaction.reply({ embeds: [mod('Unmute', target.user, interaction.user.tag, 'Timeout retiré')] });
    sendLog(interaction.guild, 'Unmute', `Le timeout de **${target.user.tag}** a été retiré par **${interaction.user.tag}**.`, 0x57F287);
  }
};
