const {
  Events,
  ActivityType
} = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
      console.log(`Logged as ${client.user.tag}`);
      client.user.setPresence({
          activities: [{
              name: 'Auto post',
              type: ActivityType.Watching
          }],
      });
    }
};