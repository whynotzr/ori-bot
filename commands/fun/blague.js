// commands/fun/blague.js
const { SlashCommandBuilder } = require("discord.js");
const { fun } = require("../../utils/embeds");

const blagues = [
  "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tomberaient dans le bateau !",
  "Un homme entre dans une bibliothèque et demande : « Avez-vous des livres sur la paranoïa ? » Le bibliothécaire chuchote : « Ils sont juste derrière vous… »",
  "Qu'est-ce qu'un canif ? Un petit fien.",
  "Pourquoi les ploucs mettent-ils leur téléphone au congélateur ? Pour avoir des appels en froid.",
  "Comment appelle-t-on un chat tombé dans un pot de peinture le jour de Noël ? Un chat-peint de Noël.",
  "Un crocodile est-il plus long qu'il n'est haut ? Oui, mais un alligator est plus large qu'il ne le semble.",
  "Qu'est-ce qu'un Irlandais qui rebondit contre les murs ? Patrick.",
  "Pourquoi Superman porte-t-il son slip par dessus son collant ? Parce qu'il a mis son collant en premier.",
  "Qu'est-ce qu'un chat sans oreilles ? Kot comme ça.",
  "Quel est le comble pour un électricien ? De ne pas être au courant !",
  "Pourquoi les vaches portent des cloches ? Parce que leurs cornes ne marchent pas.",
  "Quelle différence entre une boîte aux lettres et un éléphant ? Tu ne sais pas ? Je ne t'enverrai jamais poster une lettre alors !",
  "Qu'est-ce qu'un canari qui parle ? Un carri bavard.",
  "Pourquoi les plantes ne font-elles jamais de sport ? Parce qu'elles ont des racines.",
  "Comment s'appelle un cochon qui fait de la plongée ? Un cochon plongeur. Ha non, SCUBA-doo !",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blague")
    .setDescription("😂 Une blague nulle pour ta journée !"),
  cooldown: 5,
  async execute(interaction) {
    const blague = blagues[Math.floor(Math.random() * blagues.length)];
    await interaction.reply({ embeds: [fun("😂 Blague du moment", blague)] });
  },
};
