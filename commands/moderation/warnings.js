// commands/moderation/warnings.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getWarns, clearWarns } = require('../../utils/warnsDB');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('📋 Voir / gérer les avertissements d\'un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(s => s.setName('liste').setDescription('Voir les warns').addUserOption(o => o.setName('membre').setDescription('Membre').setRequired(true)))
    .addSubcommand(s => s.setName('clear').setDescription('Supprimer tous les warns').addUserOption(o => o.setName('membre').setDescription('Membre').setRequired(true))),

  async execute(interaction) {
    const sub    = interaction.options.getSubcommand();
    const target = interaction.options.getUser('membre');

    if (sub === 'liste') {
      const warns = getWarns(interaction.guildId, target.id);
      if (warns.length === 0) {
        return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x57F287).setDescription(`✅ **${target.tag}** n'a aucun avertissement.`)] });
      }
      // Discord limite un embed à 25 champs max : on affiche les 25 plus récents
      const displayed = warns.slice(-25).reverse();
      const fields = displayed.map((w, i) => ({
        name: `⚠️ Warn #${warns.length - i} — ID: ${w.id}`,
        value: `**Raison :** ${w.reason}\n**Modérateur :** <@${w.moderatorId}>\n**Date :** <t:${Math.floor(new Date(w.timestamp).getTime() / 1000)}:R>`,
      }));
      const embed = new EmbedBuilder().setColor(0xFEE75C).setTitle(`⚠️ Warns de ${target.tag} (${warns.length})`).addFields(fields);
      if (warns.length > 25) embed.setFooter({ text: `Affichage des 25 warns les plus récents sur ${warns.length}.` });
      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'clear') {
      clearWarns(interaction.guildId, target.id);
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x57F287).setDescription(`✅ Tous les warns de **${target.tag}** ont été supprimés.`)] });
    }
  }
};
