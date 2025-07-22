module.exports = async (context) => {
    const { client, m } = context;
    const botname = process.env.BOTNAME || "MICKEY-TECH";

    // Send image only
    await client.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/yaegaz' },
        caption: `👻 Hey ${m.pushName}, you’ve want ${botname}! This repository is private. Please contact the owner for access. .`,
        fileLength: "9999999999898989899999999" // Optional spoof
    }, { quoted: m });

    // Random audio playback
    const audioClips = [
        'https://files.catbox.moe/pprmsa.mp3',
        'https://files.catbox.moe/rgdlzy.mp3',
        'https://files.catbox.moe/rgdlzy.mp3'
    ];

    const randomAudio = audioClips[Math.floor(Math.random() * audioClips.length)];

    await client.sendMessage(m.chat, {
        audio: { url: randomAudio },
        mimetype: 'audio/mp4',
        ptt: true
    }, { quoted: m });
};
