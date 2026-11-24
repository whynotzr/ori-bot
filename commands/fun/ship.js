// commands/fun/ship.js — Compatibility meter
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('💘 Calculer la compatibilité amoureuse entre deux membres !')
    .addUserOption(o => o.setName('personne1').setDescription('Première personne').setRequired(true))
    .addUserOption(o => o.setName('personne2').setDescription('Deuxième personne (défaut: toi)').setRequired(false)),
  cooldown: 5,
  async execute(interaction) {
    const p1 = interaction.options.getUser('personne1');
    const p2 = interaction.options.getUser('personne2') || interaction.user;

    // Score déterministe basé sur les IDs (toujours le même pour les mêmes personnes)
    const seed = (BigInt(p1.id) + BigInt(p2.id)) % 101n;
    const score = Number(seed);

    let emoji, comment, color;
    if (score < 20)       { emoji = '💔'; comment = 'Zéro compatibilité... Oublie ça.';      color = 0xED4245; }
    else if (score < 40)  { emoji = '🫤'; comment = 'Mouais... les chances sont faibles.';    color = 0xFF6B35; }
    else if (score < 60)  { emoji = '💛'; comment = 'Pas mal ! Il y a quelque chose.';        color = 0xFEE75C; }
    else if (score < 80)  { emoji = '💚'; comment = 'Très bonne compatibilité !';             color = 0x57F287; }
    else if (score < 95)  { emoji = '💖'; comment = 'WOW ! Vous êtes faits l\'un pour l\'autre !'; color = 0xFF73FA; }
    else                  { emoji = '💞'; comment = '100% MATCH ! MARIEZ-VOUS !';             color = 0xFF0080; }

    const bar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
    const shipName = p1.username.slice(0, Math.floor(p1.username.length / 2)) + p2.username.slice(Math.floor(p2.username.length / 2));

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(color)
      .setTitle(`${emoji} Ship-o-mètre`)
      .setDescription(`**${p1.username}** 💕 **${p2.username}**\n\n*Ship name : **${shipName}***\n\n**Compatibilité : ${score}%**\n\`${bar}\`\n\n${comment}`)
    ]});
  }
};
