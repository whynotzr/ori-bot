const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { sendLog } = require("../../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anonyme")
    .setDescription("Envoie un message anonyme dans un salon choisi")
    // Réservé aux membres de confiance : évite les abus (harcèlement anonyme,
    // spam de mentions...) puisque le message est envoyé sans indiquer l'auteur.
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption((option) =>
      option
        .setName("cible")
        .setDescription("La personne à mentionner")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("Le message à envoyer")
        .setRequired(true)
        .setMaxLength(1000),
    )
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Le salon où envoyer le message")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true),
    ),

  async execute(interaction) {
    const cible = interaction.options.getUser("cible");
    const message = interaction.options.getString("message");
    const salon = interaction.options.getChannel("salon");

    const perms = salon.permissionsFor(interaction.guild.members.me);
    if (!perms?.has(PermissionFlagsBits.SendMessages)) {
      return interaction.reply({
        content: "❌ Je n'ai pas la permission d'envoyer des messages dans ce salon.",
        ephemeral: true,
      });
    }

    await salon.send(`${cible}, ${message}`);

    // Le message est anonyme pour les membres, mais on garde une trace en interne
    // pour la modération (l'auteur réel est loggué, pas affiché publiquement).
    sendLog(
      interaction.guild,
      "Message anonyme",
      `**Auteur réel :** ${interaction.user.tag} (${interaction.user.id})\n**Salon :** ${salon}\n**Cible :** ${cible.tag}\n**Message :** ${message}`,
      0x5865F2,
    );

    await interaction.reply({
      content: `✅ Message envoyé discrètement dans ${salon}.`,
      ephemeral: true,
    });
  },
};
