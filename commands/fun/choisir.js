// commands/fun/choisir.js
const { SlashCommandBuilder } = require("discord.js");
const { fun } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("choisir")
    .setDescription("🎲 Laisse le bot choisir entre plusieurs options !")
    .addStringOption((o) =>
      o
        .setName("options")
        .setDescription(
          "Sépare les choix par une virgule. Ex: pizza, burger, sushi",
        )
        .setRequired(true),
    ),
  cooldown: 3,
  async execute(interaction) {
    const raw = interaction.options.getString("options");
    const choices = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (choices.length < 2) {
      return interaction.reply({
        embeds: [
          fun(
            "🎲 Choisir",
            "Donne au moins 2 options séparées par une virgule !",
            0xed4245,
          ),
        ],
        ephemeral: true,
      });
    }
    const choix = choices[Math.floor(Math.random() * choices.length)];
    await interaction.reply({
      embeds: [
        fun(
          "🎲 Le bot a choisi…",
          `➡️ **${choix}**\n\n*Parmi : ${choices.join(", ")}*`,
          0xff73fa,
        ),
      ],
    });
  },
};
