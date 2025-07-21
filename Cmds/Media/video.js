const yts = require("yt-search");
const fetch = require("node-fetch");

module.exports = async (context) => {
  const { client, m, text, command } = context;

  const sendError = async (msg, error) => {
    console.error(error?.message || error);
    await m.reply(`⚠️ ${msg}: ${error?.message || error}`);
  };

  const handleVideoDownload = async () => {
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
        caption: `🎬 ${title} (${quality})`,
      }, { quoted: m });

    } catch (error) {
      await sendError("Imeshindikana kutuma video", error);
    }
  };

  const handleVideoSearch = async () => {
    if (!text) {
      return m.reply("🎬 Tafadhali andika jina la video au wimbo unalotaka.");
    }

    try {
      const { videos } = await yts(text);
      if (!videos || videos.length === 0) {
        return m.reply("🚫 Samahani, hakuna video iliyopatikana.");
      }

      const video = videos[0];
      const response = await fetch(`https://apis-keith.vercel.app/download/porn?query=${encodeURIComponent(video.url)}`);
      const data = await response.json();

      const { result } = data;
      if (!result?.url || !result?.formats) {
        throw new Error("API haijarudisha links za video.");
      }

      const buttons = result.formats.map((format) => ({
        buttonId: `dlvid ${format.url}|${result.title}|${format.quality}`,
        buttonText: { displayText: `📥 ${format.quality}` },
        type: 1,
      }));

      await client.sendMessage(m.chat, {
        image: { url: video.thumbnail },
        caption: `🎞 *${result.title}*\n\nChagua ubora wa video kupakua 👇`,
        buttons,
        headerType: 4,
      }, { quoted: m });

    } catch (error) {
      await sendError("Imeshindikana kutafuta video", error);
    }
  };

  if (command === "dlvid") {
    return handleVideoDownload();
  }

  await handleVideoSearch();
};
