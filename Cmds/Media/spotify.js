module.exports = async (context) => {
  const { client, m, text, fetchJson } = context;

  if (!text) {
    return m.reply("🎵 Tafadhali taja jina la wimbo unaotaka kudownload.");
  }

  try {
    const apiUrl = `https://api.vreden.my.id/api/ytmp3?title=${encodeURIComponent(text)}`;
    const data = await fetchJson(apiUrl);

    if (data?.success && data.result?.downloadLink && data.result?.title) {
      const audioUrl = data.result.downloadLink;
      const filename = data.result.title;

      await m.reply("📥 Inatuma audio kama document na music...");

      // Send as document
      await client.sendMessage(
        m.chat,
        {
          document: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${filename}.mp3`,
        },
        { quoted: m }
      );

      // Send as audio
      await client.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${filename}.mp3`,
        },
        { quoted: m }
      );
    } else {
      await m.reply("⚠️ API haijarudisha jibu sahihi. Tafadhali jaribu tena.");
    }
  } catch (error) {
    console.error("YTMP3 Error:", error);
    await m.reply("❌ Imeshindikana kupata link ya kudownload. Jaribu kutumia jina sahihi la wimbo au msanii.");
  }
};
