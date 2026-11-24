// commands/moderation/testboost.js
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("testboost")
    .setDescription("🧪 Test direct de l'embed de Boost (Admin)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const member = interaction.member;
    const guild = interaction.guild;

    await interaction.reply({
      content: "🔮 Génération de l'embed de test...",
      ephemeral: true,
    });

    // On crée EXACTEMENT le même embed que dans ton fichier de boost
    const boostEmbed = new EmbedBuilder()
      .setColor(0xf47fff)
      .setTitle(`🔮 UN IMMENSE MERCI POUR TON BOOST !`)
      // TON TEXTE COMPLET EST DE RETOUR ICI :
      .setDescription(
        `✨ Oh wow ! **${member.user.username}**, tu viens de booster **${guild.name}** !\n\nToute l'équipe et la communauté te remercient du fond du cœur. Grâce à toi, le serveur évolue et débloque de super avantages !`,
      )

      // Les bonnes images qui fonctionnent chez toi
      .setThumbnail("https://i.imgur.com/zjcABhM.png")
      .setImage("https://i.imgur.com/pQWmS7V.gif")

      .setTimestamp()
      .setFooter({
        text: `${guild.name} t'aime fort 💖`,
        iconURL: guild.iconURL(),
      });
    // On tente de t'envoyer le MP directement
    try {
      await member.send({ embeds: [boostEmbed] });
      await interaction.followUp({
        content: "✅ Reçu en MP ! Vérifie tes messages privés ! 📬",
        ephemeral: true,
      });
    } catch (error) {
      // Si tes MP sont fermés, on l'envoie directement dans le salon où tu as tapé la commande !
      await interaction.channel.send({
        content: `💖 🎉 **${member.user.username}** vient de booster le serveur ! (Test salon public - MP fermés) `,
        embeds: [boostEmbed],
      });
      await interaction.followUp({
        content:
          "⚠️ Tes MP sont fermés ! L'embed a été envoyé juste au-dessus dans ce salon. 👇",
        ephemeral: true,
      });
    }
  },
};
