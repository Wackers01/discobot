require('dotenv').config();
const { Client, Intents, WebhookClient } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);

const commands = {
    search: require('./commands/search'),
    joke: require('./commands/joke'),
    fact: require('./commands/fact'),
    help: require('./commands/help')
};

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const [command, ...args] = message.content.slice(config.prefix.length).trim().split(/ +/);

    try {
        if (command in commands) {
            await commands[command](message, args, webhookClient);
        } else {
            message.channel.send(`Unknown command. Use \`${config.prefix}help\` to see available commands.`);
        }
    } catch (error) {
        console.error(error);
        message.channel.send('An error occurred while processing the command.');
    }
});

client.login(config.discord_token);
