import db from '../lib/database.js'
import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import speed from 'performance-now'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn, usedPrefix }) => {
    let bot = global.db.data.settings[conn.user.jid]
    let _uptime = process.uptime() * 1000
    let uptime = new Date(_uptime).toISOString().substr(11, 8) 
    let totalreg = Object.keys(global.db.data.users).length
    let totalStats = Object.values(global.db.data.stats).reduce((total, stat) => total + stat.total, 0)
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
    let totalchats = Object.keys(global.db.data.chats).length
    let totalf = Object.values(global.plugins).filter((v) => v.help && v.tags).length
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'))
    const used = process.memoryUsage()

    // Obtención de información sobre la CPU
    const cpus = _cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
        return cpu
    })
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total
        last.speed += cpu.speed / length
        last.times.user += cpu.times.user
        last.times.nice += cpu.times.nice
        last.times.sys += cpu.times.sys
        last.times.idle += cpu.times.idle
        last.times.irq += cpu.times.irq
        return last
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    })

    let timestamp = speed()
    let latensi = speed() - timestamp
    let ninonakano = `╭─⬣「 *\`Info De Nino Nakano\`* 」⬣\n`
    ninonakano += `│ 👑 *Creador* : @${owner[0][0].split('@s.whatsapp.net')[0]}\n`
    ninonakano += `│ 🍭 *Prefijo* : [ ${usedPrefix} ]\n`
    ninonakano += `│ 📦 *Total Plugins* : ${totalf}\n`
    ninonakano += `│ 💫 *Plataforma* : ${platform()}\n`
    ninonakano += `│ 🧿 *Servidor* : ${hostname()}\n`
    ninonakano += `│ 🚀 *RAM* : ${format(totalmem() - freemem())} / ${format(totalmem())}\n`
    ninonakano += `│ 🌟 *FreeRAM* : ${format(freemem())}\n`
    ninonakano += `│ ✨️ *Speed* : ${latensi.toFixed(4)} ms\n`
    ninonakano += `│ 🕗 *Uptime* : ${uptime}\n`
    ninonakano += `│ 🍟 *Modo* : ${bot.public ? 'Privado' : 'Publico'}\n`
    ninonakano += `│ 🚩 *Comandos Ejecutados* : ${toNum(totalStats)} ( *${totalStats}* )\n`
    ninonakano += `│ 🐢 *Grupos Registrados* : ${toNum(totalchats)} ( *${totalchats}* )\n`
    ninonakano += `│ 🍧 *Registrados* : ${toNum(totalreg)} ( *${totalreg}* ) Usuarios\n`
    ninonakano += `╰─⬣\n\n`
    ninonakano += `╭─⬣「 *Chats De Nino Nakano* 」⬣\n`
    ninonakano += `│ 🧃 *${groupsIn.length}* Chats en Grupos\n`
    ninonakano += `│ 🌸 *${groupsIn.length}* Grupos Unidos\n`
    ninonakano += `│ 💬 *${chats.length - groupsIn.length}* Chats Privados\n`
    ninonakano += `│ 💭 *${chats.length}* Chats Totales\n`
    ninonakano += `╰─⬣\n\n`
    ninonakano += `╭─⬣「 *NodeJS Uso de memoria* 」⬣\n`
    ninonakano += `${'```' + Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${format(used[key])}`).join('\n') + '```'}\n`
    ninonakano += `╰─⬣`

  const catalogo1 = 'https://qu.ax/jParb.mp4'

  await conn.sendFile(m.chat, catalogo1, 'jose.jpg', ninonakano, m)
  await m.react(emojis)
}

handler.help = ['infobot']
handler.tags = ['info']
handler.command = ['info', 'infobot']

export default handler

function toNum(number) {
    if (number >= 1000 && number < 1000000) {
        return (number / 1000).toFixed(1) + 'k'
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'
    } else {
        return number.toString()
    }
}