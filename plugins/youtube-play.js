import yts from 'yt-search';
import fetch from 'node-fetch';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, args, usedPrefix }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '[ ℹ️ ] ¡Por favor ingresa un título de YouTube para buscar!\n\nEjemplo: *Corazón Serrano - Mix Poco Yo*', m);
  }

  await m.react('📓'); // Reacción de espera

  // Enviar TTS como mensaje de voz
  await conn.sendMessage(m.chat, {
  text: '❒ ∆ *¡Un momento, por favor!* ▶\n\n☑ *Estamos buscando tu video...* ✯',
  tts: true
}, { quoted: m });

  try {
    const searchResults = await searchVideos(args.join(" "));

    if (!searchResults.length) {
      throw new Error('No se encontraron resultados. Intenta con otro título.');
    }

    const video = searchResults[0];
    const thumbnail = await (await fetch(video.thumbnail)).buffer();

    const messageText = formatMessageText(video);

    await conn.sendMessage(m.chat, {
      image: thumbnail,
      caption: messageText,
      footer: `✦ Codigo Editado por: Wirk ✦`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      },
      buttons: generateButtons(video, usedPrefix),
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

    await m.react('✅');
  } catch (e) {
    console.error(e);
    await m.react('✖️');
    conn.reply(m.chat, '*`Hubo un error al buscar el video.`*', m);
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];

export default handler;

// Función para realizar la búsqueda de videos en YouTube
async function searchVideos(query) {
  try {
    const res = await yts(query);
    return res.videos.slice(0, 10).map(video => ({
      title: video.title,
      url: video.url,
      thumbnail: video.thumbnail,
      channel: video.author.name,
      published: video.timestamp || 'No disponible',
      views: video.views || 'No disponible',
      duration: video.duration.timestamp || 'No disponible'
    }));
  } catch (error) {
    console.error('Error en yt-search:', error.message);
    return [];
  }
}

// Función para formatear el texto del mensaje con los detalles del video
function formatMessageText(video) {
  let messageText = `*🍌 ɾҽʂυʅƚαԃσ ԃҽ Ⴆύʂϙυҽԃα ραɾα:* ${video.title}\n\n`;
  messageText += `⌛ 𝙳𝚞𝚛𝚊𝚌𝚒𝚘́𝚗: ${video.duration || 'No disponible'}\n`;
  messageText += `📺 𝙲𝚊𝚗𝚊𝚕: ${video.channel || 'Desconocido'}\n`;
  messageText += `📅 𝙿𝚞𝚋𝚕𝚒𝚌𝚊𝚍𝚘: ${convertTimeToSpanish(video.published)}\n`;
  messageText += `👁️ 𝚅𝚒𝚜𝚝𝚊𝚜: ${video.views || 'No disponible'}\n`;
  messageText += `🔗 𝙴𝚗𝚕𝚊𝚌𝚎: ${video.url}\n`; // Siempre muestra el link
  return messageText;
}

// Función para generar los botones de interacción
function generateButtons(video, usedPrefix) {
  return [
    {
      buttonId: `${usedPrefix}ytmp3 ${video.url}`,
      buttonText: { displayText: '🎶 ᑕᒪᏆᑕ ᑭᗩᖇᗩ ᗪᙓՏᑕᗩᖇǤᗩᖇ ᗩᑌᗪᏆᗝ' },
      type: 1
    },
    {
      buttonId: `${usedPrefix}ytmp4 ${video.url}`,
      buttonText: { displayText: '🎥 Ɠɛŋɛʀɑʀ ѵɩԀɛօ ɖɛՏƈɑʀɢɑ' },
      type: 1
    }
  ];
}

// Función para convertir el tiempo de publicación a español
function convertTimeToSpanish(timeText) {
  return timeText
    .replace(/year/, 'año')
    .replace(/years/, 'años')
    .replace(/month/, 'mes')
    .replace(/months/, 'meses')
    .replace(/day/, 'día')
    .replace(/days/, 'días')
    .replace(/hour/, 'hora')
    .replace(/hours/, 'horas')
    .replace(/minute/, 'minuto')
    .replace(/minutes/, 'minutos');
}
