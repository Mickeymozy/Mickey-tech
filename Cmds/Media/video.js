const yts = require("yt-search");
const fetch = require("node-fetch");

module.exports = async (context) => {
  const { client, m, text, command } = context;

  const sendError = async (msg, error) => {
    console.error(error?.message || error);
    await m.reply(`⚠️ ${msg}: ${error?.message || error}`);
  };

  const FIXED_QUALITY = "360p"; // Change this to any desired quality

  const handleVideoDownload = async () => {
    try {
      const [url, title] = text.split("|");

      if (!url || !title) {
        return m.reply("⛔ Format ya data si sahihi. Tumia: url|title");
      }

      await m.reply(`📥 Inapakua *${title}* katika ubora wa *${FIXED_QUALITY}*...`);

      await client.sendMessage(m.chat, {
        video: { url },
        mimetype: "video/mp4",
        fileName: `${title} - ${FIXED_QUALITY}.mp4`,
        caption: `🎬 ${title} (${FIXED_QUALITY})`,
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

      const format = result.formats.find(f => f.quality === FIXED_QUALITY);
      if (!format) {
        throw new Error(`Ubora wa ${FIXED_QUALITY} haukupatikana.`);
      }

      const downloadText = `${format.url}|${result.title}`;

      return await handleVideoDownload({ client, m, text: downloadText, command: "dlvid" });

    } catch (error) {
      await sendError("Imeshindikana kutafuta video", error);
    }
  };

  if (command === "dlvid") {
    return handleVideoDownload();
  }

  await handleVideoSearch();
};
