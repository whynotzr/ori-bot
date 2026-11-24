// commands/moderation/dmrole.js
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { success, error, info } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm-role")
    .setDescription("📨 Envoie un DM à tous les membres d'un rôle")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((o) =>
      o.setName("role").setDescription("Rôle ciblé").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("Message à envoyer")
        .setRequired(true)
        .setMaxLength(1800),
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const message = interaction.options.getString("message");

    await interaction.deferReply({ ephemeral: true });

    // Récupère tous les membres avec ce rôle
    await interaction.guild.members.fetch();
    const membres = interaction.guild.members.cache.filter(
      (m) => m.roles.cache.has(role.id) && !m.user.bot,
    );

    if (membres.size === 0) {
      return interaction.editReply({
        embeds: [
          error(
            "Aucun membre",
            `Aucun membre humain trouvé avec le rôle ${role}.`,
          ),
        ],
      });
    }

    // Confirmation préalable
    await interaction.editReply({
      embeds: [
        info(
          "📨 Envoi en cours...",
          `Envoi du message à **${membres.size} membre(s)** avec le rôle ${role}.\nUn délai de **1,5s** est appliqué entre chaque DM pour éviter le rate-limit.`,
        ),
      ],
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(`📨 Message de ${interaction.guild.name}`)
      .setDescription(message)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({
        text: `Envoyé par ${interaction.user.tag} • Rôle : ${role.name}`,
      })
      .setTimestamp();

    let envoyes = 0;
    let echecs = 0;

    for (const [, membre] of membres) {
      try {
        await membre.user.send({ embeds: [embed] });
        envoyes++;
      } catch {
        echecs++;
      }
      // Délai de 1500ms entre chaque DM pour éviter le ban du bot
      await new Promise((r) => setTimeout(r, 1500));
    }

    await interaction.editReply({
      embeds: [
        success(
          "📨 Envoi terminé",
          `**${envoyes}** DM(s) envoyés avec succès.\n**${echecs}** échec(s) (DMs désactivés ou bloqués).`,
        ),
      ],
    });
  },
};
