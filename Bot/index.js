// Setting all dependecies for the bot 
require('dotenv').config();

const {Client, Events, GatewayIntentBits} = require('discord.js');
const {Configuration, OpenAIApi} = require("openai");
const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent]});


// Bot on configuration
client.once(Events.ClientReady, c =>{
    console.log(`Tamo redy papi como ${c.user.tag}`);
});

// Setting the openai api configuration
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

//Async function for the message creation for discord
client.on(Events.MessageCreate, async (msg) => {
    if(msg.author.bot) return;//Handle the bot dont reply self or other message for bot 
    if(msg.channel.id !== process.env.CHANNEL_ID) return;
    if(msg.content.startsWith("!")) return;

    let conversationlog = [{role: 'system', content: 'You are a friendly chatbot.'}] //Object to pass the conversation to the request object

    conversationlog.push({
        role: 'user',
        content: msg.content,

    })

    await msg.channel.sendTyping();

    const result = await openai.createChatCompletion({//request object
        model: "gpt-3.5-turbo",
        messages: conversationlog,
    })

    msg.reply(result.data.choices[0].message)
});


client.login(process.env.DISCORD_TOKEN);
