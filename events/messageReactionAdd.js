// events/messageReactionAdd.js
const { getPanel } = require('../utils/reactionRolesDB');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user, client) {
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Impossible de charger le message partiel :', error);
        return;
      }
    }

    // ICI : On utilise la vraie fonction getPanel de ton fichier !
    const panelData = getPanel(reaction.message.id);
    if (!panelData) return; 

    const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;
    const roleConfig = panelData.roles.find(r => r.emoji.includes(emojiKey) || emojiKey === r.emoji);
    if (!roleConfig) return;

    const guild = reaction.message.guild;
    if (!guild) return;

    try {
      const member = await guild.members.fetch(user.id);
      const role = await guild.roles.fetch(roleConfig.roleId);

      if (role && member) {
        await member.roles.add(role);
        await user.send(`✨ Tu as reçu le rôle **${role.name}** dans **${guild.name}** !`).catch(() => {});
      }
    } catch (error) {
      console.error(`[Reaction Roles] Erreur lors de l'ajout du rôle :`, error);
    }
  }
};