const { default: dreadedConnect, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, downloadContentFromMessage, jidDecode, proto, getContentType } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const FileType = require("file-type");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const chalk = require("chalk");
const figlet = require("figlet");
const express = require("express");
const app = express();
const port = process.env.PORT || 10000;
const _ = require("lodash");
const PhoneNumber = require("awesome-phonenumber");

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('../lib/exif');
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, sleep } = require('../lib/botFunctions');

const logger = pino({ level: 'silent' });
const makeInMemoryStore = require('../Client/store.js');
const store = makeInMemoryStore({ logger: logger.child({ stream: 'store' }) });

const authenticationn = require('../Auth/auth.js');
const { smsg } = require('../Handler/smsg');
const { getSettings, getBannedUsers, banUser, getGroupSetting } = require("../Database/adapter");
const { botname } = require('../Env/settings');
const { DateTime } = require('luxon');
const { commands, totalCommands } = require('../Handler/commandHandler');
const path = require('path');
const dirname = path.resolve(); // <-- FIXED

authenticationn();

const sessionName = path.join(dirname, '..', 'Session');

const groupEvents = require("../Handler/eventHandler");
const groupEvents2 = require("../Handler/eventHandler2");
const connectionHandler = require('../Handler/connectionHandler');

async function startDreaded() {
  let settingss = await getSettings();
  if (!settingss) return;

  const { autobio, mode, anticall } = settingss;
  const { saveCreds, state } = await useMultiFileAuthState(sessionName);

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

  store.bind(client.ev);
  setInterval(() => {
    store.writeToFile("store.json");
  }, 3000);

  client.public = true;

  // You can now continue wiring event listeners here

  client.ev.on("connection.update", async (update) => {
    await connectionHandler(client, update, startDreaded);
  });

  client.ev.on("creds.update", saveCreds);

  // etc...
}

app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile(path.join(dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

startDreaded();

module.exports = startDreaded;
