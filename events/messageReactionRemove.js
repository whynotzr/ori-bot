// events/messageReactionRemove.js
const { getPanel } = require('../utils/reactionRolesDB');

module.exports = {
  name: 'messageReactionRemove',
  async execute(reaction, user, client) {
    if (user.bot) return;

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        return;
      }
    }

    // ICI AUSSI : getPanel
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
        await member.roles.remove(role);
        await user.send(`🌸 Le rôle **${role.name}** t'a été retiré dans **${guild.name}**.`).catch(() => {});
      }
    } catch (error) {
      console.error(`[Reaction Roles] Erreur lors du retrait du rôle :`, error);
    }
  }
};