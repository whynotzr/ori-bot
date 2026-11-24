// commands/utility/avatar.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('🖼️ Afficher l\'avatar d\'un membre en grand')
    .addUserOption(o => o.setName('membre').setDescription('Membre (défaut: toi)').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('membre') || interaction.user;
    const formats = ['webp', 'png', 'jpg'].map(f => `[${f.toUpperCase()}](${user.displayAvatarURL({ format: f, size: 1024 })})`).join(' • ');

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`🖼️ Avatar de ${user.tag}`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setDescription(formats)
    ]});
  }
};
