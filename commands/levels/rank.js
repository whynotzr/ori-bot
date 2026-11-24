// commands/levels/rank.js
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const { getTierForLevel } = require("./levelconfig");
const { getUserRank } = require("./ranking");
const { getUserData } = require("../../utils/levelDB");

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

function drawBlurredImage(mainCtx, img, x, y, width, height, blurAmount = 15) {
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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("✨ Affiche ta carte de niveau")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Voir la carte d’un autre membre")
        .setRequired(false),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const guildId = interaction.guild ? interaction.guild.id : "DM";
      const target = interaction.options.getUser("membre") || interaction.user;

      const rankData = await getUserRank(target.id, guildId);
      const dbData = getUserData(target.id, guildId);

      const currentLevel =
        dbData && dbData.level !== undefined
          ? dbData.level
          : rankData
            ? rankData.level
            : 0;
      const currentXp =
        dbData && dbData.xp !== undefined
          ? dbData.xp
          : rankData
            ? rankData.xp
            : 0;
      const serverRank = rankData ? rankData.position || "N/A" : "N/A";

      // --- CALCULS XP UNIFIÉS ---
      const progressXp = Math.max(currentXp, 0);
      const totalNeeded =
        5 * Math.pow(currentLevel, 2) + 50 * currentLevel + 100;
      const percentage = Math.min(Math.max(progressXp / totalNeeded, 0), 1);

      const tier = getTierForLevel(currentLevel);

      const canvas = Canvas.createCanvas(950, 295);
      const ctx = canvas.getContext("2d");

      const bgImage = await fetchImageSecurely(tier.background);
      if (bgImage) {
        drawBlurredImage(ctx, bgImage, 0, 0, canvas.width, canvas.height, 15);
      } else {
        const grad = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        grad.addColorStop(0, "#141e30");
        grad.addColorStop(1, "#243b55");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = "rgba(12, 13, 18, 0.72)";
      drawRoundRect(ctx, 25, 25, canvas.width - 50, canvas.height - 50, 20);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "bold 34px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(target.username, 270, 90);

      ctx.font = "bold 18px sans-serif";
      ctx.fillStyle = tier.color || "#CD7F32";
      ctx.fillText(`✦ ${(tier.name || "Aventurier").toUpperCase()}`, 270, 120);

      ctx.font = "bold 22px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText(`RANG `, 680, 80);
      ctx.fillStyle = tier.color || "#CD7F32";
      ctx.fillText(`#${serverRank}`, 745, 80);

      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.fillText(`NIV. `, 820, 80);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(`${currentLevel}`, 870, 80);

      const barX = 270;
      const barY = 175;
      const barWidth = 620;
      const barHeight = 28;

      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      drawRoundRect(ctx, barX, barY, barWidth, barHeight, 14);
      ctx.fill();

      if (percentage > 0) {
        const barGradient = ctx.createLinearGradient(
          barX,
          0,
          barX + barWidth,
          0,
        );
        barGradient.addColorStop(0, tier.color || "#CD7F32");
        barGradient.addColorStop(1, "#FFFFFF");

        ctx.fillStyle = barGradient;
        drawRoundRect(
          ctx,
          barX,
          barY,
          Math.max(barWidth * percentage, 20),
          barHeight,
          14,
        );
        ctx.fill();
      }

      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      const xpText = `${Math.floor(progressXp).toLocaleString()} / ${Math.floor(totalNeeded).toLocaleString()} XP (${Math.floor(percentage * 100)}%)`;
      ctx.fillText(xpText, barX + 15, barY + 19);

      const avatarUrl = target.displayAvatarURL({
        extension: "png",
        size: 256,
      });
      const avatarImg = await fetchImageSecurely(avatarUrl);

      if (avatarImg) {
        const avatarX = 145;
        const avatarY = 147;
        const radius = 75;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX, avatarY, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = tier.color || "#CD7F32";
        ctx.lineWidth = 5;
        ctx.shadowColor = tier.color || "#CD7F32";
        ctx.shadowBlur = 15;
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

      const attachment = new AttachmentBuilder(canvas.toBuffer(), {
        name: `rank-${target.id}.png`,
      });
      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error("Erreur générale /rank :", error);
      await interaction.editReply({
        content:
          "❌ Une erreur s'est produite lors de la génération de la carte.",
      });
    }
  },
};
