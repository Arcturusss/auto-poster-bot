const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const { readConfig } = require('../events/configHelper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit-config')
    .setDescription('edit configuration auto post')
    .addStringOption(option =>
      option.setName('channel_id')
        .setDescription('ID channel which to edit')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channelId = interaction.options.getString('channel_id');
    const guildId = interaction.guild.id;
    const db = readConfig();

    const config = db.configs[guildId]?.channels?.find(c => c.id === channelId);
    if (!config) {
      return interaction.reply({
        content: 'configuration channel is not found',
        ephemeral: true
      });
    }

    const modal = new ModalBuilder()
      .setCustomId(`editConfigModal-${channelId}`)
      .setTitle('Edit channel configuration');

    const channelIdInput = new TextInputBuilder()
      .setCustomId('channelId')
      .setLabel('Channel ID')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(config.id);

    const messageInput = new TextInputBuilder()
      .setCustomId('message')
      .setLabel('Messages')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setValue(config.message);

    const delayInput = new TextInputBuilder()
      .setCustomId('delay')
      .setLabel('Delay (minutes)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(config.delay.toString());

    modal.addComponents(
      new ActionRowBuilder().addComponents(channelIdInput),
      new ActionRowBuilder().addComponents(messageInput),
      new ActionRowBuilder().addComponents(delayInput)
    );

    await interaction.showModal(modal);
  }
};