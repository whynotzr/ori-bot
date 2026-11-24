// commands/moderation/transfer.js
// Transfère un membre vers le second serveur en lui envoyant un lien d'invitation
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { error, success } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('🔀 Envoyer un lien d\'invitation vers le second serveur à un membre')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addUserOption(o => o.setName('membre').setDescription('Membre à transférer').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Message personnalisé à inclure').setRequired(false)),

  async execute(interaction, client) {
    const target  = interaction.options.getMember('membre');
    const message = interaction.options.getString('message') || 'Tu es invité à rejoindre notre autre serveur !';

    if (!target) return interaction.reply({ embeds: [error('Introuvable', 'Membre introuvable.')], ephemeral: true });

    const guildId2 = process.env.GUILD_ID_2;
    if (!guildId2) {
      return interaction.reply({ embeds: [error('Non configuré', 'Ajoute `GUILD_ID_2` dans ton `.env` pour utiliser cette commande.')], ephemeral: true });
    }

    const guild2 = client.guilds.cache.get(guildId2);
    if (!guild2) {
      return interaction.reply({ embeds: [error('Serveur introuvable', 'Le bot n\'est pas sur le second serveur, ou l\'ID est incorrect.')], ephemeral: true });
    }

    try {
      // Créer une invitation temporaire (1h, 1 utilisation)
      const channel2 = guild2.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild2.members.me).has('CreateInstantInvite'));
      if (!channel2) return interaction.reply({ embeds: [error('Erreur', 'Impossible de créer une invitation sur le second serveur.')], ephemeral: true });

      const invite = await channel2.createInvite({ maxAge: 3600, maxUses: 1, reason: `Transfert par ${interaction.user.tag}` });

      await target.send({ embeds: [new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(`🔀 Invitation vers ${guild2.name}`)
        .setDescription(`${message}\n\n**Lien d'invitation :** ${invite.url}\n\n*Ce lien est valable 1 heure, 1 utilisation.*`)
        .setThumbnail(guild2.iconURL())
      ]});

      await interaction.reply({ embeds: [success('Invitation envoyée', `Un lien d'invitation vers **${guild2.name}** a été envoyé en DM à **${target.user.tag}**.\nLien valable 1h, 1 utilisation.`)] });
    } catch (e) {
      await interaction.reply({ embeds: [error('Erreur', `Impossible d\'envoyer le DM à ce membre. (${e.message})`)], ephemeral: true });
    }
  }
};
