// commands/utility/translate.js
const { SlashCommandBuilder } = require("discord.js");
const { fun, error } = require("../../utils/embeds");

// Faux traducteur amusant vers "langues" inventées
const modes = {
  pirate: (t) =>
    t
      .replace(/r/gi, "arr")
      .replace(/s\b/g, "'s")
      .replace(/you/gi, "ye")
      .replace(/my/gi, "me")
      .replace(/the/gi, "th'")
      .replace(/yes/gi, "aye")
      .replace(/hello/gi, "ahoy"),
  leet: (t) =>
    t
      .replace(/a/gi, "4")
      .replace(/e/gi, "3")
      .replace(/i/gi, "1")
      .replace(/o/gi, "0")
      .replace(/s/gi, "5")
      .replace(/t/gi, "7"),
  uwu: (t) =>
    t
      .replace(/r/gi, "w")
      .replace(/l/gi, "w")
      .replace(/n([aeiou])/gi, "ny$1")
      .replace(/!+/g, " uwu!")
      .replace(/\./g, " uwu."),
  verlan: (t) =>
    t
      .split(" ")
      .map((w) =>
        w.length > 2
          ? w.slice(Math.floor(w.length / 2)) +
            w.slice(0, Math.floor(w.length / 2))
          : w,
      )
      .join(" "),
  caps: (t) =>
    t
      .toUpperCase()
      .split("")
      .map((c, i) => (i % 2 === 0 ? c : c.toLowerCase()))
      .join(""),
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("traduire")
    .setDescription("🌍 Traduit ton texte dans un style fun !")
    .addStringOption((o) =>
      o.setName("texte").setDescription("Texte à traduire").setRequired(true),
    )
    .addStringOption((o) =>
      o
        .setName("mode")
        .setDescription("Mode de traduction")
        .setRequired(true)
        .addChoices(
          { name: "🏴‍☠️ Pirate", value: "pirate" },
          { name: "💻 Leet Speak", value: "leet" },
          { name: "🌸 UwU", value: "uwu" },
          { name: "🔄 Verlan", value: "verlan" },
          { name: "🎪 Alternating CAPS", value: "caps" },
        ),
    ),
  cooldown: 3,
  async execute(interaction) {
    const texte = interaction.options.getString("texte");
    const mode = interaction.options.getString("mode");
    const result = modes[mode](texte);
    await interaction.reply({
      embeds: [
        fun(
          `🌍 Traduction (${mode})`,
          `**Avant :** ${texte}\n**Après :** ${result}`,
          0x9b59b6,
        ),
      ],
    });
  },
};
