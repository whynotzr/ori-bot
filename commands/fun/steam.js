// commands/fun/steam.js
const {
  SlashCommandBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

// Couleurs officielles mates des niveaux Steam (sans néon)
function getLevelColor(level) {
  if (level >= 100) return "#b8860b"; // Or
  if (level >= 90) return "#8c7462"; // Marron
  if (level >= 80) return "#8e4136"; // Bordeaux
  if (level >= 70) return "#c26da1"; // Rose
  if (level >= 60) return "#835fb0"; // Violet
  if (level >= 50) return "#5a8eb8"; // Bleu
  if (level >= 40) return "#4e8e51"; // Vert
  if (level >= 30) return "#d4b745"; // Jaune
  if (level >= 20) return "#d67530"; // Orange
  if (level >= 10) return "#c02c2d"; // Rouge
  return "#9b9b9b"; // Gris (0-9)
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steam")
    .setDescription("🎮 Générer une carte Steam (Design Minimaliste & Épuré)")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID Steam64 ou pseudo personnalisé")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const query = interaction.options.getString("id");
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      return await interaction.editReply({
        content: "❌ La clé `STEAM_API_KEY` est manquante dans `.env`.",
      });
    }

    try {
      let steamId = query;

      if (!/^\d{17}$/.test(query)) {
        const resolveRes = await fetch(
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${encodeURIComponent(query)}`,
        );
        const resolveData = await resolveRes.json();
        if (resolveData.response && resolveData.response.success === 1) {
          steamId = resolveData.response.steamid;
        } else {
          return await interaction.editReply({
            content: `❌ Profil introuvable pour "**${query}**".`,
          });
        }
      }

      const [userRes, levelRes, gamesRes, recentGamesRes] = await Promise.all([
        fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`,
        ),
        fetch(
          `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${apiKey}&steamid=${steamId}`,
        ),
        fetch(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true`,
        ),
        fetch(
          `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&count=1`,
        ),
      ]);

      const userData = await userRes.json();
      const levelData = await levelRes.json();
      const gamesData = await gamesRes.json();
      const recentGamesData = await recentGamesRes.json();

      const player = userData.response?.players?.[0];
      if (!player)
        return await interaction.editReply({
          content: "❌ Profil privé ou introuvable.",
        });

      const level = levelData.response?.player_level ?? 0;
      const gameCount = gamesData.response?.game_count ?? 0;
      const lastGame = recentGamesData.response?.games?.[0];

      // --- CRÉATION DU CANVAS ---
      // Dimensions plus compactes et raffinées
      const canvas = createCanvas(800, 280);
      const ctx = canvas.getContext("2d");

      // 1. Fond global très sombre (presque noir mat)
      ctx.fillStyle = "#0b0c10";
      ctx.fillRect(0, 0, 800, 280);

      // 2. Carte centrale (gris très foncé, flat design)
      ctx.fillStyle = "#14171c";
      ctx.beginPath();
      ctx.roundRect(15, 15, 770, 250, 12);
      ctx.fill();

      // Bordure ultra fine et subtile
      ctx.strokeStyle = "#22262e";
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- GESTION DES COULEURS STATUT ---
      let statusColor = "#7a818c"; // Gris mat
      let statusText = "Hors ligne";

      if (player.gameextratitle) {
        statusColor = "#90ba3c"; // Vert Steam officiel mat
        statusText = `En jeu : ${player.gameextratitle}`;
      } else if (player.personastate === 1) {
        statusColor = "#57cbde"; // Bleu Steam officiel mat
        statusText = "En ligne";
      } else if (player.personastate === 3) {
        statusColor = "#d4b745"; // Jaune mat
        statusText = "Absent";
      }

      // --- AVATAR ---
      const avatarSize = 120;
      const avatarX = 40;
      const avatarY = 40;

      const avatarImg = await loadImage(player.avatarfull);

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 8); // Coins légèrement arrondis
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      ctx.restore();

      // Bordure discrète autour de l'avatar (pour délimiter sur fond sombre)
      ctx.beginPath();
      ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 8);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // --- TYPOGRAPHIE ---
      const textX = 185;

      // Pseudo (Blanc cassé doux)
      ctx.fillStyle = "#e2e5ea";
      ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
      ctx.fillText(player.personaname, textX, 75);

      // Petit point coloré pour le statut
      ctx.beginPath();
      ctx.arc(textX + 6, 104, 6, 0, Math.PI * 2);
      ctx.fillStyle = statusColor;
      ctx.fill();

      // Texte du statut
      ctx.fillStyle = statusColor;
      ctx.font = '18px "Segoe UI", Arial, sans-serif';
      ctx.fillText(statusText, textX + 22, 110);

      // Nombre de jeux
      if (gameCount > 0) {
        ctx.fillStyle = "#7a818c";
        ctx.font = '15px "Segoe UI", Arial, sans-serif';
        ctx.fillText(`${gameCount} jeux possédés`, textX, 140);
      }

      // --- BADGE DE NIVEAU ---
      const lvlColor = getLevelColor(level);
      const badgeX = 710;
      const badgeY = 80;
      const badgeR = 26;

      // Cercle intérieur sombre
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fillStyle = "#0b0c10";
      ctx.fill();

      // Bordure colorée plate (sans aucun effet 3D)
      ctx.lineWidth = 3;
      ctx.strokeStyle = lvlColor;
      ctx.stroke();

      // Numéro du niveau
      ctx.fillStyle = "#e2e5ea";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = 'bold 22px "Segoe UI", Arial, sans-serif';
      ctx.fillText(level, badgeX, badgeY + 2);

      // Libellé "Niveau"
      ctx.fillStyle = "#5f6773";
      ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
      ctx.fillText("NIVEAU", badgeX, badgeY + badgeR + 15);

      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      // --- LIGNE DE SÉPARATION ---
      ctx.beginPath();
      ctx.moveTo(textX, 165);
      ctx.lineTo(745, 165);
      ctx.strokeStyle = "#22262e";
      ctx.lineWidth = 1;
      ctx.stroke();

      // --- JEU RÉCENT ---
      if (lastGame) {
        try {
          // Format capsule standard
          const gameImgUrl = `https://cdn.akamai.steamstatic.com/steam/apps/${lastGame.appid}/capsule_184x69.jpg`;
          const gameImg = await loadImage(gameImgUrl);

          const gW = 147;
          const gH = 55;
          const gY = 185;

          ctx.save();
          ctx.beginPath();
          ctx.roundRect(textX, gY, gW, gH, 4);
          ctx.clip();
          ctx.drawImage(gameImg, textX, gY, gW, gH);
          ctx.restore();

          const gTextX = textX + gW + 15;

          // Nom du jeu
          ctx.fillStyle = "#c0c5ce";
          ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
          ctx.fillText(lastGame.name, gTextX, gY + 22);

          // Temps de jeu
          const hours2w = (lastGame.playtime_2weeks / 60).toFixed(1);
          const hoursTot = (lastGame.playtime_forever / 60).toFixed(1);

          ctx.fillStyle = "#7a818c";
          ctx.font = '14px "Segoe UI", Arial, sans-serif';
          ctx.fillText(
            `${hours2w}h récemment  •  ${hoursTot}h au total`,
            gTextX,
            gY + 45,
          );
        } catch (e) {
          ctx.fillStyle = "#7a818c";
          ctx.font = '15px "Segoe UI", Arial, sans-serif';
          ctx.fillText(lastGame.name, textX, 210);
        }
      } else {
        ctx.fillStyle = "#4a5059";
        ctx.font = 'italic 15px "Segoe UI", Arial, sans-serif';
        ctx.fillText("Aucune activité récente", textX, 210);
      }

      // Envoi de l'image
      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "steam-clean.png",
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Ouvrir le profil Steam")
          .setStyle(ButtonStyle.Link)
          .setURL(player.profileurl),
      );

      await interaction.editReply({ files: [attachment], components: [row] });
    } catch (err) {
      console.error(err);
      await interaction.editReply({
        content:
          "❌ Une erreur est survenue lors de la génération de la carte.",
      });
    }
  },
};
