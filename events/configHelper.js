const fs = require('fs');
const path = './db.json';

function readConfig() {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({ configs: {} }, null, 2));
  }
  const data = fs.readFileSync(path);
  return JSON.parse(data);
}

function writeConfig(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function setConfig(guildId, newChannel, logWebhook) {
  const db = readConfig();
  if (!db.configs[guildId]) db.configs[guildId] = { channels: [] };

  const existingIndex = db.configs[guildId].channels.findIndex(c => c.id === newChannel.id);
  if (existingIndex !== -1) {
    db.configs[guildId].channels[existingIndex] = newChannel;
  } else {
    db.configs[guildId].channels.push(newChannel);
  }

  if (logWebhook) db.configs[guildId].logWebhook = logWebhook;
  writeConfig(db);
}
module.exports = { setConfig, readConfig, writeConfig };