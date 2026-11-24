// events/guildAuditLog.js
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

// 🛡️ LISTE BLANCHE : Mets tes IDs ici pour être immunisé
const WHITELIST = ["1149988983053496331", "847535187658932285"];
// 📝 ID DU SALON DE LOGS
const LOG_CHANNEL_ID = "1419013628333523104";

const actionTracker = new Map();

module.exports = {
  name: "guildAuditLogEntryCreate",
  async execute(auditLogEntry, guild) {
    const { action, executorId } = auditLogEntry;

    // 1. On ignore si l'utilisateur est dans la Whitelist
    if (WHITELIST.includes(executorId)) return;

    // 2. Actions surveillées
    const criticalActions = [
      AuditLogEvent.ChannelDelete,
      AuditLogEvent.MemberBanAdd,
      AuditLogEvent.RoleDelete,
    ];

    if (!criticalActions.includes(action)) return;

    const now = Date.now();
    if (!actionTracker.has(executorId)) actionTracker.set(executorId, []);

    const actions = actionTracker.get(executorId);
    actions.push(now);

    // 3. Si plus de 3 actions critiques en 10 secondes -> ALERTE ROUGE
    if (actions.filter((time) => now - time < 10000).length >= 3) {
      const member = await guild.members.fetch(executorId).catch(() => null);
      if (member) {
        // Envoi du log avant le kick
        const logChannel = await guild.channels
          .fetch(LOG_CHANNEL_ID)
          .catch(() => null);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("🚨 ALERTE ANTI-NUKE")
            .setDescription(
              `**${member.user.tag}** a été éjecté pour activité suspecte (tentative de destruction massive).`,
            )
            .setTimestamp();
          logChannel.send({ embeds: [embed] });
        }

        // Suppression des rôles et Kick immédiat
        await member.roles.set([]).catch(() => {});
        await member
          .kick("Protection Anti-Nuke activée : activité suspecte détectée")
          .catch(() => {});

        console.log(`🚨 ANTI-NUKE : ${member.user.tag} a été éjecté !`);
      }
    }
  },
};
