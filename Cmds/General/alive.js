//alive.js

module.exports = async (context) => {
    const { client, m, prefix } = context;
const audioUrl = "https://files.catbox.moe/3jcl13.mp3";

const botname = process.env.BOTNAME || "MICKEY-TECH";

 await client.sendMessage(m.chat, { audio: { url: 'https://files.catbox.moe/3jcl13.mp3"' }, { image: { url: 'https://files.catbox.moe/yaegaz' }, caption: `Hello ${m.pushName}, Mickey-tech is active now.\n\nType ${prefix}menu to see my command list..\n\nDont forget to fork and star my repo \.\n\n  https://github.com/Mickeymozy/Mickey-tech`, fileLength: "9999999999898989899999999" }, { quoted: m }); 

}
