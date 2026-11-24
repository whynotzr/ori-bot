// commands/utility/help.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const CATEGORIES = [
  {
    name: '🎭 Reaction Roles',
    emoji: '🎭',
    filter: 'reaction',
    commands: [
      { name: '/reactionroles', desc: 'Créer un panel de reaction roles aesthetic' },
    ]
  },
  {
    name: '🛡️ Modération',
    emoji: '🛡️',
    filter: 'mod',
    commands: [
      { name: '/ban',         desc: 'Bannir un membre' },
      { name: '/unban',       desc: 'Débannir un utilisateur par ID' },
      { name: '/kick',        desc: 'Expulser un membre' },
      { name: '/mute',        desc: 'Mettre un membre en timeout' },
      { name: '/unmute',      desc: 'Retirer le timeout d\'un membre' },
      { name: '/timeout',     desc: 'Isolation temporaire (1 min → 28 jours)' },
      { name: '/untimeout',   desc: 'Lever le timeout d\'un membre' },
      { name: '/warn',        desc: 'Avertir un membre' },
      { name: '/warnings',    desc: 'Voir / gérer les avertissements' },
      { name: '/infractions', desc: 'Historique complet des sanctions d\'un membre' },
      { name: '/clear',       desc: 'Supprimer des messages en masse' },
      { name: '/lock',        desc: 'Verrouiller un salon' },
      { name: '/unlock',      desc: 'Déverrouiller un salon' },
      { name: '/slowmode',    desc: 'Activer / désactiver le mode lent' },
      { name: '/nick',        desc: 'Changer le pseudo d\'un membre' },
      { name: '/addrole',     desc: 'Donner un rôle à un membre' },
      { name: '/removerole',  desc: 'Retirer un rôle à un membre' },
      { name: '/dm',          desc: 'Envoyer un DM à un membre via le bot' },
      { name: '/dm-role',     desc: 'Envoyer un DM à tous les membres d\'un rôle' },
      { name: '/transfer',    desc: 'Envoyer une invitation vers le 2e serveur' },
    ]
  },
  {
    name: '🎮 Fun & Mini-jeux',
    emoji: '🎮',
    filter: 'fun',
    commands: [
      { name: '/8ball',        desc: 'Pose une question à la boule magique' },
      { name: '/dé',           desc: 'Lancer un ou plusieurs dés' },
      { name: '/pile-ou-face', desc: 'Lancer une pièce' },
      { name: '/pfc',          desc: 'Pierre Feuille Ciseaux contre le bot' },
      { name: '/ship',         desc: 'Calculer la compatibilité entre deux membres' },
      { name: '/note',         desc: 'Noter n\'importe quoi sur 10' },
      { name: '/chien',        desc: 'Déclarer quelqu\'un comme ton maître' },
      { name: '/blague',       desc: 'Une blague aléatoire (nulle garantie)' },
      { name: '/fact',         desc: 'Un fait insolite aléatoire' },
      { name: '/horoscope',    desc: 'Ton horoscope du jour' },
      { name: '/roast',        desc: 'Balance un roast sur un membre' },
      { name: '/mot',          desc: 'Un mot rare / beau avec sa définition' },
      { name: '/calcul',       desc: 'Calculatrice intégrée' },
      { name: '/choisir',      desc: 'Le bot choisit entre plusieurs options' },
      { name: '/pseudo',       desc: 'Génère un pseudo gaming aléatoire' },
    ]
  },
  {
    name: '💬 Social',
    emoji: '💬',
    filter: 'social',
    commands: [
      { name: '/anniversaire', desc: 'Souhaiter un joyeux anniversaire' },
      { name: '/compliment',   desc: 'Envoyer un compliment à un membre' },
      { name: '/announce',     desc: 'Faire une annonce dans un salon' },
    ]
  },
  {
    name: '📊 Niveaux',
    emoji: '📊',
    filter: 'levels',
    commands: [
      { name: '/rank',        desc: 'Voir ton niveau et ton XP' },
      { name: '/top',         desc: 'Classement des membres par XP' },
      { name: '/levelconfig', desc: 'Configurer le système de niveaux' },
    ]
  },
  {
    name: '🔧 Utilitaires',
    emoji: '🔧',
    filter: 'util',
    commands: [
      { name: '/userinfo',   desc: 'Infos sur un membre' },
      { name: '/serverinfo', desc: 'Infos sur le serveur' },
      { name: '/avatar',     desc: 'Afficher l\'avatar en grand' },
      { name: '/rappel',     desc: 'Créer un rappel en DM' },
      { name: '/serie',      desc: 'Envoyer plusieurs messages avec un délai (admin)' },
      { name: '/traduire',   desc: 'Traduire en Pirate, UwU, Leet Speak...' },
      { name: '/timestamp',  desc: 'Générer des timestamps Discord' },
      { name: '/couleur',    desc: 'Infos sur une couleur HEX' },
      { name: '/base64',     desc: 'Encoder / décoder en Base64' },
      { name: '/ping',       desc: 'Vérifier la latence du bot' },
      { name: '/stats',      desc: 'Statistiques du bot' },
      { name: '/help',       desc: 'Cette page d\'aide' },
    ]
  },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Afficher toutes les commandes disponibles')
    .addStringOption(o => o.setName('catégorie').setDescription('Filtrer par catégorie').setRequired(false)
      .addChoices(
        { name: '🎭 Reaction Roles', value: 'reaction' },
        { name: '🛡️ Modération',    value: 'mod' },
        { name: '🎮 Fun',           value: 'fun' },
        { name: '💬 Social',        value: 'social' },
        { name: '📊 Niveaux',       value: 'levels' },
        { name: '🔧 Utilitaires',   value: 'util' },
      )),

  async execute(interaction) {
    const filter = interaction.options.getString('catégorie');
    const guild  = interaction.guild;

    const totalCmds = CATEGORIES.reduce((acc, c) => acc + c.commands.length, 0);

    const embed = new EmbedBuilder()
      .setColor(0xFF0080)
      .setTitle('🌸 Aide — Anime & Gaming Bot')
      .setThumbnail(guild.iconURL() || interaction.client.user.displayAvatarURL())
      .setDescription('Voici toutes les commandes disponibles !\nUtilise `/help catégorie:...` pour filtrer par catégorie.')
      .setTimestamp()
      .setFooter({ text: `${totalCmds} commandes • 🌸 Anime & Gaming Bot` });

    const cats = filter
      ? CATEGORIES.filter(c => c.filter === filter)
      : CATEGORIES;

    for (const cat of cats) {
      embed.addFields({
        name: cat.name,
        value: cat.commands.map(c => `\`${c.name}\` — ${c.desc}`).join('\n'),
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
