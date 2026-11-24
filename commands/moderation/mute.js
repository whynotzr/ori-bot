// commands/moderation/mute.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { mod, error } = require('../../utils/embeds');
const { sendLog } = require('../../utils/logger');

const DURATIONS = {
  '60':    '1 minute',
  '300':   '5 minutes',
  '600':   '10 minutes',
  '1800':  '30 minutes',
  '3600':  '1 heure',
  '21600': '6 heures',
  '86400': '1 jour',
  '604800':'7 jours',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🔇 Mettre un membre en timeout')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à mute').setRequired(true))
    .addStringOption(o => o.setName('durée')
      .setDescription('Durée du mute')
      .setRequired(true)
      .addChoices(
        { name: '1 minute',  value: '60' },
        { name: '5 minutes', value: '300' },
        { name: '10 minutes',value: '600' },
        { name: '30 minutes',value: '1800' },
        { name: '1 heure',   value: '3600' },
        { name: '6 heures',  value: '21600' },
        { name: '1 jour',    value: '86400' },
        { name: '7 jours',   value: '604800' },
      ))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false)),

  async execute(interaction) {
    const target  = interaction.options.getMember('membre');
    const seconds = parseInt(interaction.options.getString('durée'));
    const raison  = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Membre introuvable.')], ephemeral: true });
    if (!target.moderatable) return interaction.reply({ embeds: [error('Impossible', 'Je ne peux pas mute ce membre.')], ephemeral: true });

    const duration = DURATIONS[String(seconds)] || `${seconds}s`;
    await target.timeout(seconds * 1000, raison);
    await interaction.reply({ embeds: [mod('Mute (Timeout)', target.user, interaction.user.tag, raison, { duration })] });
    sendLog(interaction.guild, 'Mute', `**${target.user.tag}** a été mute (${duration}) par **${interaction.user.tag}**.\n**Raison :** ${raison}`, 0xFF6B35);
  }
};
