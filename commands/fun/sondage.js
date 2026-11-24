const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sondage")
    .setDescription("Pose une question à la communauté")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Ta question")
        .setRequired(true),
    ),

  async execute(interaction) {
    const question = interaction.options.getString("question");

    const embed = new EmbedBuilder()
      .setColor(0x00d4ff) // Couleur Bleu Gaming
      .setTitle("📊 Sondage")
      .setDescription(
        `**${question}**\n\nRépondez via les boutons ci-dessous !`,
      )
      .setFooter({ text: `Sondage lancé par ${interaction.user.username}` });

    // Remplace la partie "const row" dans ton fichier sondage.js par celle-ci :
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("vote_oui") // CORRIGÉ : Doit correspondre à interactionCreate.js
        .setLabel("Oui")
        .setStyle(ButtonStyle.Success)
        .setEmoji("✅"),
      new ButtonBuilder()
        .setCustomId("vote_non") // CORRIGÉ : Doit correspondre à interactionCreate.js
        .setLabel("Non")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("❌"),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
