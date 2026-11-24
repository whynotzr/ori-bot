// commands/economy/leaderboard.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "fun", "economy.json"); // Ajuste le chemin selon l'endroit où est ton leaderboard.js

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("🏆 Afficher le classement des joueurs les plus riches"),

  async execute(interaction) {
    if (!fs.existsSync(dbPath)) {
      return await interaction.reply({
        content: "❌ Aucune donnée économique trouvée pour le moment.",
        ephemeral: true,
      });
    }

    const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

    // Transformer l'objet en tableau, trier par solde décroissant et garder les 10 premiers
    const topPlayers = Object.entries(db)
      .map(([userId, data]) => ({ userId, balance: data.balance }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    if (topPlayers.length === 0) {
      return await interaction.reply({
        content: "📉 Le classement est vide.",
        ephemeral: true,
      });
    }

    let description = "";
    const médailles = ["🥇", "🥈", "🥉"];

    topPlayers.forEach((player, index) => {
      const rankIcon = index < 3 ? médailles[index] : `**#${index + 1}**`;
      description += `${rankIcon} <@${player.userId}> — **${player.balance.toLocaleString()} 🪙**\n`;
    });

    const embed = new EmbedBuilder()
      .setColor("#f1c40f")
      .setTitle("🏆 Classement du Casino")
      .setDescription(description)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: `Demandé par ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  },
};
