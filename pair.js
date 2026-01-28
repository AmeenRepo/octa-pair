const express = require('express');
const fs = require('fs');
const { exec } = require("child_process");
let router = express.Router()
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
console.log("i em here")
function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}


    let num = "+916238768108";
    async function EypzPair() {
        const { state, saveCreds } = await useMultiFileAuthState(`./session`);
        try {
            let EypzPairWeb = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.macOS("Safari"),
            });

            if (!EypzPairWeb.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await EypzPairWeb.requestPairingCode(num);
                console.log("Your Code: "+code)
                }
            }

            EypzPairWeb.ev.on('creds.update', saveCreds);
            EypzPairWeb.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    try {
                        await delay(10000);
                        const sessionEypz = fs.readFileSync('./session/creds.json');

                        const auth_path = './session/';
                        const user_jid = jidNormalizedUser(EypzPairWeb.user.id);

                        const mega_url = await upload(fs.createReadStream(auth_path + 'creds.json'), `Keiko-${user_jid}.json`);

                        const string_session = mega_url.replace('https://mega.nz/file/', '𝐂𝐫𝐨𝐧𝐞𝐱𝐁𝐨𝐭~');

                        const sid = string_session;
                        let groupLink = 'https://chat.whatsapp.com/CfFibovjGmu8tbJtKfs57Z' 
  await EypzPairWeb.groupAcceptInvite(groupLink.split('/').pop());

                        const dt = await EypzPairWeb.sendMessage(user_jid, {
                            text: sid
                        });

                        await EypzPairWeb.sendMessage(
            user_jid,
            {
              text: '*🪀Session Created*\n\n Now U Can Deploy The Bot Anywhere\n\n> Thanks For Using WaBot🌸'
            })
await EypzPairWeb.sendMessage('120363330856401796@g.us', {

            text: `_🌸Hᴇʏ Sᴇʀ🪄_\n_Cronex has successfully connected to the server_`

        });
          


                        
                    } catch (e) {
                        exec('pm2 restart eypz');
                    }

                    await delay(100);
                    return await removeFile('./session');
                    process.exit(0);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    EypzPair();
                }
            });
        } catch (err) {
            exec('pm2 restart eypz-md');
            console.log("service restarted");
            EypzPair();
            await removeFile('./session');
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }
    return await EypzPair();


process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    exec('pm2 restart eypz');
});

module.exports = router;
