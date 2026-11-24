const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (command.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    // 1. 🧹 NETTOYAGE DES ANCIENNES COMMANDES GLOBALES
    console.log('🧹 Suppression des anciennes commandes globales (fantômes)...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );
    console.log('✅ Registre global vidé !');

    // 2. 🚀 DÉPLOIEMENT SUR TON SERVEUR
    console.log(`🚀 Déploiement de ${commands.length} commandes slash sur le serveur...`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    
    console.log('✅ Commandes déployées avec succès !');
    console.log('📋 Commandes enregistrées :');
    commands.forEach(c => console.log(`  /${c.name} — ${c.description}`));
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();