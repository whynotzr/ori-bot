// commands/fun/calcul.js
const { SlashCommandBuilder } = require("discord.js");
const { fun, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("calcul")
    .setDescription("🧮 Effectue un calcul mathématique simple !")
    .addStringOption((o) =>
      o
        .setName("expression")
        .setDescription("Ex: 2+2, 10*5, 100/4")
        .setRequired(true),
    ),
  cooldown: 2,
  async execute(interaction) {
    const expr = interaction.options.getString("expression");
    // Sécuriser : uniquement chiffres et opérateurs de base
    if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(expr)) {
      return interaction.reply({
        embeds: [
          error(
            "Expression invalide",
            "Utilise uniquement des chiffres et opérateurs (+, -, *, /).",
          ),
        ],
        ephemeral: true,
      });
    }
    try {
      const result = Function(`"use strict"; return (${expr})`)();
      await interaction.reply({
        embeds: [fun("🧮 Calcul", `\`${expr}\` = **${result}**`, 0x00d4ff)],
      });
    } catch {
      await interaction.reply({
        embeds: [error("Erreur", "Expression invalide ou division par zéro.")],
        ephemeral: true,
      });
    }
  },
};
