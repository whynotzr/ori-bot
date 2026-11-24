// commands/moderation/ban.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { mod, error } = require('../../utils/embeds');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🔨 Bannir un membre du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à bannir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du ban').setRequired(false))
    .addIntegerOption(o => o.setName('jours').setDescription('Jours de messages à supprimer (0-7)').setMinValue(0).setMaxValue(7).setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    const jours  = interaction.options.getInteger('jours') || 0;

    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Ce membre n\'est pas sur le serveur.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [error('Erreur', 'Tu ne peux pas te bannir toi-même.')], ephemeral: true });
    if (!target.bannable) return interaction.reply({ embeds: [error('Impossible', 'Je ne peux pas bannir ce membre (rôle trop élevé).')], ephemeral: true });

    try {
      await target.send({ embeds: [new EmbedBuilder().setColor(0xED4245).setTitle('🔨 Tu as été banni').setDescription(`**Serveur :** ${interaction.guild.name}\n**Raison :** ${raison}\n**Modérateur :** ${interaction.user.tag}`)] }).catch(() => {});
      await target.ban({ deleteMessageSeconds: jours * 86400, reason: raison });
      await interaction.reply({ embeds: [mod('Ban', target.user, interaction.user.tag, raison)] });
      sendLog(interaction.guild, 'Ban', `**${target.user.tag}** a été banni par **${interaction.user.tag}**.\n**Raison :** ${raison}`, 0xED4245);
    } catch (e) {
      await interaction.reply({ embeds: [error('Erreur', e.message)], ephemeral: true });
    }
  }
};
