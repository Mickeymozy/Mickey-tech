//credits.js

/* Why do you want to edit the credits ?, You may add yourself but do not OMIT any part */

module.exports = async (context) => {
    const { client, m, prefix } = context;

    // Send image with caption
    await client.sendMessage(m.chat, {
        image: { url: 'https://files.catbox.moe/ljabyq.png' },
        caption: `To any payment services those is payment methods:\n\n -Halotel ➪ Tanzania\n - number 0615944741 name; MICKDADI HAMZA\n\n -Yas ➪ Africa\n - number 0711765335 name; MOSSI MATUMLA \n\n\n- NMB ➪ BANK\n - For bank user waiting until develop card.\n\n{make payments on time } `
    });

    // Send audio after image
    await client.sendMessage(m.chat, {
        audio: { url: 'https://files.catbox.moe/s16ia3.mp3' }, // Replace with your actual audio file URL
        mimetype: 'audio/mpeg',
        ptt: true // Set to true for voice note style, false for music player style
    });
}

/* Do not edit this credits, Do not delete */
