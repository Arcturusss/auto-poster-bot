const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const cmdPath = path.join(__dirname, 'commands');
const cmdFilesOrFolders = fs.readdirSync(cmdPath);

for (const name of cmdFilesOrFolders) {
  const fullPath = path.join(cmdPath, name);

  if (fs.lstatSync(fullPath).isDirectory()) {
    const cmdFiles = fs.readdirSync(fullPath).filter(file => file.endsWith('.js'));
    for (const file of cmdFiles) {
      const filePath = path.join(fullPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.warn(`[WARNING] Command at ${filePath} is missing data or execute property.`);
      }
    }
  } else if (name.endsWith('.js')) {
    const command = require(fullPath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`[WARNING] Command at ${fullPath} is missing data or execute property.`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(config.TOKEN);
const commandsJSON = client.commands.map(cmd => cmd.data.toJSON());

(async () => {
  try {
    console.log(`Started refreshing ${commandsJSON.length} application (/) commands.`);

    await rest.put(
      Routes.applicationCommands(config.CLIENT_ID),
      { body: commandsJSON }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Login bot
client.login(config.TOKEN);