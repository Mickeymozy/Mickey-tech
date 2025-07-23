const { DateTime } = require('luxon');
const fs = require('fs');
const axios = require('axios'); // 📦 Required to fetch the audio URL

module.exports = async (context) => {
    const { client, m, totalCommands, mode, botname, prefix, pict } = context;

    try {
        const categories = [
            { name: 'General', emoji: '✍️' },
            { name: 'Settings', emoji: '⚙️' },
            { name: 'Owner', emoji: '👑' },
            { name: 'Heroku', emoji: '🏷️' },
            { name: 'Wa-Privacy', emoji: '🪀' },
            { name: 'Groups', emoji: '👥' },
            { name: 'AI', emoji: '🤖' },
            { name: 'Media', emoji: '🎥' },
            { name: 'Editting', emoji: '✂️' },
            { name: 'Groups', emoji: '👥' },
            { name: 'Utils', emoji: '👾' }
        ];

        const getGreeting = () => {
            const currentHour = DateTime.now().setZone('Africa/Nairobi').hour;
            if (currentHour >= 5 && currentHour < 12) return 'Good morning 🌄';
            else if (currentHour >= 12 && currentHour < 18) return 'Good afternoon ☀️';
            else if (currentHour >= 18 && currentHour < 22) return 'Good evening 🌆';
            else return 'Good night 😴';
        };

        const getCurrentTimeInNairobi = () => {
            return DateTime.now().setZone('Africa/Nairobi').toLocaleString(DateTime.TIME_SIMPLE);
        };

        let menuText = `Holla, ${getGreeting()},\n\n`;
        menuText += ` User:- ${m.pushName}\n`;
        menuText += ` Botname:- ${botname}\n`;
        menuText += ` Command:- ${totalCommands}\n`;
        menuText += ` Time:- ${getCurrentTimeInNairobi()}\n`;
        menuText += ` Prefix:- ${prefix}\n`;
        menuText += ` Mode:- ${mode}\n`;
        menuText += ' *Thank you for using my WhatsApp bot! I appreciate your support*\n';
        menuText += '━━━━━━━━━\n\n';

        const toLightUppercaseFont = (text) => {
            const fonts = {
                'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑',
                'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙',
                'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        const toLightLowercaseFont = (text) => {
            const fonts = {
                'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫',
                'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳',
                's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻'
            };
            return text.split('').map(char => fonts[char] || char).join('');
        };

        for (const category of categories) {
            const commandFiles = fs.readdirSync(`./Cmds/${category.name}`).filter((file) => file.endsWith('.js'));
            const fancyCategory = toLightUppercaseFont(category.name.toUpperCase());
            menuText += `*${fancyCategory} ${category.emoji}:* \n`;
            for (const file of commandFiles) {
                const commandName = file.replace('.js', '');
                const fancyCommandName = toLightLowercaseFont(commandName);
                menuText += `  • ${fancyCommandName}\n`;
            }
            menuText += '\n';
        }

        // Send menu text first
        await client.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: false,
                    title: `MICKEY-TECH`,
                    body: `Hi ${m.pushName}`,
                    thumbnail: pict,
                    sourceUrl: `https://github.com/Mickeymozy/Mickey-tech`,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

        // 🔊 Send audio from URL
        const audioUrl = 'https://files.catbox.moe/bfzkyt.mp33'; // <-- Replace with your actual hosted audio file
        try {
            const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
            await client.sendMessage(m.chat, {
                audio: Buffer.from(response.data),
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: m });
        } catch (err) {
            console.error('Audio fetch failed:', err);
            m.reply('⚠️ Failed to fetch audio from the provided URL.');
        }

    } catch (error) {
        console.error(error);
        m.reply('An error occurred while fetching the menu.\n' + error);
    }
};
