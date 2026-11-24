// commands/moderation/timeout.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { mod, error } = require("../../utils/embeds");
const { sendLog } = require("../../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("⏱️ Met un membre en timeout (isolation temporaire) !")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((o) =>
      o
        .setName("membre")
        .setDescription("Membre à mettre en timeout")
        .setRequired(true),
    )
    .addIntegerOption((o) =>
      o
        .setName("minutes")
        .setDescription("Durée en minutes (1-40320)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(40320),
    )
    .addStringOption((o) =>
      o
        .setName("raison")
        .setDescription("Raison du timeout")
        .setRequired(false),
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("membre");
    const minutes = interaction.options.getInteger("minutes");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";
    if (!member)
      return interaction.reply({
        embeds: [error("Introuvable", "Ce membre n'est pas sur le serveur.")],
        ephemeral: true,
      });
    if (!member.moderatable)
      return interaction.reply({
        embeds: [error("Impossible", "Je ne peux pas modérer ce membre.")],
        ephemeral: true,
      });
    try {
      await member.timeout(minutes * 60 * 1000, raison);
      const durStr =
        minutes >= 60
          ? `${Math.floor(minutes / 60)}h${minutes % 60}min`
          : `${minutes}min`;
      await interaction.reply({
        embeds: [
          mod("Timeout", member.user, interaction.user.tag, raison, {
            duration: durStr,
          }),
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
