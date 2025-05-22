const { Events } = require('discord.js');
const { readConfig, writeConfig } = require('./configHelper');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const cmd = interaction.client.commands.get(interaction.commandName);
      if (!cmd) return;

      try {
        await cmd.execute(interaction);
      } catch (err) {
        console.error(err);
        const errorMessage = {
          content: 'There was an error while executing the command.',
          ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }

    // Handle Modal Submission
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('editConfigModal')) {
        try {
          const channelId = interaction.fields.getTextInputValue('channelId');
          const message = interaction.fields.getTextInputValue('message');
          const delay = parseInt(interaction.fields.getTextInputValue('delay'));

          const guildId = interaction.guild.id;
          const db = readConfig();

          if (!db.configs[guildId]) db.configs[guildId] = { channels: [] };

          const oldToken = db.configs[guildId].channels.find(c => c.id === channelId)?.token || '';

          const newData = {
            id: channelId,
            message,
            delay,
            token: oldToken
          };

          const index = db.configs[guildId].channels.findIndex(c => c.id === channelId);
          if (index !== -1) {
            db.configs[guildId].channels[index] = newData;
          } else {
            db.configs[guildId].channels.push(newData);
          }

          writeConfig(db);

          await interaction.reply({
            content: `Configuration for \`${channelId}\` successfully saved`,
            ephemeral: true
          });
        } catch (err) {
          console.error('Error while saving:', err);
          await interaction.reply({
            content: 'Error while saving configuration',
            ephemeral: true
          });
        }
      }
    }
  }
};