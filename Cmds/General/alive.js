module.exports = async (context) => {
    const { client, m, prefix } = context;

    const botname = process.env.BOTNAME || "MICKEY-TECH";

    // Send image with caption
    await client.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/yaegaz' },
        caption: `Hello ${m.pushName}, Mickey-tech is active now.\n\nType ${prefix}menu to see my command list..\n\nDont forget to fork and star my repo.\n\nhttps://github.com/Mickeymozy/Mickey-tech`,
        fileLength: "9999999999898989899999999"
    }, { quoted: m });

    // Send audio file
    await client.sendMessage(m.chat, {
        audio: { url: 'https://files.catbox.moe/3jcl13.mp3' }, // Replace with your actual audio URL
        mimetype: 'audio/mp4',
        ptt: true // Set to true for push-to-talk (voice note style), false for regular audio
    }, { quoted: m });
}
