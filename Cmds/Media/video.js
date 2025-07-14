const yts = require("yt-search");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("Please provide a song name!");
    }

    try {
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            throw new Error("No songs found!");
        }

        const song = videos[0];

        const response = await fetch(`https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(song.url)}`);
        if (!response.ok) {
            throw new Error(`Download failed with status ${response.status}`);
        }

        const data = await response.json();
        if (!data?.result?.download_url) {
            throw new Error("Audio URL missing in API response.");
        }

        await m.reply(`_Downloading ${data.result.title}_`);

        await client.sendMessage(m.chat, {
            document: { url: data.result.download_url },
            mimetype: "audio/mpeg",
            fileName: `${data.result.title}.m4a`
        }, { quoted: m });

    } catch (error) {
        console.error("Error in play command:", error.message);
        return m.reply("Download failed: " + error.message);
    }
};
