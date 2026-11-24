# Changelog — Optimisations, corrections & nouvelles commandes

## ⚠️ Sécurité (important)
- Ton fichier `.env` contenait ton **vrai token Discord en clair**. Il a été retiré des fichiers renvoyés.
  **Régénère ce token dès que possible** : Developer Portal → ton application → Bot → *Reset Token*.
- La commande `/troll` (`commands/utility/serie.js`) a été **supprimée**. Elle mentionnait une personne
  35 fois d'affilée dans un thread caché puis supprimait tout (messages + thread) pour effacer les traces —
  c'est un outil de harcèlement ciblé, donc je ne l'ai ni gardé ni amélioré.

## 🐛 Bugs corrigés
- **`events/guildMemberUpdate.js`** contenait par erreur une copie du code de `/testboost` (mauvais fichier,
  mauvaise structure : pas de `name`/`execute` d'event valide → ne se déclenchait jamais). Remplacé par un
  vrai détecteur automatique de boost (attribution du rôle + message de remerciement, sans avoir besoin de
  lancer `/testboost` à la main).
- **`utils/logger.js`** : l'ID de salon de logs était un placeholder (`'ID_DE_TON_SALON_LOGS'`) jamais
  rempli → la fonction ne faisait jamais rien. Elle utilise maintenant `MOD_LOG_CHANNEL` depuis `.env`,
  et est maintenant branchée sur `/ban`, `/kick`, `/warn`, `/mute`, `/timeout`, `/unban`, `/unmute`.
- **`commands/moderation/ban.js`** : utilisait `deleteMessageDays` (option dépréciée) → remplacé par
  `deleteMessageSeconds`.
- **`commands/moderation/warnings.js`** : plantait si un membre avait plus de 25 avertissements (limite
  Discord de 25 champs par embed). Affiche maintenant les 25 warns les plus récents avec une note.
- **`commands/fun/ship.js`** : `.setDescription()` était appelé deux fois, la deuxième écrasait la première
  et dupliquait l'info de compatibilité. Nettoyé.
- **`events/messageCreate.js`** :
  - Le salon "anti-bot" bannissait **n'importe qui** y écrivant, y compris les administrateurs/modérateurs
    par erreur. Le staff (Administrateur / Gérer le serveur) est maintenant exempté.
  - Le code plantait si `message.member` était `null` (ex. message de webhook). Ajout d'une garde.
  - L'anti-spam appliquait un timeout même aux modérateurs. Les membres avec `Gérer les messages` sont
    maintenant exemptés.
- **`commands/fun/anonyme.js`** : n'importe qui pouvait envoyer un message anonyme ciblant n'importe qui,
  sans aucune restriction ni traçabilité (risque de harcèlement anonyme). Restreint aux modérateurs
  (`Gérer les messages`) et l'auteur réel est maintenant loggué dans le salon de modération (le message
  reste anonyme pour les membres, mais traçable en cas d'abus).
- `/help` référençait des commandes qui n'existaient jamais : `/nick`, `/roast`, `/couleur`, `/compliment`,
  `/anniversaire`. Toutes les cinq ont été créées (voir ci-dessous).

## ✨ Nouvelles commandes
| Commande | Catégorie | Description |
|---|---|---|
| `/nick` | Modération | Change le pseudo d'un membre (ou le réinitialise) |
| `/roast` | Fun | Balance un roast gentil et générique sur un membre |
| `/couleur` | Utilitaire | Infos + aperçu d'une couleur HEX (RGB, HSL, swatch) |
| `/compliment` | Social | Envoie un compliment aléatoire à un membre |
| `/anniversaire` | Social | Souhaite un joyeux anniversaire (avec âge optionnel) |
| `/ping` | Utilitaire | Latence du bot et de l'API Discord |
| `/stats` | Utilitaire | Statistiques du bot (serveurs, membres, uptime, mémoire) |

## 🔧 Autres améliorations
- Les IDs codés en dur (`BOOST_ROLE_ID`, `ANTI_BOT_CHANNEL_ID`) peuvent maintenant être configurés via
  `.env` (avec les anciennes valeurs gardées en fallback), voir `.env.example`.
- `node_modules/` et `.git/` ont été retirés du zip livré (fais `npm install` après extraction).

## ▶️ Pour redémarrer le bot
```bash
npm install
node deploy-commands.js   # redéploie les commandes slash (nouvelles + modifiées)
npm start
```
