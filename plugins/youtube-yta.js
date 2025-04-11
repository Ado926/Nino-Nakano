import fetch from "node-fetch"
import yts from 'yt-search'
import axios from "axios"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m)
    }

    const search = await yts(text)
    if (!search.all || search.all.length === 0) {
      return m.reply('✧ No se encontraron resultados para tu búsqueda.')
    }

    const videoInfo = search.all[0]
    if (!videoInfo) {
      return m.reply('✧ No se pudo obtener información del video.')
    }

    const { title, thumbnail, timestamp, views, ago, url, author, seconds } = videoInfo

    if (!title || !thumbnail || !timestamp || !views || !ago || !url || !author) {
      return m.reply('✧ Información incompleta del video.')
    }

    const infoMessage = '乂  Y O U T U B E  -  M P 3\n\n' +
      `    ✩   *Título* : ${title}\n` +
      `    ✩   *Calidad* : 128kbps\n` +
      `    ✩   *Duración* : ${Math.floor(seconds / 60)} minutos\n\n` +
      '> *- ↻ El audio se está enviando, espera un momento...*'

    const thumb = (await conn.getFile(thumbnail))?.data

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: dev,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: url,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    }

    await conn.reply(m.chat, infoMessage, m, JT)

    if (command === 'play' || command === 'yta' || command === 'ytmp3') {
      try {
        const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
        const resulta = api.result
        const result = resulta.download.url

        if (!result) throw new Error('⚠ El enlace de audio no se generó correctamente.')

        await conn.sendMessage(m.chat, { audio: { url: result }, fileName: `${api.result.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el audio. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.', m)
      }
    } else if (command === 'play2' || command === 'ytv' || command === 'ytmp4') {
      try {
        const response = await fetch(`https://api.vreden.my.id/api/ytmp4?url=${url}`)
        const json = await response.json()
        const resultad = json.result
        const resultado = resultad.download.url

        if (!resultad || !resultado) throw new Error('⚠ El enlace de video no se generó correctamente.')

        await conn.sendMessage(m.chat, { video: { url: resultado }, fileName: resultad.title, mimetype: 'video/mp4', caption: title }, { quoted: m })
      } catch (e) {
        return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.', m)
      }
    } else {
      return conn.reply(m.chat, '✧︎ Comando no reconocido.', m)
    }

  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error}`)
  }
}

handler.command = handler.help = ['yta', 'ytmp3']
handler.tags = ['descargas']
handler.group = true

export default handler

function formatViews(views) {
  if (views === undefined) {
    return "No disponible"
  }

  if (views >= 1_000_000_000) {
    return `${(views / 1_000_000_000).toFixed(1)}B (${views.toLocaleString()})`
  } else if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M (${views.toLocaleString()})`
  } else if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}k (${views.toLocaleString()})`
  }
  return views.toString()
}
