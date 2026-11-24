// commands/moderation/addrole.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { success, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("🎭 Donne un rôle à un membre !")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption((o) =>
      o.setName("membre").setDescription("Membre cible").setRequired(true),
    )
    .addRoleOption((o) =>
      o.setName("role").setDescription("Rôle à attribuer").setRequired(true),
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("membre");
    const role = interaction.options.getRole("role");
    if (!member)
      return interaction.reply({
        embeds: [error("Introuvable", "Ce membre n'est pas sur le serveur.")],
        ephemeral: true,
      });
    if (role.position >= interaction.guild.members.me.roles.highest.position)
      return interaction.reply({
        embeds: [error("Impossible", "Ce rôle est plus élevé que le mien.")],
        ephemeral: true,
      });
    try {
      await member.roles.add(role);
      await interaction.reply({
        embeds: [
          success(
            "🎭 Rôle ajouté",
            `${role} a été ajouté à ${member.user.tag}.`,
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
