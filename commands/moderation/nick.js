// commands/moderation/nick.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { success, error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('✏️ Changer le pseudo d\'un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(o => o.setName('membre').setDescription('Membre cible').setRequired(true))
    .addStringOption(o => o.setName('pseudo').setDescription('Nouveau pseudo (laisser vide pour réinitialiser)').setRequired(false).setMaxLength(32)),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const pseudo = interaction.options.getString('pseudo');

    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Ce membre n\'est pas sur le serveur.')], ephemeral: true });
    if (!target.manageable) return interaction.reply({ embeds: [error('Impossible', 'Je ne peux pas modifier le pseudo de ce membre (rôle trop élevé).')], ephemeral: true });

    try {
      const ancien = target.displayName;
      await target.setNickname(pseudo || null);
      await interaction.reply({
        embeds: [success('✏️ Pseudo modifié', pseudo
          ? `**${ancien}** s'appelle maintenant **${pseudo}**.`
          : `Le pseudo de **${ancien}** a été réinitialisé.`)]
      });
    } catch (e) {
      await interaction.reply({ embeds: [error('Erreur', e.message)], ephemeral: true });
    }
  }
};
