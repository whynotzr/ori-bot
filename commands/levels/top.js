// levels/top.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// Importe ta base de données pour récupérer les tops (exemple générique)
// const { getTopUsers } = require('../utils/ranking');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription(
      "🏆 Affiche le classement des membres les plus actifs du serveur",
    ),

  async execute(interaction) {
    await interaction.deferReply();

    // Exemple : const topList = await getTopUsers(interaction.guild.id, 10);
    // Simulation pour l'exemple :
    const topList = [{ userId: interaction.user.id, level: 15, xp: 4500 }];

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle(`🏆 Classement XP - ${interaction.guild.name}`)
      .setDescription(
        topList
          .map(
            (user, index) =>
              `**#${index + 1}** | <@${user.userId}> — Niveau **${user.level}** (${user.xp.toLocaleString()} XP)`,
          )
          .join("\n"),
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
