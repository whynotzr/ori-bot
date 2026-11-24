// commands/utility/timestamp.js
const { SlashCommandBuilder } = require("discord.js");
const { info } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("🕒 Génère des timestamps Discord pour une date/heure !")
    .addIntegerOption((o) =>
      o.setName("annee").setDescription("Année (ex: 2025)").setRequired(true),
    )
    .addIntegerOption((o) =>
      o
        .setName("mois")
        .setDescription("Mois (1-12)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12),
    )
    .addIntegerOption((o) =>
      o
        .setName("jour")
        .setDescription("Jour (1-31)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(31),
    )
    .addIntegerOption((o) =>
      o
        .setName("heure")
        .setDescription("Heure (0-23)")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(23),
    )
    .addIntegerOption((o) =>
      o
        .setName("minute")
        .setDescription("Minute (0-59)")
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(59),
    ),
  cooldown: 3,
  async execute(interaction) {
    const y = interaction.options.getInteger("annee");
    const m = interaction.options.getInteger("mois") - 1;
    const d = interaction.options.getInteger("jour");
    const h = interaction.options.getInteger("heure") ?? 0;
    const min = interaction.options.getInteger("minute") ?? 0;
    const date = new Date(y, m, d, h, min);
    const ts = Math.floor(date.getTime() / 1000);
    const fields = [
      {
        name: "📅 Date courte",
        value: `\`<t:${ts}:d>\` → <t:${ts}:d>`,
        inline: true,
      },
      {
        name: "📅 Date longue",
        value: `\`<t:${ts}:D>\` → <t:${ts}:D>`,
        inline: true,
      },
      {
        name: "🕒 Heure courte",
        value: `\`<t:${ts}:t>\` → <t:${ts}:t>`,
        inline: true,
      },
      {
        name: "🕒 Heure longue",
        value: `\`<t:${ts}:T>\` → <t:${ts}:T>`,
        inline: true,
      },
      {
        name: "📆 Date + heure",
        value: `\`<t:${ts}:f>\` → <t:${ts}:f>`,
        inline: true,
      },
      {
        name: "📆 Complet",
        value: `\`<t:${ts}:F>\` → <t:${ts}:F>`,
        inline: true,
      },
      {
        name: "⏳ Relatif",
        value: `\`<t:${ts}:R>\` → <t:${ts}:R>`,
        inline: true,
      },
      { name: "🔢 Unix", value: `\`${ts}\``, inline: true },
    ];
    await interaction.reply({
      embeds: [
        info(
          "🕒 Timestamps Discord",
          `Pour le **${d}/${m + 1}/${y}** à **${h}h${min.toString().padStart(2, "0")}**`,
          fields,
        ),
      ],
    });
  },
};
