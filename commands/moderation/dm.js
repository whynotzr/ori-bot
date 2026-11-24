// commands/moderation/dm.js
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { success, error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('📩 Envoie un DM à un membre via le bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(o => o.setName('membre').setDescription('Membre à contacter').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Message à envoyer').setRequired(true).setMaxLength(1800)),

  async execute(interaction) {
    const target = interaction.options.getUser('membre');
    const message = interaction.options.getString('message');

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📩 Message de ${interaction.guild.name}`)
      .setDescription(message)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: `Envoyé par ${interaction.user.tag}` })
      .setTimestamp();

    try {
      await target.send({ embeds: [embed] });
      await interaction.reply({
        embeds: [success('📩 DM envoyé', `Message envoyé à **${target.tag}** avec succès.`)],
        ephemeral: true
      });
    } catch {
      await interaction.reply({
        embeds: [error('Échec', `Impossible d'envoyer un DM à **${target.tag}**.\nIl a peut-être les DMs désactivés.`)],
        ephemeral: true
      });
    }
  }
};
