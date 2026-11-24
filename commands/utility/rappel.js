// commands/utility/rappel.js
const { SlashCommandBuilder } = require("discord.js");
const { success, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rappel")
    .setDescription("⏰ Crée un rappel pour toi !")
    .addIntegerOption((o) =>
      o
        .setName("minutes")
        .setDescription("Dans combien de minutes ?")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440),
    )
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("Le message du rappel")
        .setRequired(true),
    ),
  cooldown: 5,
  async execute(interaction) {
    const minutes = interaction.options.getInteger("minutes");
    const message = interaction.options.getString("message");
    await interaction.reply({
      embeds: [
        success(
          "⏰ Rappel créé",
          `Je te rappellerai **${message}** dans **${minutes} minute(s)**.`,
        ),
      ],
    });
    setTimeout(
      async () => {
        try {
          await interaction.user.send({
            embeds: [
              success(
                "⏰ Rappel !",
                `Tu m'avais demandé de te rappeler :\n> **${message}**`,
              ),
            ],
          });
        } catch {
          await interaction.followUp({
            content: `⏰ <@${interaction.user.id}> Rappel : **${message}**`,
          });
        }
      },
      minutes * 60 * 1000,
    );
  },
};
