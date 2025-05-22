const { SlashCommandBuilder } = require('discord.js');
const { setConfig } = require('../events/configHelper');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-config')
    .setDescription('Set your configuration for auto post')
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Fill in with your bot token')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('channel_id')
        .setDescription('Channel ID to post')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Message to post')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('delay')
        .setDescription('Delay in minutes between each post')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('log_webhook')
        .setDescription('Optional: Webhook URL for logging')),

  async execute(interaction) {
    const token = interaction.options.getString('token');
    const channelId = interaction.options.getString('channel_id');
    const message = interaction.options.getString('message');
    const delay = interaction.options.getInteger('delay');
    const logWebhook = interaction.options.getString('log_webhook') || null;

    const guildId = interaction.guild.id;

    // Simpan konfigurasi ke db.json
    try {
      setConfig(guildId, {
        id: channelId,
        message: message,
        delay: delay,
        token: token
      }, logWebhook);

      await interaction.reply({
        content: 'Configuration saved successfully!',
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: 'Failed to save configuration.',
        ephemeral: true
      });
    }
  }
};