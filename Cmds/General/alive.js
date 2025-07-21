module.exports = async (context) => {
    const { client, m, prefix } = context;

    const botname = process.env.BOTNAME || "MICKEY-TECH";

    // Send image with caption
    await client.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/yaegaz' },
        caption: `Hello ${m.pushName}, Mickey-tech is active now.\n\nType ${prefix}menu to see my command list..\n\nDont forget to fork and star my repo.\n\nhttps://github.com/Mickeymozy/Mickey-tech`,
        fileLength: "9999999999898989899999999"
    }, { quoted: m });

    // Send video file instead of audio
    await client.sendMessage(m.chat, {
        video: { url: 'https://files.catbox.moe/4hof04.mp4' }, 
        mimetype: 'video/mp4',
        caption: `Here’s a quick intro video from Mickey-tech. 🚀`
    }, { quoted: m });
}
