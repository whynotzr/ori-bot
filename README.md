# 🌸 Anime & Gaming Discord Bot

Bot Discord complet avec reaction roles aesthetics, modération avancée, commandes fun et plus !

---

## 📦 Structure du projet

```
discord-bot/
├── index.js                    ← Point d'entrée du bot
├── deploy-commands.js          ← Déploiement des commandes slash
├── package.json
├── .env.example                ← Copier en .env et remplir
├── commands/
│   ├── reaction_roles/
│   │   └── reactionroles.js    ⭐ COMMANDE PHARE : panels reaction roles
│   ├── moderation/
│   │   ├── ban.js
│   │   ├── unban.js
│   │   ├── kick.js
│   │   ├── mute.js             (timeout Discord)
│   │   ├── unmute.js
│   │   ├── warn.js
│   │   ├── warnings.js         (liste + clear)
│   │   ├── clear.js            (purge messages)
│   │   ├── lock.js
│   │   ├── unlock.js
│   │   └── transfer.js         ⭐ Invite vers second serveur
│   ├── fun/
│   │   ├── ball8.js            (/8ball)
│   │   ├── dice.js             (/dé)
│   │   ├── coinflip.js         (/pile-ou-face)
│   │   ├── rps.js              (/pfc — Pierre Feuille Ciseaux)
│   │   ├── ship.js             (/ship — compatibilité)
│   │   ├── rate.js             (/note)
│   │   └── chien.js            ⭐ LA commande drôle (/chien)
│   ├── utility/
│   │   ├── userinfo.js
│   │   ├── serverinfo.js
│   │   ├── avatar.js
│   │   └── help.js
│   └── social/
│       └── announce.js         (/announce — embed stylisé)
├── events/
│   ├── ready.js
│   ├── interactionCreate.js    (gestion des slash commands + cooldowns)
│   ├── messageReactionAdd.js   (attribuer rôles)
│   └── messageReactionRemove.js(retirer rôles)
├── utils/
│   ├── reactionRolesDB.js      (stockage JSON des panels)
│   ├── warnsDB.js              (stockage JSON des warns)
│   └── embeds.js               (helpers embeds stylisés)
└── data/                       (créé automatiquement)
    ├── reaction_roles.json
    └── warns.json
```

---

## 🚀 Installation pas à pas

### 1. Créer ton bot Discord

1. Va sur [discord.com/developers/applications](https://discord.com/developers/applications)
2. Clique **"New Application"** → donne-lui un nom
3. Va dans **Bot** → clique **"Add Bot"**
4. Active ces **Privileged Gateway Intents** :
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
5. Copie le **Token** (garde-le secret !)
6. Va dans **OAuth2 > URL Generator** :
   - Scopes : `bot`, `applications.commands`
   - Permissions : `Administrator` (ou les permissions spécifiques)
   - Copie l'URL et invite le bot sur ton serveur

### 2. Configurer le projet

```bash
# Cloner / copier le dossier
cd discord-bot

# Installer les dépendances
npm install

# Copier le fichier de config
cp .env.example .env
```

Ouvre `.env` et remplis :
```env
TOKEN=ton_token_discord
CLIENT_ID=l_id_de_ton_application
GUILD_ID=l_id_de_ton_serveur_principal
GUILD_ID_2=l_id_du_second_serveur        # pour /transfer
MOD_LOG_CHANNEL=l_id_du_canal_de_logs   # optionnel
```

**Comment trouver les IDs ?**
- Active le mode développeur : Paramètres Discord → Apparence → Mode développeur ✅
- Clic droit sur le serveur → **Copier l'identifiant du serveur**
- Clic droit sur ton application dans Developer Portal → **Copier l'ID**

### 3. Déployer les commandes

```bash
npm run deploy
```

Tu verras dans la console la liste de toutes les commandes enregistrées.

### 4. Démarrer le bot

```bash
npm start
# ou en développement (redémarre automatiquement) :
npm run dev
```

---

## ⭐ Commandes principales

### 🎭 `/reactionroles` — Le truc le plus stylé

Crée un panel complet directement dans la commande :

```
/reactionroles
  titre: 🎮 Choisis ton style de jeu
  description: Réagis pour obtenir ton rôle !\n\nBienvenue sur le serveur !
  couleur: 🌸 Rose Anime
  emoji1: 🎮  role1: @Gamer      label1: Gamer
  emoji2: 📺  role2: @Watcher    label2: Je regarde
  emoji3: ✍️  role3: @Créateur   label3: Créateur de contenu
  image: https://ton-image-banniere.png
```

→ Le bot envoie un embed et ajoute automatiquement les réactions !
→ Les rôles sont donnés/retirés automatiquement quand quelqu'un réagit.

**Jusqu'à 8 rôles par panel.** Tu peux utiliser des emojis custom de ton serveur !

---

### 🐕 `/chien` — La commande drôle

```
/chien maître:@Pseudo animal:🐕 Chien
```

Résultat dans le chat :
> **TonPseudo** 🐕 de **Pseudo**

Options : `🐕 Chien`, `🐱 Chat`, `🤡 Esclave`
Le bot choisit une phrase aléatoire parmi plusieurs variantes !

---

### 🔀 `/transfer` — Transfert entre serveurs

```
/transfer membre:@Pseudo message: Rejoins notre serveur principal !
```

→ Envoie un lien d'invitation privé en DM au membre (1h, 1 utilisation)
→ Nécessite `GUILD_ID_2` dans `.env`
→ Le bot doit être sur les DEUX serveurs

---

### 📢 `/announce`

```
/announce
  titre: 🎉 Événement spécial !
  message: Ce soir à 21h\nTournoi Minecraft\nPrix : Nitro !
  couleur: 💙 Bleu Gaming
  salon: #annonces
  ping: @everyone
```

---

## 🛡️ Permissions requises pour le bot

| Commande         | Permission nécessaire     |
|------------------|---------------------------|
| /ban, /unban     | Bannir des membres        |
| /kick            | Expulser des membres      |
| /mute, /unmute   | Modérer les membres       |
| /warn, /warnings | Modérer les membres       |
| /clear           | Gérer les messages        |
| /lock, /unlock   | Gérer les salons          |
| /reactionroles   | Gérer les rôles           |
| /transfer        | Gérer le serveur          |
| /announce        | Gérer les messages        |

---

## 🔧 Ajouter de nouvelles commandes

1. Crée un fichier dans le bon dossier `commands/catégorie/macommande.js`
2. Respecte la structure :

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('macommande')
    .setDescription('Description'),
  cooldown: 5, // secondes (optionnel, défaut 3s)
  async execute(interaction, client) {
    await interaction.reply('Hello !');
  }
};
```

3. Relance `npm run deploy` puis `npm start`

---

## 📝 Notes techniques

- **Stockage** : fichiers JSON locaux dans `data/` (pas besoin de base de données)
- **Reaction roles** : persistent entre les redémarrages du bot grâce au JSON
- **Warns** : persistent également, avec horodatage et ID de modérateur
- **Cooldowns** : système intégré, configurable par commande
- **Node.js 18+** requis

---

*Bot créé avec ❤️ — Thème Anime & Gaming 🌸🎮*
