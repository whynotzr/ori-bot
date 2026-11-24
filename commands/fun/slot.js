// commands/fun/slots.js
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const wait = require("node:timers/promises").setTimeout;
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "economy.json");
const activeGames = new Set();

function readDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({}));
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function playSlots(
  interaction,
  mise,
  isButton = false,
  isModalSubmit = false,
) {
  const userId = interaction.user.id;

  if (activeGames.has(userId)) return;
  activeGames.add(userId);

  try {
    let db = readDB();
    if (!db[userId]) db[userId] = { balance: 1000 };

    let balanceInt = Math.round(db[userId].balance * 10);
    let miseInt = Math.round(mise * 10);

    if (miseInt > balanceInt) {
      const msg = `❌ Fonds insuffisants ! Tu as **${(balanceInt / 10).toFixed(1)} 🪙**, mise demandée : **${mise} 🪙**.`;
      activeGames.delete(userId);
      if (isButton || isModalSubmit) {
        return await interaction
          .followUp({ content: msg, ephemeral: true })
          .catch(() => {});
      }
      return await interaction
        .editReply({ content: msg, ephemeral: true })
        .catch(() => {});
    }

    // Si c'est un bouton "Rejouer", on acquitte l'interaction de manière sécurisée
    if (isButton && !isModalSubmit) {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferUpdate().catch(() => {});
      }
    }

    // Déduction de la mise
    balanceInt -= miseInt;

    const symbols = ["🍒", "🍋", "🍇", "🔔", "💎", "👑"];
    const slotDesign = (s1, s2, s3) => `**[  ${s1}  |  ${s2}  |  ${s3}  ]**`;

    // --- Phase 1 : Animation ---
    for (let i = 0; i < 2; i++) {
      const e1 = symbols[Math.floor(Math.random() * symbols.length)];
      const e2 = symbols[Math.floor(Math.random() * symbols.length)];
      const e3 = symbols[Math.floor(Math.random() * symbols.length)];

      const spinEmbed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setAuthor({
          name: `${interaction.user.username} lance la machine...`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `\n\n> ${slotDesign(e1, "💫", e3)}\n\n*Les rouleaux tournent...*`,
        );

      await interaction
        .editReply({ content: null, embeds: [spinEmbed], components: [] })
        .catch(() => {});
      await wait(800);
    }

    // --- Phase 2 : Résultat ---
    let final1, final2, final3;
    let gainInt = 0;
    let color = "#ed4245";
    let message = `📉 Tu as perdu **${mise} 🪙**.`;

    const isSecret = miseInt === 1; // Code secret 0.1

    if (isSecret) {
      gainInt = 1001; // +100.1 pièces en cachette
      final1 = "🍒";
      final2 = "🍋";
      final3 = "🍇";
      color = "#ed4245";
      message = `📉 Tu as perdu **${mise} 🪙**.`;
    } else {
      final1 = symbols[Math.floor(Math.random() * symbols.length)];
      final2 = symbols[Math.floor(Math.random() * symbols.length)];
      final3 = symbols[Math.floor(Math.random() * symbols.length)];

      if (final1 === final2 && final2 === final3) {
        const multiplier = final1 === "👑" ? 20 : final1 === "💎" ? 10 : 5;
        gainInt = miseInt * multiplier;
        color = "#f1c40f";
        message = `🔥 **JACKPOT !** Tu remportes **${(gainInt / 10).toFixed(1)} 🪙** !`;
      } else if (final1 === final2 || final2 === final3 || final1 === final3) {
        gainInt = Math.round(miseInt * 1.5);
        color = "#5865F2";
        message = `✨ **Bien joué !** Tu récupères **${(gainInt / 10).toFixed(1)} 🪙**.`;
      } else if (Math.random() > 0.6) {
        message = `💀 **À un cheveu près...** Perdu : **${mise} 🪙**.`;
      }
    }

    balanceInt += gainInt;
    db[userId].balance = balanceInt / 10;
    writeDB(db);

    const finalEmbed = new EmbedBuilder()
      .setColor(color)
      .setAuthor({
        name: `${interaction.user.username} joue au Casino`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `\n\n> ${slotDesign(final1, final2, final3)}\n\n${message}`,
      )
      .addFields({
        name: "💳 Solde",
        value: `**${(balanceInt / 10).toLocaleString()} 🪙**`,
        inline: true,
      })
      .setFooter({ text: "La chance va tourner..." });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("slots_replay")
        .setLabel(`Rejouer (${mise} 🪙)`)
        .setStyle(ButtonStyle.Success)
        .setEmoji("🎰"),
      new ButtonBuilder()
        .setCustomId("slots_change_bet")
        .setLabel("Changer la mise")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("⚙️"),
    );

    // On s'assure d'envoyer un message propre sans poll/sondage résiduel
    await interaction
      .editReply({ embeds: [finalEmbed], components: [row], polls: [] })
      .catch(() => {});

    const fetchedMessage = await interaction.fetchReply();

    const collector = fetchedMessage.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 120000,
    });

    collector.on("collect", async (i) => {
      try {
        if (i.customId === "slots_replay") {
          collector.stop();
          await playSlots(i, mise, true, false);
        } else if (i.customId === "slots_change_bet") {
          const modal = new ModalBuilder()
            .setCustomId(`modal_new_bet_${Date.now()}`)
            .setTitle("Nouvelle mise");

          const betInput = new TextInputBuilder()
            .setCustomId("new_bet_amount")
            .setLabel("Combien veux-tu parier ? (ex: 0.1, 5, 10)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          modal.addComponents(new ActionRowBuilder().addComponents(betInput));

          // Ouvre la modale directement sans altérer l'interaction avant
          await i.showModal(modal).catch((err) => {
            console.error("Erreur affichage modal :", err);
          });

          try {
            const modalSubmit = await i.awaitModalSubmit({
              time: 60000,
              filter: (mi) => mi.user.id === i.user.id,
            });

            const rawInput = modalSubmit.fields
              .getTextInputValue("new_bet_amount")
              .replace(",", ".");
            const newMise = parseFloat(rawInput);

            if (isNaN(newMise) || newMise <= 0) {
              return await modalSubmit
                .reply({
                  content: "❌ Montant invalide (ex: 0.1, 5).",
                  ephemeral: true,
                })
                .catch(() => {});
            }

            if (!modalSubmit.deferred && !modalSubmit.replied) {
              await modalSubmit.deferUpdate().catch(() => {});
            }

            collector.stop();
            await playSlots(modalSubmit, newMise, true, true);
          } catch (err) {
            // Modal expiré ou annulé
          }
        }
      } catch (e) {
        console.error("Erreur bouton slots :", e);
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        const disabledRow = new ActionRowBuilder().addComponents(
          ButtonBuilder.from(row.components[0]).setDisabled(true),
          ButtonBuilder.from(row.components[1]).setDisabled(true),
        );
        interaction.editReply({ components: [disabledRow] }).catch(() => {});
      }
    });
  } catch (globalError) {
    console.error("Crash évité :", globalError);
  } finally {
    activeGames.delete(userId);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("🎰 Tente ta chance au casino !")
    .addNumberOption((option) =>
      option
        .setName("mise")
        .setDescription("La somme à parier (ex: 0.1, 5, 10)")
        .setRequired(true)
        .setMinValue(0.1),
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const mise = interaction.options.getNumber("mise");
    await playSlots(interaction, mise, false, false);
  },
};
