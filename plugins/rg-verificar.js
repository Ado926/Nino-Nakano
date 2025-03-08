import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import moment from 'moment-timezone';
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
 let bio = 0, fechaBio
  let sinDefinir = '😿 Es privada'
  let biografia = await conn.fetchStatus(m.sender).catch(() => null)
  if (!biografia || !biografia[0] || biografia[0].status === null) {
   bio = sinDefinir
   fechaBio = "Fecha no disponible"
} else {
bio = biografia[0].status || sinDefinir
fechaBio = biografia[0].setAt ? new Date(biografia[0].setAt).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", }) : "Fecha no disponible"
}
  let perfil = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  let now = new Date();
  let date = now.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  let time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (user.registered === true) return m.reply(`${emoji2} Ya estás registrado.\n\n*¿Quiere volver a registrarse?*\n\nUse este comando para eliminar su registro.\n*${usedPrefix}unreg*`)
  if (!Reg.test(text)) return m.reply(`${emoji2} Formato incorrecto.\n\nUso del comamdo: *${usedPrefix + command} nombre.edad*\nEjemplo : *${usedPrefix + command} ${name2}.15*`)
  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`${emoji2} El nombre no puede estar vacío.`)
  if (!age) return m.reply(`${emoji2} La edad no puede estar vacía.`)
  if (name.length >= 100) return m.reply(`${emoji2} El nombre es demasiado largo.`)
  age = parseInt(age)
  if (age > 1000) return m.reply(`${emoji} Wow el abuelo quiere jugar al bot.`)
  if (age < 5) return m.reply(`${emoji} hay un abuelo bebé jsjsj.`)
  user.name = name + '✓'.trim()
  user.age = age
  user.descripcion = bio 
  user.regTime = + new Date
  user.registered = true
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20
  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  let txt = '*`—  R E G I S T R O  〤  U S E R`*\n\n';
  txt += `\t\t*» Tag* :: @${m.sender.split('@')[0]}\n`;
  txt += `\t\t*» Nombre* :: ${name}\n`;
  txt += `\t\t*» Edad* :: ${age} años\n\n`;
  txt += `\t\t*» Fecha* :: ${date}\n`;
  txt += `\t\t*» Hora* :: ${time}\n\n\n`;
  txt += '*`—  R E C O N P E N S A  〤  U S E R`*\n\n';
  txt += `\t\t• ⛁ *${moneda}* » 40\n`;
  txt += `\t\t• ✰ *Experiencia* » 300\n`;
  txt += `\t\t• ❖ *Tokens* » 20\n`;
  txt += `\t\t• Escribe *${usedPrefix}profile* para ver tu perfil.\n`;
  txt += `> ${dev}`
await m.react('💜')

await conn.sendMessage(m.chat, {
        text: txt,
        contextInfo: {
            externalAdReply: {
                title: '✧ Usuario Verificado ✧',
                body: textbot,
                thumbnailUrl: pp,
                sourceUrl: channel,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });    
}; 
handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler
