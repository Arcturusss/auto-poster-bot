const { SlashCommandBuilder } = require('discord.js');
const { readConfig } = require('../events/configHelper');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start-post')
    .setDescription('Start your auto post'),

  async execute(interaction) {
    await interaction.reply({ content: 'Started Posting', ephemeral: true });

    const guildId = interaction.guild.id;
    const db = readConfig();
    const config = db.configs[guildId];

    if (!config || !config.channels || !Array.isArray(config.channels)) {
      return interaction.followUp({
        content: 'Configuration not found or invalid.',
        ephemeral: true,
      });
    }

    const logWebhook = config.logWebhook;

    for (const channel of config.channels) {
      const { id, message, delay, token } = channel;

      if (!token) {
        console.warn(`Token missing for channel ${id}, skipping`);
        continue;
      }

      const headers = {
        Authorization: token,
        'Content-Type': 'application/json',
      };

      let logCounter = 1; // if use webhook
      
      
      const postLoop = async () => {
        try {
          await axios.post(
            `https://discord.com/api/v10/channels/${id}/messages`,
            { content: message },
            { headers }
          );
          console.log(`Sent to <#${id}>`);

          if (logWebhook) {
            await axios.post(logWebhook, {
              content: `Message posted to <#${id}> #${logCounter}`,
            });
            logCounter++;
            console.log(`Sending information ${id}`);
          }
        } catch (err) {
          if (err.response && err.response.status === 429) {
            const retry = err.response.data.retry_after || 5;
            console.warn(`Rate limit hit. Retrying in ${retry}s`);
            await new Promise((res) => setTimeout(res, retry * 1000));
          } else {
            console.error(`Error sending to channel ${id}:`, err.message);
          }
        }

        await new Promise((res) => setTimeout(res, delay * 60 * 1000));
        postLoop();
      };

      postLoop();
    }
  },
};