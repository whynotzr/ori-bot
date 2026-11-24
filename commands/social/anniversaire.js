// commands/social/anniversaire.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anniversaire')
    .setDescription('🎂 Souhaite un joyeux anniversaire à un membre !')
    .addUserOption(o => o.setName('membre').setDescription('Membre à célébrer').setRequired(true))
    .addIntegerOption(o => o.setName('age').setDescription('Âge (optionnel)').setRequired(false).setMinValue(1).setMaxValue(150)),
  cooldown: 5,
  async execute(interaction) {
    const cible = interaction.options.getUser('membre');
    const age = interaction.options.getInteger('age');

    const description = age
      ? `🎉 Toute la communauté souhaite un **JOYEUX ANNIVERSAIRE** à ${cible} qui fête ses **${age} ans** aujourd'hui ! 🎂`
      : `🎉 Toute la communauté souhaite un **JOYEUX ANNIVERSAIRE** à ${cible} aujourd'hui ! 🎂`;

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(0xFFD700)
      .setTitle('🎂 Joyeux anniversaire !')
      .setDescription(description)
      .setThumbnail(cible.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Souhaité par ${interaction.user.tag}` })
      .setTimestamp()
    ]});
  }
};
