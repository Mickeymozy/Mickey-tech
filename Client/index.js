const {
  default: dreadedConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  downloadContentFromMessage,
  jidDecode,
  proto,
  getContentType
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;

const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('../lib/exif');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('../lib/botFunctions');

const logger = pino({ level: 'silent' });

const makeInMemoryStore = require('../Client/store.js'); // ✅ factory
const store = makeInMemoryStore({ logger: logger.child({ stream: 'store' }) }); // ✅ instance

// ✅ Load old store if it exists
if (fs.existsSync('store.json')) {
  store.readFromFile('store.json');
}

// ✅ Save store regularly
setInterval(() => {
  store.writeToFile('store.json');
}, 3000);

// ✅ Save on shutdown
process.on('exit', () => store.writeToFile('store.json'));
process.on('SIGINT', () => {
  store.writeToFile('store.json');
  process.exit();
});

const authenticationn = require('../Auth/auth.js');
const { smsg } = require('../Handler/smsg');
const { getSettings, getBannedUsers, banUser, getGroupSetting } = require("../Database/adapter");
const { botname } = require('../Env/settings');
const { DateTime } = require('luxon');
const { commands, totalCommands } = require('../Handler/commandHandler');

authenticationn();

const sessionPath = path.join(__dirname, '../Session');
if (!fs.existsSync(sessionPath)) {
  fs.mkdirSync(sessionPath, { recursive: true });
}

const groupEvents = require("../Handler/eventHandler");
const groupEvents2 = require("../Handler/eventHandler2");
const connectionHandler = require('../Handler/connectionHandler');

async function startDreaded() {
  const settingss = await getSettings();
  if (!settingss) return;

  const { autobio, mode, anticall } = settingss;
  const { saveCreds, state } = await useMultiFileAuthState(sessionPath);

  const client = dreadedConnect({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    version: [2, 3000, 1023223821],
    browser: ['DREADED', 'Safari', '3.0'],
    auth: state,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30000,
    fireInitQueries: false,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return msg?.message || undefined;
    }
  });

  // ✅ Bind store to Baileys events
  store.bind(client.ev);

  client.public = true;

  client.ev.on("connection.update", async (update) => {
    await connectionHandler(client, update, startDreaded);
  });

  client.ev.on("creds.update", saveCreds);
}

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

startDreaded();

module.exports = startDreaded;
