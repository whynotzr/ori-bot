// commands/fun/chien.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const PHRASES_CHIEN = [
  '{cible} 🐕 de {auteur}',
  '{cible} 🐕 de {auteur} (woof)',
  '{cible} 🐕 de {auteur} 🦴',
  '{cible} chien de {auteur} 🐕‍🦺',
];

const PHRASES_CHAT = [
  '{cible} 🐱 de {auteur}',
  '{cible} 🐱 de {auteur} (miaou)',
  '{cible} 😸 de {auteur}',
  '{cible} 🐾 de {auteur}',
];

const PHRASES_ESCLAVE = [
  '{cible} 🤡 de {auteur}',
  '{cible} serviteur de {auteur} 👑',
  '{cible} soumis à {auteur} 🙇',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chien')
    .setDescription('🐕 Transforme quelqu\'un en ton animal et change son surnom !')
    .addUserOption(o => o.setName('cible').setDescription('Le membre à transformer').setRequired(true))
    .addStringOption(o => o.setName('animal')
      .setDescription('L\'animal qu\'il devient')
      .setRequired(false)
      .addChoices(
        { name: '🐕 Chien',    value: 'chien'   },
        { name: '🐱 Chat',     value: 'chat'    },
        { name: '🤡 Esclave',  value: 'esclave' },
      )),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();

    const cibleMember = interaction.options.getMember('cible');
    const animal = interaction.options.getString('animal') || 'chien';
    const auteurMember = interaction.member;

    if (!cibleMember) {
      return interaction.editReply({ content: '❌ Ce membre n\'est pas sur le serveur.' });
    }

    if (cibleMember.id === interaction.user.id) {
      return interaction.editReply({ 
        embeds: [new EmbedBuilder()
          .setColor(0xFF6B35)
          .setDescription('🤔 Tu ne peux pas te transformer toi-même en animal... ou si ?')
        ], 
        ephemeral: true 
      });
    }

    let phrases;
    switch (animal) {
      case 'chat':    phrases = PHRASES_CHAT;    break;
      case 'esclave': phrases = PHRASES_ESCLAVE; break;
      default:        phrases = PHRASES_CHIEN;
    }

    const phraseDeBase = phrases[Math.floor(Math.random() * phrases.length)];

    const emoji = animal === 'chien' ? '🐕' : animal === 'chat' ? '🐱' : '🤡';
    
    // ICI : Changement pour garder le nom d'affichage stylisé (ex: IVΞILGHT)
    const surnomBrut = `${cibleMember.displayName} ${emoji} de ${auteurMember.displayName}`;

    const phraseEmbed = phraseDeBase
      .replace('{auteur}', `**${auteurMember.displayName}**`)
      .replace('{cible}', `**${cibleMember.displayName}**`);

    let precisionSurnom = `\n\n✨ Le surnom de **${cibleMember.displayName}** a été changé en : \`${surnomBrut}\``;

    try {
      if (surnomBrut.length > 32) {
        precisionSurnom = `\n\n⚠️ *Le surnom était trop long (plus de 32 caractères) pour être appliqué.*`;
      } else {
        await cibleMember.setNickname(surnomBrut);
      }
    } catch (error) {
      precisionSurnom = `\n\n❌ *Je n'ai pas pu modifier le surnom de ${cibleMember} (Permissions de hiérarchie insuffisantes).*`;
    }

    await interaction.editReply({ 
      embeds: [new EmbedBuilder()
        .setColor(0xFF73FA)
        .setDescription(`${phraseEmbed}${precisionSurnom}`)
        .setThumbnail(cibleMember.user.displayAvatarURL())
        .setFooter({ text: 'La vérité est enfin révélée 👀' })
      ]
    });
  }
};