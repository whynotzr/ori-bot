// commands/reaction_roles/reactionroles.js
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const { setPanel } = require("../../utils/reactionRolesDB");

// Mémoire cache temporaire pour stocker le panel en cours et ses rôles
const activePanels = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionroles")
    .setDescription(
      "🎭 Gère tes panels de rôles à boutons de manière illimitée",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)

    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Crée l'embed de base du panel de rôles")
        .addStringOption((o) =>
          o.setName("titre").setDescription("Titre du panel").setRequired(true),
        )
        .addStringOption((o) =>
          o
            .setName("description")
            .setDescription("Description principale")
            .setRequired(true),
        )
        .addStringOption((o) =>
          o
            .setName("couleur")
            .setDescription("Couleur de l'embed")
            .setRequired(false)
            .addChoices(
              { name: "🌸 Rose Anime", value: "FF0080" },
              { name: "💙 Bleu Gaming", value: "00D4FF" },
              { name: "💜 Violet", value: "9B59B6" },
              { name: "✨ Or", value: "FFD700" },
            ),
        )
        .addStringOption((o) =>
          o
            .setName("image")
            .setDescription("Bannière (URL)")
            .setRequired(false),
        )
        .addStringOption((o) =>
          o
            .setName("thumbnail")
            .setDescription("Miniature (URL)")
            .setRequired(false),
        ),
    )

    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Ajoute un bouton/rôle au dernier panel créé")
        .addRoleOption((o) =>
          o
            .setName("role")
            .setDescription("Le rôle à attribuer")
            .setRequired(true),
        )
        .addStringOption((o) =>
          o
            .setName("label")
            .setDescription("Le texte affiché sur le bouton")
            .setRequired(true),
        )
        .addStringOption((o) =>
          o
            .setName("emoji")
            .setDescription("L'émoji du bouton (ex: 🌸)")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;

    if (subcommand === "create") {
      const titre = interaction.options.getString("titre");
      const description = interaction.options
        .getString("description")
        .replace(/\\n/g, "\n");
      const couleur = interaction.options.getString("couleur") || "FF0080";
      const imageUrl = interaction.options.getString("image");
      const thumbUrl = interaction.options.getString("thumbnail");

      const embed = new EmbedBuilder()
        .setColor(parseInt(couleur, 16))
        .setTitle(titre)
        .setDescription(description);

      if (imageUrl) embed.setImage(imageUrl);
      if (thumbUrl) embed.setThumbnail(thumbUrl);

      const msg = await interaction.channel.send({
        embeds: [embed],
        components: [],
      });

      // On initialise le stockage en mémoire pour ce serveur
      activePanels.set(guildId, {
        messageId: msg.id,
        channelId: interaction.channelId,
        roles: [],
      });

      // Sauvegarde initiale vide dans ta DB
      setPanel(msg.id, {
        guildId: guildId,
        channelId: interaction.channelId,
        roles: [],
      });

      await interaction.editReply({
        content: `✅ Panel de base créé avec succès ! Utilise maintenant \`/reactionroles add\` pour y ajouter tes rôles un par un.`,
      });
    } else if (subcommand === "add") {
      const panelData = activePanels.get(guildId);
      if (!panelData) {
        return interaction.editReply({
          content:
            "❌ Aucun panel récent trouvé. Crée d'abord un panel avec `/reactionroles create`.",
        });
      }

      const role = interaction.options.getRole("role");
      const label = interaction.options.getString("label");
      const emoji = interaction.options.getString("emoji");

      if (panelData.roles.length >= 25) {
        return interaction.editReply({
          content: "❌ Ce panel a atteint la limite maximale de 25 rôles !",
        });
      }

      // On ajoute le rôle à la liste en mémoire
      panelData.roles.push({ roleId: role.id, label, emoji });

      try {
        const channel = await interaction.guild.channels.fetch(
          panelData.channelId,
        );
        const msg = await channel.messages.fetch(panelData.messageId);

        // Création des boutons (maximum 5 par ligne)
        const buttons = panelData.roles.map((r) =>
          new ButtonBuilder()
            .setCustomId(`rr_${r.roleId}`)
            .setLabel(r.label)
            .setEmoji(r.emoji)
            .setStyle(ButtonStyle.Secondary),
        );

        const rows = [];
        for (let i = 0; i < buttons.length; i += 5) {
          rows.push(
            new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)),
          );
        }

        // Mise à jour du message Discord
        await msg.edit({
          embeds: [msg.embeds[0]],
          components: rows,
        });

        // Mise à jour de la base de données
        setPanel(msg.id, {
          guildId: guildId,
          channelId: panelData.channelId,
          roles: panelData.roles,
        });

        await interaction.editReply({
          content: `✅ Rôle **${role.name}** (${label}) ajouté avec succès ! (Total : ${panelData.roles.length} rôle(s))`,
        });
      } catch (err) {
        console.error(err);
        return interaction.editReply({
          content: "❌ Erreur : Impossible de modifier le message.",
        });
      }
    }
  },
};
