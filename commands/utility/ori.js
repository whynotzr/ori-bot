const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kyoto")
    .setDescription(
      "🌸 Génère une invitation à copier-coller pour le serveur !",
    ),

  async execute(interaction) {
    const { guild, channel, member } = interaction;

    // 1. CRÉATION DE L'INVITATION DISCORD (Valide 24h, utilisations infinies)
    const invite = await channel
      .createInvite({
        maxAge: 86400,
        maxUses: 0,
        unique: true,
        reason: `Invitation générée par ${member.user.username} via /kyoto`,
      })
      .catch((err) => {
        console.error(err);
        return null;
      });

    if (!invite) {
      return interaction.reply({
        content:
          "❌ Impossible de créer une invitation. Vérifie mes permissions dans ce salon !",
        ephemeral: true,
      });
    }

    // 2. CRÉATION DE L'EMBED
    const inviteEmbed = new EmbedBuilder()
      .setColor(0xf47fff)
      .setTitle(`⛩️ REJOINS LE SERVEUR ${guild.name.toUpperCase()} !`)
      .setDescription(
        `✨ **Envie de partager le serveur avec tes potes ?**\n` +
          `Copie le lien ci-dessous pour l'envoyer où tu veux (Discord, SMS, Insta...) !\n\n` +
          `🔗 **Lien cliquable :**\n${invite.url}\n\n` +
          `📋 **Lien facile à copier (clique dessus) :**\n\`${invite.url}\`\n\n` +
          `*Cette invitation est valide pendant 24h.*`,
      )
      // Tes images personnalisées
      .setThumbnail("https://i.imgur.com/zjcABhM.png")
      .setImage("https://i.imgur.com/pQWmS7V.gif")
      .setTimestamp()
      .setFooter({
        text: `Généré par ${member.user.username} 🌸`,
        iconURL: member.user.displayAvatarURL({ dynamic: true }),
      });

    // 3. LE BOUTON (On le garde quand même, c'est toujours propre !)
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Rejoindre Kyoto 🧊")
        .setStyle(ButtonStyle.Link)
        .setURL(invite.url),
    );

    return interaction.reply({ embeds: [inviteEmbed], components: [row] });
  },
};
