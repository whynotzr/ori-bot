// events/messageCreate.js
const { AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const { getUserData, saveUserData } = require("../utils/levelDB");
const {
  getTierForLevel,
  LEVEL_UP_CHANNEL_ID,
  GLOBAL_XP_MULTIPLIER,
  ROLE_MULTIPLIERS,
} = require("../commands/levels/levelconfig");

const cooldownsXP = new Set();
const spamTracker = new Map();

function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawBlurredImage(mainCtx, img, x, y, width, height, blurAmount = 12) {
  const miniW = Math.max(1, Math.floor(width / blurAmount));
  const miniH = Math.max(1, Math.floor(height / blurAmount));

  const miniCanvas = Canvas.createCanvas(miniW, miniH);
  const miniCtx = miniCanvas.getContext("2d");

  miniCtx.imageSmoothingEnabled = true;
  miniCtx.drawImage(img, 0, 0, miniW, miniH);

  mainCtx.imageSmoothingEnabled = true;
  mainCtx.drawImage(miniCanvas, x, y, width, height);
}

async function fetchImageSecurely(src) {
  if (!src) return null;
  try {
    if (src.startsWith("http://") || src.startsWith("https://")) {
      const response = await fetch(src, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      return await Canvas.loadImage(Buffer.from(buffer));
    }
    return await Canvas.loadImage(src);
  } catch (e) {
    return null;
  }
}

async function generateLevelUpCard(user, newLevel, tier) {
  const canvas = Canvas.createCanvas(850, 240);
  const ctx = canvas.getContext("2d");

  const bgImage = await fetchImageSecurely(tier.background);
  if (bgImage) {
    drawBlurredImage(ctx, bgImage, 0, 0, canvas.width, canvas.height, 12);
  } else {
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#141e30");
    grad.addColorStop(1, "#243b55");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.fillStyle = "rgba(12, 13, 18, 0.75)";
  drawRoundRect(ctx, 20, 20, canvas.width - 40, canvas.height - 40, 18);
  ctx.fill();
  ctx.strokeStyle = tier.color || "#CD7F32";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "bold 28px sans-serif";
  ctx.fillStyle = tier.color || "#CD7F32";
  ctx.fillText("🌸 LEVEL UP !", 230, 70);

  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(user.username, 230, 115);

  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText(`NIVEAU ${newLevel}`, 230, 160);

  ctx.fillStyle = tier.color || "#CD7F32";
  ctx.fillText(`✦ ${(tier.name || "Aventurier").toUpperCase()}`, 380, 160);

  const avatarUrl = user.displayAvatarURL({ extension: "png", size: 256 });
  const avatarImg = await fetchImageSecurely(avatarUrl);

  if (avatarImg) {
    const avatarX = 120;
    const avatarY = 120;
    const radius = 60;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, radius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = tier.color || "#CD7F32";
    ctx.lineWidth = 4;
    ctx.shadowColor = tier.color || "#CD7F32";
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      avatarImg,
      avatarX - radius,
      avatarY - radius,
      radius * 2,
      radius * 2,
    );
    ctx.restore();
  }

  return new AttachmentBuilder(canvas.toBuffer(), {
    name: `levelup-${user.id}.png`,
  });
}

// ── DÉBUT DE L'ÉVÉNEMENT (C'est ici que tout se passe quand un message est envoyé) ──
module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot || !message.guild || !message.member) return;

    // 🛑 ANTI-BOT (Salon piège)
    const ANTI_BOT_CHANNEL_ID =
      process.env.ANTI_BOT_CHANNEL_ID || "1553461795216171151";
    if (message.channel.id === ANTI_BOT_CHANNEL_ID) {
      if (
        !message.member.permissions.has("Administrator") &&
        !message.member.permissions.has("ManageGuild")
      ) {
        try {
          await message.member.ban({
            reason: "Message dans le salon anti-bot",
            deleteMessageSeconds: 604800,
          });
        } catch (err) {}
        return;
      }
    }

    // 🛡️ ANTI-LIENS
    const linkRegex =
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(discord\.gg\/[^\s]+)/gi;
    if (linkRegex.test(message.content)) {
      if (!message.member.permissions.has("Administrator")) {
        await message.delete().catch(() => {});
        const warn = await message.channel.send(
          `⚠️ ${message.author}, les liens ne sont pas autorisés ici !`,
        );
        setTimeout(() => warn.delete().catch(() => {}), 5000);
        return;
      }
    }

    const userId = message.author.id;
    const guildId = message.guild.id;
    const cacheKey = `${guildId}-${userId}`;

    // ── 1. ANTI-SPAM ──
    const now = Date.now();
    if (!spamTracker.has(cacheKey)) spamTracker.set(cacheKey, []);

    const timestamps = spamTracker.get(cacheKey);
    const recentMessages = timestamps.filter((time) => now - time < 5000);
    recentMessages.push(now);
    spamTracker.set(cacheKey, recentMessages);

    if (
      recentMessages.length >= 6 &&
      !message.member.permissions.has("ManageMessages")
    ) {
      spamTracker.set(cacheKey, []);
      try {
        const warn = await message.channel.send(
          `⚠️ ${message.author}, doucement sur les messages, tu vas trop vite ! 🌸`,
        );
        setTimeout(() => warn.delete().catch(() => {}), 4000); // Le message d'alerte s'efface tout seul au bout de 4 secondes
        return;
      } catch (err) {}
    }

    // ── 2. XP & LEVELING ──
    if (cooldownsXP.has(cacheKey)) return;

    // Cooldown fixé à 10 secondes (10 000 ms) mis au début pour bloquer les doublons immédiats
    cooldownsXP.add(cacheKey);
    setTimeout(() => cooldownsXP.delete(cacheKey), 10000);

    const userData = getUserData(userId, guildId);

    // Gain d'XP avec multiplicateur
    const xpDeBase = Math.floor(Math.random() * 11) + 15;
    let multiplier = GLOBAL_XP_MULTIPLIER || 1;

    if (ROLE_MULTIPLIERS && message.member) {
      for (const [roleId, bonus] of Object.entries(ROLE_MULTIPLIERS)) {
        if (message.member.roles.cache.has(roleId)) {
          multiplier = Math.max(multiplier, bonus);
        }
      }
    }

    const xpGagne = Math.floor(xpDeBase * multiplier);
    userData.xp += xpGagne;

    let xpNecessaire =
      5 * Math.pow(userData.level, 2) + 50 * userData.level + 100;
    let levelUpOccurred = false; // Pour savoir si un level up a eu lieu

    // Boucle de franchissement de niveaux
    while (userData.xp >= xpNecessaire) {
      userData.xp -= xpNecessaire;
      userData.level += 1;
      levelUpOccurred = true;

      const currentTier = getTierForLevel(userData.level);

      // Attribution du rôle
      if (currentTier && currentTier.roleId) {
        const roleRecompense = message.guild.roles.cache.get(
          currentTier.roleId,
        );
        if (roleRecompense) {
          await message.member.roles.add(roleRecompense).catch(() => {});
        }
      }

      // Notification dans le salon dédié avec image et ping
      const salonAnnonce =
        message.guild.channels.cache.get(LEVEL_UP_CHANNEL_ID) ||
        message.channel;
      if (salonAnnonce) {
        const cardAttachment = await generateLevelUpCard(
          message.author,
          userData.level,
          currentTier,
        );
        await salonAnnonce.send({
          content: `🎉 Félicitations ${message.author} ! Tu viens de passer au **Niveau ${userData.level}** (${currentTier.name}) !`,
          files: [cardAttachment],
        });
      }

      xpNecessaire =
        5 * Math.pow(userData.level, 2) + 50 * userData.level + 100;
    }

    // Sauvegarde immédiate pour bloquer les doublons de niveau
    saveUserData(userId, guildId, userData.xp, userData.level);
  },
};
