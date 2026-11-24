// commands/utility/couleur.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { error } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('couleur')
    .setDescription('🎨 Affiche les infos d\'une couleur HEX (aperçu, RGB, HSL)')
    .addStringOption(o => o.setName('hex').setDescription('Code hexadécimal, ex: #FF0080 ou FF0080').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    let hex = interaction.options.getString('hex').trim().replace(/^#/, '');

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      return interaction.reply({
        embeds: [error('Format invalide', 'Utilise un code hexadécimal à 6 caractères, ex: `#FF0080`.')],
        ephemeral: true,
      });
    }

    const int = parseInt(hex, 16);
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;

    // Conversion RGB -> HSL
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
        case gN: h = (bN - rN) / d + 2; break;
        default:  h = (rN - gN) / d + 4;
      }
      h /= 6;
    }
    const hsl = `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;

    // Génère un aperçu carré de la couleur en image (via un service d'aperçu placeholder)
    const swatchUrl = `https://singlecolorimage.com/get/${hex}/200x200`;

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(int)
      .setTitle(`🎨 Couleur #${hex.toUpperCase()}`)
      .setThumbnail(swatchUrl)
      .addFields(
        { name: 'HEX', value: `#${hex.toUpperCase()}`, inline: true },
        { name: 'RGB', value: `${r}, ${g}, ${b}`, inline: true },
        { name: 'HSL', value: hsl, inline: true },
      )
    ]});
  }
};
