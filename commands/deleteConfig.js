const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('reset-config')
      .setDescription('Reset your configuration'),

  async execute(interaction) {
    try {
      fs.writeFileSync(dbPath, JSON.stringify({ configs: {} }, null, 2));
      await interaction.reply({
        content: 'Successfully reset config!',
        ephemeral: true,
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: 'Failed to reset configuration.',
        ephemeral: true,
      });
    }
  },
};