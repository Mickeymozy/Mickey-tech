const yts = require("yt-search");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🔎 Tafadhali andika jina la wimbo unalotaka.");
    }

    try {
        // Tafuta wimbo YouTube
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("🚫 Samahani, siwezi kupata wimbo huo.");
        }

        const song = videos[0];

        // Pata audio download link kutoka kwa API
        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(song.url)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API haijajibu vizuri. Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data?.result?.download_url) {
            throw new Error("⛔ Hakuna link ya kupakua audio kutoka kwa API.");
        }

        // Tuma ujumbe wa kuwa inapakua
        await m.reply(`⬇️ Inapakua: *${data.result.title}*`);

        // Tuma audio kama sauti ya kawaida (si voice note)
        await client.sendMessage(m.chat, {
            audio: { url: data.result.download_url },
            mimetype: "audio/mpeg",
            fileName: `${data.result.title}.mp3`,
            ptt: false // weka true kama unataka voice note
        }, { quoted: m });

    } catch (error) {
        console.error("❌ Error:", error.message);
        await m.reply("⚠️ Imeshindikana kupakua wimbo: " + error.message);
    }
};
