// commands/fun/dice.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dé')
    .setDescription('🎲 Lancer un ou plusieurs dés !')
    .addIntegerOption(o => o.setName('faces').setDescription('Nombre de faces (défaut: 6)').setMinValue(2).setMaxValue(1000).setRequired(false))
    .addIntegerOption(o => o.setName('nombre').setDescription('Combien de dés (défaut: 1)').setMinValue(1).setMaxValue(10).setRequired(false)),
  cooldown: 2,
  async execute(interaction) {
    const faces  = interaction.options.getInteger('faces')  || 6;
    const nombre = interaction.options.getInteger('nombre') || 1;
    const results = Array.from({ length: nombre }, () => Math.floor(Math.random() * faces) + 1);
    const total   = results.reduce((a, b) => a + b, 0);
    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle(`🎲 Lancer de dé${nombre > 1 ? 's' : ''} (D${faces})`)
      .setDescription(nombre > 1
        ? `Résultats : **${results.join(' • ')}**\nTotal : **${total}**`
        : `Résultat : **${results[0]}**`)
      .setFooter({ text: `${interaction.user.tag}` })
    ]});
  }
};
