// events/guildMemberAdd.js
const { EmbedBuilder } = require("discord.js");

// ── VARIABLES ANTI-RAID (En dehors de module.exports pour qu'elles restent en mémoire) ──
const joinHistory = [];
const JOIN_LIMIT = 4; // Si 4 membres rejoignent...
const TIME_WINDOW = 10000; // ...en 10 secondes (10000 ms)

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    // ── 1. CONFIGURATION ──
    const SALON_BIENVENUE_ID = "1419013499593687161";
    const QUARANTAINE_ROLE_ID = "1553718966512255006"; // ⚠️ À REMPLACER

    const AUTOROLES_IDS = [
      "1421134660708208773",
      "1421904805626122281",
      "1419013399932834016",
      "1421133015924478083",
      "1423733557003817040",
      "1445831883958255627",
    ];

    const GIF_BIENVENUE =
      "https://i.pinimg.com/736x/9f/9a/8d/9f9a8d58f96c1f313f0766659f99f4f4.jpg";
    const guild = member.guild;

    // ── 2. VÉRIFICATION ANTI MASS-JOIN (QUARANTAINE) ──
    const now = Date.now();
    joinHistory.push(now);

    // Nettoie la liste pour ne garder que les arrivées très récentes
    const recentJoins = joinHistory.filter((time) => now - time < TIME_WINDOW);
    joinHistory.length = 0;
    joinHistory.push(...recentJoins);

    // Si on dépasse la limite (ex: 4 membres en 10 secondes) -> MODE QUARANTAINE
    if (recentJoins.length >= JOIN_LIMIT) {
      console.log(
        `[🚨 ANTI-RAID] Vague détectée ! ${member.user.tag} mis en quarantaine.`,
      );

      const quarantineRole = guild.roles.cache.get(QUARANTAINE_ROLE_ID);
      if (quarantineRole) {
        await member.roles.add(quarantineRole).catch(console.error);
      }

      // On fait un "return" : ça arrête la lecture du code ici.
      // Le membre ne recevra pas les autres rôles et le bot n'enverra pas l'embed de bienvenue.
      return;
    }

    // ── 3. ATTRIBUTION DES AUTOROLES NORMAUX (BOUCLE) ──
    // (Si on arrive ici, c'est que ce n'est pas un raid)
    for (const roleId of AUTOROLES_IDS) {
      const role = guild.roles.cache.get(roleId);
      if (role) {
        await member.roles.add(role).catch((err) => {
          console.error(`Impossible de donner le rôle ${role.name} :`, err);
        });
      }
    }

    // ── 4. ENVOI DE L'EMBED DE BIENVENUE ──
    const channel = guild.channels.cache.get(SALON_BIENVENUE_ID);
    if (!channel) return;

    const totalMembres = guild.memberCount;

    const embed = new EmbedBuilder()
      .setColor(0xff73fa)
      .setTitle(`🌸 Bienvenue sur ${guild.name} !`)
      .setDescription(
        `💫 Oh ! Un nouveau membre vient d'apparaître !\n\nBienvenue à toi ${member} ! Installe-toi confortablement, passe un bon moment avec nous.\n\n> 🪄 Tu es notre **${totalMembres}ème** résident !`,
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage(GIF_BIENVENUE)
      .setTimestamp()
      .setFooter({ text: `Welcome ✨`, iconURL: guild.iconURL() });

    await channel
      .send({ content: `🌷 Bienvenue ${member} !`, embeds: [embed] })
      .catch(() => {});
  },
};
