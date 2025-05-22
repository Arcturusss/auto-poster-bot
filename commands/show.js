const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('show-config')
    .setDescription('Show configuration for auto post'),

  async execute(interaction) {
    let config;
    try {
      config = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: 'Error while reading configuration',
        ephemeral: true
      });
    }

    const guildId = interaction.guild.id;
    const guildConfig = config.configs[guildId];

    if (!guildConfig || !guildConfig.channels || guildConfig.channels.length === 0) {
      return interaction.reply({
        content: 'No configuration found for this server.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('Auto Post Configuration')
      .setColor('Purple')
      .setFooter({ text: `Server: ${interaction.guild.name}` });

    guildConfig.channels.forEach((ch, i) => {
      embed.addFields({
        name: `#${i + 1} - Channel ID: ${ch.id}`,
        value: `Message: ${ch.message}\nDelay: ${ch.delay} minutes`,
        inline: false
      });
    });

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};