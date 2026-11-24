const { EmbedBuilder } = require("discord.js");
const sondageDB = require("../utils/sondageDB");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    // 1. Gestion des boutons
    // Remplace ton bloc if (interaction.isButton()) par celui-ci :

    // ... (dans ton interactionCreate.js)
    if (interaction.isButton()) {
      try {
        await interaction.deferUpdate();

        const type = interaction.customId === "vote_oui" ? "oui" : "non";
        const votes = sondageDB.addVote(
          interaction.message.id,
          type,
          interaction.user.id,
        );

        if (votes === false) {
          // Optionnel : on prévient l'utilisateur qu'il a déjà voté
          await interaction.followUp({
            content: "Tu as déjà voté !",
            ephemeral: true,
          });
          return;
        }

        const originalEmbed = interaction.message.embeds[0];

        // Nettoyage de l'ancienne ligne "Résultats :" pour ne pas qu'elle se répète
        let description = originalEmbed.description.split(
          "\n\n**Résultats :**",
        )[0];

        const newEmbed = EmbedBuilder.from(originalEmbed).setDescription(
          `${description}\n\n**Résultats :**\n✅ Oui : ${votes.oui}\n❌ Non : ${votes.non}`,
        );

        await interaction.editReply({ embeds: [newEmbed] });
      } catch (error) {
        console.error("Erreur vote:", error);
      }
      return;
    }

    // 2. Gestion des commandes Slash
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Cooldown system
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name))
      cooldowns.set(command.data.name, new Map());

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expiration = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expiration) {
        const remaining = ((expiration - now) / 1000).toFixed(1);
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0xfee75c)
              .setDescription(
                `⏳ Attends encore **${remaining}s** avant de réutiliser \`/${command.data.name}\`.`,
              ),
          ],
          ephemeral: true,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    // Exécution de la commande
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Erreur commande /${command.data.name}:`, error);
      const errMsg = {
        embeds: [
          new EmbedBuilder()
            .setColor(0xed4245)
            .setDescription("❌ Une erreur est survenue."),
        ],
        ephemeral: true,
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errMsg);
      } else {
        await interaction.reply(errMsg);
      }
    }
  }, // <--- La virgule et la fermeture de la fonction sont bien ici !
};
