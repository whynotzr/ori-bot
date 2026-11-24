// utils/embeds.js — Embeds anime/gaming stylisés
const { EmbedBuilder } = require('discord.js');

const COLORS = {
  success: 0x57F287,   // vert
  error:   0xED4245,   // rouge
  warning: 0xFEE75C,   // jaune
  info:    0x5865F2,   // bleu Discord
  mod:     0xFF6B35,   // orange modération
  fun:     0xFF73FA,   // rose fun
  anime:   0xFF0080,   // magenta anime
  gaming:  0x00D4FF,   // cyan gaming
};

function success(title, description, extras = {}) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: extras.footer || '🌸 Anime & Gaming Bot' });
}

function error(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: '🌸 Anime & Gaming Bot' });
}

function mod(action, target, moderator, reason, extras = {}) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.mod)
    .setTitle(`🛡️ ${action}`)
    .addFields(
      { name: '👤 Utilisateur', value: `${target} (${target.id})`, inline: true },
      { name: '⚔️ Modérateur', value: `${moderator}`, inline: true },
      { name: '📝 Raison', value: reason || 'Aucune raison fournie' }
    )
    .setTimestamp()
    .setFooter({ text: '🌸 Anime & Gaming Bot — Modération' });
  if (extras.duration) embed.addFields({ name: '⏱️ Durée', value: extras.duration, inline: true });
  if (target.displayAvatarURL) embed.setThumbnail(target.displayAvatarURL());
  return embed;
}

function fun(title, description, color = COLORS.fun) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: '🌸 Anime & Gaming Bot' });
}

function info(title, description, fields = []) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.info)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({ text: '🌸 Anime & Gaming Bot' });
  if (fields.length) embed.addFields(fields);
  return embed;
}

module.exports = { success, error, mod, fun, info, COLORS };
