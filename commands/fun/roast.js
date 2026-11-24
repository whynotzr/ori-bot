// commands/fun/roast.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Roasts génériques et légers, sans viser de caractéristique personnelle
// (apparence, origine, genre, etc.) — uniquement de l'humour bon enfant.
const ROASTS = [
  "{cible} a mis plus de temps à choisir son pseudo qu'à réfléchir à sa vie.",
  "{cible} rage quote plus vite qu'un chargeur qui se débranche tout seul.",
  "On dirait que {cible} a appris à jouer en lisant le mode d'emploi... à l'envers.",
  "{cible} a un ping tellement stable qu'on dirait qu'il joue depuis la Lune.",
  "{cible} parle de stratégie, mais perd même au pierre-feuille-ciseaux.",
  "Le seul boss que {cible} a jamais battu, c'est le bouton 'quitter la partie'.",
  "{cible} tape plus vite sur le clavier que sur l'ennemi.",
  "Même le bot du serveur a plus de skill que {cible}.",
  "{cible} a un plan de jeu... c'est de perdre avec style.",
  "On a vérifié : {cible} et la victoire ne sont pas dans le même fuseau horaire.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('🔥 Balance un roast (gentil) sur un membre !')
    .addUserOption(o => o.setName('membre').setDescription('La victime').setRequired(true)),
  cooldown: 5,
  async execute(interaction) {
    const cible = interaction.options.getUser('membre');

    if (cible.id === interaction.client.user.id) {
      return interaction.reply({ content: "😏 Gentil essai, mais je suis incorruptible.", ephemeral: true });
    }

    const template = ROASTS[Math.floor(Math.random() * ROASTS.length)];
    const texte = template.replace('{cible}', `**${cible.username}**`);

    await interaction.reply({ embeds: [new EmbedBuilder()
      .setColor(0xFF6B35)
      .setTitle('🔥 Roast Zone')
      .setDescription(texte)
      .setFooter({ text: 'Rien de méchant, juste pour rire 😄' })
    ]});
  }
};
