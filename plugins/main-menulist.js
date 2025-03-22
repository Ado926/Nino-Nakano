import { promises } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import { xpRange } from '../lib/levelling.js';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';
import moment from 'moment-timezone';

const defaultMenu = {
  before: `Hola %name ${ucapan()} , soy Nino Nakano bot
  
  *\`乂  I N F O  -  B O T\`*
  
┌  ◦ *Creador:*  あ ┊ J᥆sᥱ ᥊rᥣ
│  ◦ *Modo:* Público
│  ◦ *Baileys:* Multi Device
│  ◦ *Tiempo Activa:* %uptime
└  ◦ *Usuarios:* %totalreg`.trim(),
};

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {};
    let { exp, level, role } = global.db.data.users[m.sender];
    let { min, xp, max } = xpRange(level, global.multiplier);
    let name = await conn.getName(m.sender);
    
    let _uptime = process.uptime() * 1000;
    let _muptime;
    if (process.send) {
      process.send('uptime');
      _muptime = await new Promise(resolve => {
        process.once('message', resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
    
    let muptime = clockString(_muptime);
    let uptime = clockString(_uptime);
    let totalreg = Object.keys(global.db.data.users).length;
    
    const imageUrl = 'https://qu.ax/uhJii.jpg';
    let media = await prepareWAMessageMedia(
      { image: { url: imageUrl } },
      { upload: conn.waUploadToServer }
    );

    let sections = [{
      title: "𝐒𝐄𝐋𝐄𝐂𝐂𝐈𝐎𝐍𝐄 𝐀𝐐𝐔𝐈",
      rows: [
        {
          title: "│🤴│ᴄʀᴇᴀᴅᴏʀ ᴅᴇ ʟᴀ ʙᴏᴛ",
          description: "ɴᴜᴍᴇʀᴏs ᴏғɪᴄɪᴀʟᴇs ᴅᴇ ᴊᴏsᴇ ᴇʟʙᴇʀ",
          id: `${_p}owner`
        },
        {
          title: "│🍒│ᴀᴜᴛᴏ ᴠᴇʀғɪᴄᴀʀ",
          description: "ʀᴇɢɪsᴛʀᴀᴛᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀᴍᴇɴᴛᴇ",
          id: `${_p}reg Amo a Nino.15`
        },
        {
          title: "│🔥│ɢʀᴜᴘᴏs ᴏғᴄ ᴅᴇ ʟᴀ ʙᴏᴛ",
          description: "ᴏʙᴛᴇɴ ʟᴀ ʟɪsᴛᴀ ᴅᴇ ʟᴏs ɢʀᴜᴘᴏs ᴏғɪᴄɪᴀʟᴇs ᴅᴇ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
          id: `${_p}grupos`
        },
        {
          title: "│🍭│ᴇsᴛᴀᴅᴏ ᴅᴇ ʟᴀ ʙᴏᴛ",
          description: "ᴏʙᴛᴇɴ ʟᴀ ɪɴғᴏʀᴍᴀᴄɪᴏɴ ᴅᴇʟ ᴇsᴛᴀᴅᴏ ᴀᴄᴛᴜᴀʟ ᴅᴇʟ ʙᴏᴛ",
          id: `${_p}estado`
        },
        {
          title: "│❔│ɪɴғᴏ ᴅᴇ ʟᴀ ʙᴏᴛ",
          description: "ᴏʙᴛᴇɴ ʟᴀ ɪɴғᴏʀᴍᴀᴄɪᴏɴ ᴅᴇ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
          id: `${_p}infobot`
        },
        {
          title: "│✨│ᴍᴇɴᴜ ᴄᴏᴍᴘʟᴇᴛᴏ",
          description: "ᴏʙᴛᴇɴ ᴇʟ ᴍᴇɴᴜ ᴄᴏᴍᴘʟᴇᴛᴏ ᴄᴏɴ ᴛᴏᴅᴀs ʟᴀs ғᴜɴᴄɪᴏɴᴇs ᴅᴇ ɴɪɴᴏ ɴᴀᴋᴀɴᴏ",
          id: `${_p}allmenu`
        }
      ]
    }];

    let bodyText = "*\`乂  I N F O  -  U S U A R I O\`*\n\n" +
                   "┌  ◦ *Usuario:* %name\n" +
                   "│  ◦ *Exp:* %exp\n" +
                   "│  ◦ *Nivel:* %level\n" +
                   "└  ◦ *Rango:* %role";
    bodyText = bodyText.replace(/%name/g, name)
                       .replace(/%exp/g, exp)
                       .replace(/%level/g, level)
                       .replace(/%role/g, role);

    let beforeText = defaultMenu.before.replace(/%name/g, name)
                                       .replace(/%muptime/g, muptime)
                                       .replace(/%uptime/g, uptime)
                                       .replace(/%totalreg/g, totalreg)
                                       .replace(/%exp/g, exp)
                                       .replace(/%level/g, level)
                                       .replace(/%role/g, role);

    const interactiveMessage = {
      header: {
        title: "",
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      body: { 
        text: `${beforeText}\n\n${bodyText}`
      },
      footer: { text: "⍴᥆ᥕᥱrᥱძ ᑲᥡ ȷ᥆sᥱ ᥊rᥣ" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "ධ⃟🌹 𝐌𝐄𝐍𝐔 𝐋𝐈𝐒𝐓",
              sections: sections
            })
          }
        ],
        messageParamsJson: ""
      }
    };

    let msgi = generateWAMessageFromContent(
      m.chat, 
      { viewOnceMessage: { message: { interactiveMessage } } }, 
      { userJid: conn.user.jid, quoted: m }
    );
    
    await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id });
    m.react('🍬');
  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m);
    throw e;
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menulist|menu|help|menú|\?)$/i;

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  return [d, ' D ', h, ' H ', m, ' M '].map(v => v.toString().padStart(2, '0')).join('');
}

function ucapan() {
  const time = moment.tz('America/Lima').format('HH');
  let res = "Buenas Noches🌙";
  if (time >= 5) {
      res = "Buena día de Madrugada🌄";
  }
  if (time >= 10) {
      res = "Buenos días☀️";
  }
  if (time >= 12) {
      res = "Buenas Tardes🌅";
  }
  if (time >= 19) {
      res = "Buenas Noches🌙";
  }
  return res;
}

export default handler;