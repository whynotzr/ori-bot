// commands/moderation/untimeout.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { success, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription('✅ Lève le timeout d"un membre !')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) =>
      o.setName("membre").setDescription("Membre à libérer").setRequired(true),
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("membre");
    if (!member)
      return interaction.reply({
        embeds: [error("Introuvable", "Ce membre n'est pas sur le serveur.")],
        ephemeral: true,
      });
    try {
      await member.timeout(null);
      await interaction.reply({
        embeds: [
          success(
            "✅ Timeout levé",
            `Le timeout de **${member.user.tag}** a été retiré.`,
          ),
        ],
      });
    } catch (e) {
      await interaction.reply({
        embeds: [error("Erreur", e.message)],
        ephemeral: true,
      });
    }
  },
};
