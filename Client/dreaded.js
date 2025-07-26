const {
  BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto,
  generateWAMessageContent, generateWAMessage, prepareWAMessageMedia,
  areJidsSameUser, getContentType
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const speed = require("performance-now");
const path = require("path");
const { exec, spawn, execSync } = require("child_process");

const {
  smsg, formatp, tanggal, formatDate, getTime, sleep, clockString,
  fetchJson, getBuffer, jsonformat, generateProfilePicture, parseMention,
  getRandom, fetchBuffer
} = require('../lib/botFunctions.js');

const { TelegraPh, UploadFileUgu } = require("../lib/toUrl");
const uploadtoimgur = require('../lib/Imgur');
const { readFileSync } = require('fs');

const { commands, aliases, totalCommands } = require('../Handler/commandHandler');
const status_saver = require('../Functions/status_saver');
const gcPresence = require('../Functions/gcPresence');
const antitaggc = require('../Functions/antitag');
const antidel = require('../Functions/antidelete');

const { getSettings, getSudoUsers, getBannedUsers } = require("../Database/adapter");
const { botname, mycode } = require('../Env/settings');

module.exports = async (client, m, chatUpdate, store) => {
  try {
    const botNumber = await client.decodeJid(client.user.id);
    require("../Client/clientUtils").initializeClientUtils(client, store);

    const {
      groupMetadata, groupName, participants, groupAdmin,
      isBotAdmin, groupSender, isAdmin
    } = await client.getGroupContext(m, botNumber);

    const sudoUsers = await getSudoUsers() || [];
    const bannedUsers = await getBannedUsers() || [];
    const settings = await getSettings();
    if (!settings) return;

    const {
      prefix, mode, gcpresence, antitag,
      antidelete, antilink, packname
    } = settings;

    const pushname = m.pushName || "No Name";
    const sender = m.sender;
    const itsMe = sender === botNumber;
    const IsGroup = m.chat?.endsWith("@g.us");

    const DevDreaded = Array.isArray(sudoUsers) ? sudoUsers : [];
    const Owner = DevDreaded.map(v => v.replace(/\D/g, "") + "@s.whatsapp.net").includes(groupSender);

    const body = m.message?.conversation ?? m.message?.imageMessage?.caption
      ?? m.message?.extendedTextMessage?.text ?? "";

    const Tag = m.message?.extendedTextMessage?.contextInfo?.mentionedJid ?? [];

    const budy = m.text ?? "";
    const args = body.trim().split(/\s+/).slice(1);
    const text = args.join(" ");
    const arg = budy.substring(budy.indexOf(" ") + 1).trim();
    const arg1 = arg.substring(arg.indexOf(" ") + 1).trim();

    const fortu = m.quoted || m;
    const quoted = fortu.mtype === 'buttonsMessage' ? fortu[Object.keys(fortu)[1]]
      : fortu.mtype === 'templateMessage' ? fortu.hydratedTemplate[Object.keys(fortu.hydratedTemplate)[1]]
      : fortu.mtype === 'product' ? fortu[Object.keys(fortu)[0]]
      : m.quoted || m;

    const mime = (quoted.msg || quoted)?.mimetype ?? "";
    const qmsg = quoted.msg || quoted;

    const color = (text, clr) => clr ? chalk.keyword(clr)(text) : chalk.green(text);

    const dreadedspeed = speed();

    const pict = fs.readFileSync(path.resolve(__dirname, '../dreaded.jpg'));

    const commandName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase()
      : null;

    const resolvedCommandName = aliases[commandName] || commandName;
    const cmd = resolvedCommandName && commands[resolvedCommandName];

    const context = {
      client, m, text, Owner, chatUpdate, store, isBotAdmin, isAdmin, IsGroup, participants,
      pushname, body, budy, totalCommands, args, mime, qmsg, botNumber, itsMe,
      packname, generateProfilePicture, groupMetadata, dreadedspeed, mycode,
      fetchJson, exec, getRandom, UploadFileUgu, TelegraPh, prefix, cmd, botname, mode,
      gcpresence, antitag, antidelete, fetchBuffer, store, uploadtoimgur,
      groupSender, chatUpdate, getGroupAdmins: (parts) =>
        parts.filter(p => ["admin", "superadmin"].includes(p.admin)).map(p => p.id),
      pict, Tag
    };

    if (cmd) {
      const senderNumber = groupSender.replace(/@s\.whatsapp\.net$/, '');
      if (bannedUsers.includes(senderNumber)) {
        await client.sendMessage(m.chat, {
          text: "❗ You are banned from using bot commands."
        }, { quoted: m });
        return;
      }

      if (mode === 'private' && !itsMe && !Owner && !sudoUsers.includes(sender)) return;

      await antidel(client, m);
      await status_saver(client, m, Owner, prefix);
      await gcPresence(client, m);
      await antitaggc(client, m, isBotAdmin, itsMe, isAdmin, Owner, body);

      await commands[resolvedCommandName](context);
    }

  } catch (err) {
    console.error(chalk.red('[ERROR]'), chalk.white(err.message));
  }
};

// ✅ Global exception handler outside module scope
process.on('uncaughtException', (err) => {
  const msg = String(err);
  const ignored = [
    "conflict", "not-authorized", "Socket connection timeout",
    "rate-overlimit", "Connection Closed", "Timed Out", "Value not found"
  ];
  if (!ignored.some(e => msg.includes(e))) {
    console.error(chalk.red('Caught exception:'), chalk.yellow(msg));
  }
});
