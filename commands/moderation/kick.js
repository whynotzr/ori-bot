// commands/moderation/kick.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { mod, error } = require('../../utils/embeds');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Expulser un membre du serveur')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à expulser').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du kick').setRequired(false)),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';

    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Ce membre n\'est pas sur le serveur.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [error('Erreur', 'Tu ne peux pas te kick toi-même.')], ephemeral: true });
    if (!target.kickable) return interaction.reply({ embeds: [error('Impossible', 'Je ne peux pas kick ce membre.')], ephemeral: true });

    try {
      await target.send({ embeds: [new EmbedBuilder().setColor(0xFF6B35).setTitle('👢 Tu as été expulsé').setDescription(`**Serveur :** ${interaction.guild.name}\n**Raison :** ${raison}`)] }).catch(() => {});
      await target.kick(raison);
      await interaction.reply({ embeds: [mod('Kick', target.user, interaction.user.tag, raison)] });
      sendLog(interaction.guild, 'Kick', `**${target.user.tag}** a été expulsé par **${interaction.user.tag}**.\n**Raison :** ${raison}`, 0xFF6B35);
    } catch (e) {
      await interaction.reply({ embeds: [error('Erreur', e.message)], ephemeral: true });
    }
  }
};
