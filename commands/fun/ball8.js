// commands/fun/ball8.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const REPONSES = [
  // Positif
  { text: '✅ Oui, définitivement !',          color: 0x57F287 },
  { text: '✅ C\'est certain.',                 color: 0x57F287 },
  { text: '✅ Sans aucun doute.',               color: 0x57F287 },
  { text: '✅ Oui, absolument.',                color: 0x57F287 },
  { text: '✅ Les signes pointent vers oui.',   color: 0x57F287 },
  { text: '✅ Il faut y compter.',              color: 0x57F287 },
  { text: '✅ La réponse est oui.',             color: 0x57F287 },
  // Neutre
  { text: '🤔 Réessaie plus tard...',           color: 0xFEE75C },
  { text: '🤔 Je ne peux pas prédire ça.',      color: 0xFEE75C },
  { text: '🤔 Concentre-toi et redemande.',     color: 0xFEE75C },
  { text: '🤔 Impossible de savoir maintenant.',color: 0xFEE75C },
  // Négatif
  { text: '❌ Non, pas du tout.',               color: 0xED4245 },
  { text: '❌ Ma réponse est non.',             color: 0xED4245 },
  { text: '❌ Les perspectives ne sont pas bonnes.', color: 0xED4245 },
  { text: '❌ Très douteux.',                   color: 0xED4245 },
  { text: '❌ Ne compte pas dessus.',           color: 0xED4245 },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('🎱 Pose une question à la boule magique !')
    .addStringOption(o => o.setName('question').setDescription('Ta question').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const rep = REPONSES[Math.floor(Math.random() * REPONSES.length)];
    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(rep.color)
      .setTitle('🎱 Boule Magique')
      .addFields(
        { name: '❓ Question', value: question },
        { name: '🔮 Réponse', value: rep.text }
      )
      .setFooter({ text: `Demandé par ${interaction.user.tag}` })
    ]});
  }
};
