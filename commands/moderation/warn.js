// commands/moderation/warn.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { addWarn } = require('../../utils/warnsDB');
const { mod, error } = require('../../utils/embeds');
const { sendLog } = require('../../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Avertir un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison de l\'avertissement').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('membre');
    const raison = interaction.options.getString('raison');

    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Membre introuvable.')], ephemeral: true });

    const warn = addWarn(interaction.guildId, target.id, raison, interaction.user.id);

    // Notifier en DM
    await target.send({ embeds: [new EmbedBuilder()
      .setColor(0xFEE75C)
      .setTitle('⚠️ Tu as reçu un avertissement')
      .setDescription(`**Serveur :** ${interaction.guild.name}\n**Raison :** ${raison}\n**Modérateur :** ${interaction.user.tag}`)
    ]}).catch(() => {});

    await interaction.reply({ embeds: [mod('Avertissement', target.user, interaction.user.tag, raison)] });
    sendLog(interaction.guild, 'Warn', `**${target.user.tag}** a reçu un avertissement de **${interaction.user.tag}**.\n**Raison :** ${raison}`, 0xFEE75C);
  }
};
