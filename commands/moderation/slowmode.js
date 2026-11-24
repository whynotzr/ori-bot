// commands/moderation/slowmode.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { success, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("🐢 Active ou désactive le mode lent dans un salon !")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption((o) =>
      o
        .setName("secondes")
        .setDescription("0 = désactiver, sinon délai en secondes (max 21600)")
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600),
    ),
  async execute(interaction) {
    const secondes = interaction.options.getInteger("secondes");
    try {
      await interaction.channel.setRateLimitPerUser(secondes);
      const msg =
        secondes === 0
          ? "Slowmode désactivé."
          : `Slowmode activé : **${secondes}s** entre chaque message.`;
      await interaction.reply({ embeds: [success("🐢 Slowmode", msg)] });
    } catch (e) {
      await interaction.reply({
        embeds: [error("Erreur", e.message)],
        ephemeral: true,
      });
    }
  },
};
