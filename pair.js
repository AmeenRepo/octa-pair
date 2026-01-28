const express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
const pino = require("pino");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser
} = require("@whiskeysockets/baileys");

const { upload } = require('./mega');

const router = express.Router();

console.log("I am here");

function removeFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
    }
}

let num = "+916238768108";

async function EypzPair() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');

    try {
        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    pino({ level: "fatal" })
                ),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }),
            browser: Browsers.macOS("Safari"),
        });

        // Pairing code
        if (!sock.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(num);
            console.log("Your Code:", code);
        }

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "open") {
                try {
                    await delay(10000);

                    const authPath = './session/creds.json';
                    const userJid = jidNormalizedUser(sock.user.id);

                    const megaUrl = await upload(
                        fs.createReadStream(authPath),
                        `Keiko-${userJid}.json`
                    );

                    const sessionString = megaUrl.replace(
                        'https://mega.nz/file/',
                        '𝐂𝐫𝐨𝐧𝐞𝐱𝐁𝐨𝐭~'
                    );

                    // Join group
                    const groupLink = 'https://chat.whatsapp.com/CfFibovjGmu8tbJtKfs57Z';
                    await sock.groupAcceptInvite(groupLink.split('/').pop());

                    // Send session
                    await sock.sendMessage(userJid, { text: sessionString });

                    await sock.sendMessage(userJid, {
                        text: '*🪀 Session Created*\n\nNow you can deploy the bot anywhere.\n\n> Thanks for using WaBot 🌸'
                    });

                    await sock.sendMessage('120363330856401796@g.us', {
                        text: '_🌸 Hey Sir 🪄_\n_Cronex has successfully connected to the server_'
                    });

                } catch (err) {
                    console.error(err);
                    exec('pm2 restart eypz');
                }

                await delay(200);
                removeFile('./session');
                process.exit(0);
            }

            // Reconnect if not logged out
            if (
                connection === "close" &&
                lastDisconnect?.error?.output?.statusCode !== 401
            ) {
                await delay(5000);
                EypzPair();
            }
        });

    } catch (err) {
        console.error("Fatal error:", err);
        exec('pm2 restart eypz-md');
        removeFile('./session');
    }
}

// Start pairing
EypzPair();

process.on('uncaughtException', (err) => {
    console.log('Caught exception:', err);
    exec('pm2 restart eypz');
});

module.exports = router;
