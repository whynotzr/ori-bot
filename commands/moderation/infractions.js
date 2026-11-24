// commands/moderation/infractions.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getWarns } = require('../../utils/warnsDB');
const { error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('infractions')
    .setDescription('📋 Affiche l\'historique complet des sanctions d\'un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à inspecter').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const member = interaction.options.getMember('membre');

    // Récupère les warns depuis la DB existante
    const warns = getWarns(interaction.guild.id, target.id);

    // Récupère les bans actifs
    let estBanni = false;
    try {
      const ban = await interaction.guild.bans.fetch(target.id);
      if (ban) estBanni = true;
    } catch { /* pas banni */ }

    // Vérifie si en timeout
    const enTimeout = member?.communicationDisabledUntilTimestamp > Date.now();

    const embed = new EmbedBuilder()
      .setColor(warns.length > 0 ? 0xFF6B35 : 0x57F287)
      .setTitle(`📋 Infractions de ${target.tag}`)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: `ID : ${target.id} • 🌸 Anime & Gaming Bot` });

    // Statut actuel
    const statuts = [];
    if (estBanni) statuts.push('🔨 **Banni**');
    if (enTimeout) statuts.push(`⏱️ **En timeout** jusqu'au <t:${Math.floor(member.communicationDisabledUntilTimestamp / 1000)}:R>`);
    if (!estBanni && !enTimeout) statuts.push('✅ Aucune sanction active');

    embed.addFields({ name: '📌 Statut actuel', value: statuts.join('\n') });

    // Warns
    if (warns.length === 0) {
      embed.addFields({ name: `⚠️ Avertissements (0)`, value: 'Aucun avertissement.' });
    } else {
      const warnList = warns.slice(-10).reverse().map((w, i) => {
        const date = new Date(w.timestamp);
        const ts = Math.floor(date.getTime() / 1000);
        return `**#${warns.length - i}** • <t:${ts}:d> — ${w.reason}\n└ Par <@${w.moderatorId}>`;
      }).join('\n\n');

      embed.addFields({
        name: `⚠️ Avertissements (${warns.length})`,
        value: warnList.slice(0, 1024) + (warns.length > 10 ? `\n*... et ${warns.length - 10} de plus*` : '')
      });
    }

    embed.addFields({ name: '📊 Résumé', value: `Warns totaux : **${warns.length}**`, inline: true });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
