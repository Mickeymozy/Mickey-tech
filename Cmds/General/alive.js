module.exports = async (context) => {
    const { client, m, prefix } = context;

    const botname = process.env.BOTNAME || "MICKEY-TECH";

    // Send image with caption
    await client.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/yaegaz' },
        caption: `Hey hey! ${m.pushName}, ⚡️ You’ve just summoned a friendly cyber ghost. What’s your command?.\n\nThe repo master holds the keys—ping 'em!`,
        fileLength: "9999999999898989899999999"
    }, { quoted: m });

    // Send video file instead of video
    await client.sendMessage(m.chat, {
        video: { url: 'https://files.catbox.moe/l7d2gk.mp4' }, 
        caption: `⚡ Beep-boop! Vital signs: 💯. Mood: electric. Status: alive and kickin' like a caffeinated kangaroo! 🦘☕⚡. 🚀`
    }, { quoted: m });
}
