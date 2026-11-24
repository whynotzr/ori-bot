// commands/moderation/clear.js
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { success, error } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("🗑️ Supprimer des messages en masse")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((o) =>
      o
        .setName("nombre")
        .setDescription("Nombre de messages (1-100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    )
    .addUserOption((o) =>
      o
        .setName("membre")
        .setDescription("Supprimer uniquement les messages de ce membre")
        .setRequired(false),
    ),

  async execute(interaction) {
    const nombre = interaction.options.getInteger("nombre");
    const membre = interaction.options.getUser("membre");

    await interaction.deferReply({ flags: 64 });

    try {
      let messages = await interaction.channel.messages.fetch({ limit: 100 });

      if (membre) {
        messages = messages.filter((m) => m.author.id === membre.id);
      }

      // On isole le nombre exact de messages demandés
      const toDelete = Array.from(messages.values()).slice(0, nombre);

      if (toDelete.length === 0) {
        return await interaction.editReply({
          embeds: [
            error(
              "Aucun message",
              "Aucun message correspondant trouvé dans les 100 derniers du salon.",
            ),
          ],
        });
      }

      // Tente la suppression rapide (bulkDelete)
      let deleted = await interaction.channel.bulkDelete(toDelete, true);

      // Si certains messages ont plus de 14 jours, on les supprime un par un à la main
      if (deleted.size < toDelete.length) {
        const remaining = toDelete.filter((m) => !deleted.has(m.id));
        for (const msg of remaining) {
          await msg.delete().catch(() => {});
        }
      }

      const totalDeleted = Math.min(
        toDelete.length,
        deleted.size + (toDelete.length - deleted.size),
      );

      await interaction.editReply({
        embeds: [
          success(
            "Messages supprimés",
            `**${totalDeleted}** message(s) supprimé(s)${membre ? ` de **${membre.tag}**` : ""}.`,
          ),
        ],
      });
    } catch (e) {
      console.error(e);
      await interaction.editReply({
        embeds: [
          error(
            "Erreur",
            'Impossible de supprimer les messages. Vérifie que le bot a bien la permission "Gérer les messages".',
          ),
        ],
      });
    }
  },
};
