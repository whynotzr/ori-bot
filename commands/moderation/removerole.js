// commands/moderation/removerole.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { success, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription('🎭 Retire un rôle d"un membre !')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) =>
      o.setName("membre").setDescription("Membre cible").setRequired(true),
    )
    .addRoleOption((o) =>
      o.setName("role").setDescription("Rôle à retirer").setRequired(true),
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("membre");
    const role = interaction.options.getRole("role");
    if (!member)
      return interaction.reply({
        embeds: [error("Introuvable", "Ce membre n'est pas sur le serveur.")],
        ephemeral: true,
      });
    try {
      await member.roles.remove(role);
      await interaction.reply({
        embeds: [
          success(
            "🎭 Rôle retiré",
            `${role} a été retiré à ${member.user.tag}.`,
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
