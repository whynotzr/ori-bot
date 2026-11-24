// events/ready.js
module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`\n✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`📡 Présent sur ${client.guilds.cache.size} serveur(s)`);
    console.log(`🎮 ${client.commands.size} commandes chargées\n`);

    const statuses = [
      { name: "🌸 /help", type: 0 },
      { name: "🧊 /orih", type: 0 },
      { name: "🌷 ori supremacy", type: 0 },
      { name: "💖 la communauté", type: 0 },
    ];

    let i = 0;
    const setStatus = () => {
      client.user.setActivity(statuses[i].name, { type: statuses[i].type });
      i = (i + 1) % statuses.length;
    };
    setStatus();
    setInterval(setStatus, 15000);
  },
};
