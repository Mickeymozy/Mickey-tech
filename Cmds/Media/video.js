const yts = require("yt-search");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🎬 Tafadhali andika jina la video au wimbo unalotaka.");
    }

    try {
        // Tafuta video kwenye YouTube
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("🚫 Samahani, siwezi kupata video hiyo.");
        }

        const video = videos[0];
        const videoUrl = video.url;

        // Pitia API ya /youtube/mp4
        const apiResponse = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp4?query=${encodeURIComponent(videoUrl)}`);

        if (!apiResponse.ok) {
            throw new Error(`API haijajibu vizuri. Status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        if (!data?.result?.url || !data?.result?.title) {
            throw new Error("⛔ Hakuna video URL kwenye majibu ya API.");
        }

        const downloadUrl = data.result.url;
        const title = data.result.title;

        // Tuma ujumbe wa kuanza
        await m.reply(`📤 Inatuma video: *${title}*`);

        // Tuma video kwa WhatsApp
        await client.sendMessage(m.chat, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: `${title}.mp4`,
            caption: `🎬 ${title}`
        }, { quoted: m });

    } catch (error) {
        console.error("❌ Error:", error.message);
        await m.reply("⚠️ Imeshindikana kutuma video: " + error.message);
    }
};
