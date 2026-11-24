// events/guildMemberUpdate.js
// Détecte automatiquement un boost de serveur (premiumSince passe de null -> une date)
// et envoie l'embed de remerciement + attribue le rôle de booster, sans avoir besoin
// de lancer /testboost manuellement.
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    // Un boost démarre quand premiumSinceTimestamp passe de null/undefined à une valeur
    const startedBoosting =
      !oldMember.premiumSinceTimestamp && newMember.premiumSinceTimestamp;
    if (!startedBoosting) return;

    const guild = newMember.guild;

    // ID du rôle offert aux boosters (configurable via .env, sinon valeur par défaut du serveur)
    const roleId = process.env.BOOST_ROLE_ID || "1375588873567993877";
    const role = guild.roles.cache.get(roleId);
    if (role) {
      await newMember.roles.add(role).catch((err) => {
        console.error(
          "[Boost] Impossible d'attribuer le rôle de booster :",
          err.message,
        );
      });
    }

    const boostEmbed = new EmbedBuilder()
      .setColor(0xf47fff)
      .setTitle("🔮 UN IMMENSE MERCI POUR TON BOOST !")
      .setDescription(
        `✨ Oh wow ! **${newMember.user.username}**, tu viens de booster **${guild.name}** !\n\nToute l'équipe et la communauté te remercient du fond du cœur. Grâce à toi, le serveur évolue et débloque de super avantages !`,
      )
      .setThumbnail("https://i.imgur.com/zjcABhM.png")
      .setImage("https://i.imgur.com/pQWmS7V.gif")
      .setTimestamp()
      .setFooter({
        text: `${guild.name} t'aime fort 💖`,
        iconURL: guild.iconURL(),
      });

    try {
      await newMember.send({ embeds: [boostEmbed] });
    } catch {
      // MP fermés -> on annonce dans le salon système du serveur (ou le salon de bienvenue en fallback)
      const fallbackChannel =
        guild.systemChannel ||
        guild.channels.cache.get(process.env.MOD_LOG_CHANNEL) ||
        null;
      if (fallbackChannel) {
        await fallbackChannel
          .send({
            content: `💖 🎉 **${newMember.user.username}** vient de booster le serveur !`,
            embeds: [boostEmbed],
          })
          .catch(() => {});
      }
    }
  },
};
