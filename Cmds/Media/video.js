const yts = require("yt-search");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, command } = context;

    // Kama user amebofya button ya quality
    if (command === "dlvid") {
        try {
            const [url, title, quality] = text.split("|");

            if (!url || !title || !quality) {
                return m.reply("⛔ Format ya data si sahihi.");
            }

            await m.reply(`📥 Inapakua *${title}* katika ubora wa *${quality}*...`);

            await client.sendMessage(m.chat, {
                video: { url },
                mimetype: "video/mp4",
                fileName: `${title} - ${quality}.mp4`,
                caption: `🎬 ${title} (${quality})`
            }, { quoted: m });

        } catch (err) {
            console.error(err.message);
            await m.reply("⚠️ Imeshindikana kutuma video: " + err.message);
        }

        return; // tunatoka hapa
    }

    // Kama user ametuma jina la video kutafuta
    if (!text) return m.reply("🎬 Tafadhali andika jina la video au wimbo unalotaka.");

    try {
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("🚫 Samahani, hakuna video iliyopatikana.");
        }

        const video = videos[0];

        const api = await fetch(`https://apis.davidcyriltech.my.id/youtube/mp4?query=${encodeURIComponent(video.url)}`);
        const data = await api.json();

        if (!data?.result?.url || !data?.result?.formats) {
            throw new Error("API haijarudisha links za video.");
        }

        const formats = data.result.formats;

        // Panga buttons kwa kila quality
        const buttons = formats.map((format, index) => ({
            buttonId: `dlvid ${format.url}|${data.result.title}|${format.quality}`,
            buttonText: { displayText: `📥 ${format.quality}` },
            type: 1
        }));

        await client.sendMessage(m.chat, {
            image: { url: video.thumbnail },
            caption: `🎞 *${data.result.title}*\n\nChagua ubora wa video kupakua 👇`,
            buttons,
            headerType: 4
        }, { quoted: m });

    } catch (err) {
        console.error(err.message);
        await m.reply("⚠️ Imeshindikana kutafuta video: " + err.message);
    }
};
