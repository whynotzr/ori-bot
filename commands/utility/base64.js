// commands/utility/base64.js
const { SlashCommandBuilder } = require("discord.js");
const { fun, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("base64")
    .setDescription("🔐 Encode ou décode du texte en Base64 !")
    .addStringOption((o) =>
      o
        .setName("mode")
        .setDescription("Encoder ou décoder")
        .setRequired(true)
        .addChoices(
          { name: "🔒 Encoder", value: "encode" },
          { name: "🔓 Décoder", value: "decode" },
        ),
    )
    .addStringOption((o) =>
      o.setName("texte").setDescription("Texte à traiter").setRequired(true),
    ),
  cooldown: 3,
  async execute(interaction) {
    const mode = interaction.options.getString("mode");
    const texte = interaction.options.getString("texte");
    try {
      const result =
        mode === "encode"
          ? Buffer.from(texte).toString("base64")
          : Buffer.from(texte, "base64").toString("utf-8");
      await interaction.reply({
        embeds: [
          fun(
            `🔐 Base64 — ${mode === "encode" ? "Encodé" : "Décodé"}`,
            `**Entrée :** \`${texte.slice(0, 100)}\`\n**Résultat :** \`${result.slice(0, 200)}\``,
            0x00d4ff,
          ),
        ],
      });
    } catch {
      await interaction.reply({
        embeds: [error("Erreur", "Texte invalide pour le décodage Base64.")],
        ephemeral: true,
      });
    }
  },
};
