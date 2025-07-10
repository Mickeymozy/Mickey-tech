const { getGroupSetting } = require("../Database/config");

module.exports = async (client, m, isBotAdmin, isAdmin, Owner, body) => {
    try {
        if (!m.isGroup) return;

        const groupSettings = await getGroupSetting(m.chat);
        const antilink = groupSettings?.antilink?.trim()?.toLowerCase();

        if (!antilink || antilink === "off") return;

        const isGroupLink = body.includes("chat.whatsapp.com");
        const isValidTrigger = isGroupLink && !Owner && isBotAdmin && !isAdmin;
        const messageId = m?.key?.id;
        const kid = m?.sender;

        if (!messageId || !kid) return;

        if (isValidTrigger) {
            // Delete the message first
            await client.sendMessage(m.chat, {
                delete: {
                    remoteJid: m.chat,
                    fromMe: false,
                    id: messageId,
                    participant: kid
                }
            });

            if (antilink === "del") {
                await client.sendMessage(m.chat, {
                    text: `⚠️ @${kid.split("@")[0]}, group links are not allowed! Message deleted.`,
                    contextInfo: { mentionedJid: [kid] }
                });
            } else if (antilink === "kick") {
                await client.groupParticipantsUpdate(m.chat, [kid], "remove");

                await client.sendMessage(m.chat, {
                    text: `🚫 Removed!\n\n@${kid.split("@")[0]}, sending group links is prohibited!`,
                    contextInfo: { mentionedJid: [kid] }
                });
            } else {
                console.warn("⚠️ Unexpected antilink value:", antilink);
            }
        }
    } catch (error) {
        console.error("🚨 Error in anti-link handler:", error);
    }
};
