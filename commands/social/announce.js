// commands/social/announce.js — Créer une annonce embed stylisée
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('📢 Créer une annonce embed stylisée dans n\'importe quel salon')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(o => o.setName('titre').setDescription('Titre de l\'annonce').setRequired(true))
    .addStringOption(o => o.setName('message').setDescription('Contenu (\\n = saut de ligne)').setRequired(true))
    .addChannelOption(o => o.setName('salon').setDescription('Salon cible (défaut: actuel)').setRequired(false))
    .addStringOption(o => o.setName('couleur')
      .setDescription('Couleur')
      .setRequired(false)
      .addChoices(
        { name: '🌸 Rose Anime',   value: 'FF0080' },
        { name: '💙 Bleu Gaming',  value: '00D4FF' },
        { name: '💜 Violet',       value: '9B59B6' },
        { name: '🍊 Orange',       value: 'FF6B35' },
        { name: '✨ Or',           value: 'FFD700' },
        { name: '🌿 Vert',         value: '57F287' },
      ))
    .addStringOption(o => o.setName('image').setDescription('URL d\'une image').setRequired(false))
    .addStringOption(o => o.setName('ping').setDescription('Mentionner un rôle ?').setRequired(false)
      .addChoices(
        { name: '@everyone', value: '@everyone' },
        { name: '@here',     value: '@here'     },
      )),

  async execute(interaction) {
    const titre   = interaction.options.getString('titre');
    const message = interaction.options.getString('message').replace(/\\n/g, '\n');
    const salon   = interaction.options.getChannel('salon') || interaction.channel;
    const couleur = interaction.options.getString('couleur') || 'FF0080';
    const image   = interaction.options.getString('image');
    const ping    = interaction.options.getString('ping');

    const embed = new EmbedBuilder()
      .setColor(parseInt(couleur, 16))
      .setTitle(titre)
      .setDescription(message)
      .setTimestamp()
      .setFooter({ text: `📢 Annonce • ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });

    if (image) embed.setImage(image);

    const content = ping || undefined;
    await salon.send({ content, embeds: [embed] });
    await interaction.reply({ content: `✅ Annonce envoyée dans ${salon} !`, ephemeral: true });
  }
};
