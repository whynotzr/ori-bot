// commands/fun/horoscope.js
const { SlashCommandBuilder } = require("discord.js");
const { fun } = require("../../utils/embeds");

const signes = [
  "Bélier",
  "Taureau",
  "Gémeaux",
  "Cancer",
  "Lion",
  "Vierge",
  "Balance",
  "Scorpion",
  "Sagittaire",
  "Capricorne",
  "Verseau",
  "Poissons",
];
const predictions = [
  "Les astres te sourient aujourd'hui — mais méfie-toi du fromage.",
  "Une rencontre inattendue va changer ta journée. Peut-être ton chat.",
  "Mercure est en rétrograde. Rien ne va, mais ça ira demain.",
  "L'argent viendra... ou pas. Les astres restent flous là-dessus.",
  "Tu es sur le point de faire quelque chose de brillant. Enfin, probablement.",
  "Journée idéale pour ne rien faire de spécial et appeler ta mère.",
  "Évite les décisions importantes avant le café du matin.",
  "Une opportunité se présente. Ne la rate pas comme d'habitude !",
  "Le cosmos murmure que tu devrais manger plus de légumes.",
  "Tes amis pensent à toi. Ou ils ont vu ta photo de profil.",
  "Un voyage inattendu dans ta tête ou sur la route — les deux sont possibles.",
  "Aujourd'hui, fais confiance à ton instinct... sauf pour la pizza froide.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horoscope")
    .setDescription("🔮 Consulte ton horoscope du jour !")
    .addStringOption((o) =>
      o
        .setName("signe")
        .setDescription("Ton signe astrologique")
        .setRequired(true)
        .addChoices(...signes.map((s) => ({ name: s, value: s }))),
    ),
  cooldown: 10,
  async execute(interaction) {
    const signe = interaction.options.getString("signe");
    const pred = predictions[Math.floor(Math.random() * predictions.length)];
    await interaction.reply({
      embeds: [fun(`🔮 Horoscope du ${signe}`, pred, 0x9b59b6)],
    });
  },
};
