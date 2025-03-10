/* 
- Downloader YouTube Audio
- Comando para descargar audio desde YouTube
*/
import axios from 'axios';

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text.trim()) {
    return conn.reply(
      m.chat,
      '💜 Por favor, ingresa un enlace de YouTube para descargar el audio.`,
      m
    );
  }

  await m.react('🕓');

  const url = text.trim();

  if (command === 'ytva' || command === 'yta' || command === 'ytmp3') {
    try {
      const downloadUrl = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl }, 
        mimetype: 'audio/mpeg', 
        contextInfo: {
          externalAdReply: {
            title: 'Audio Descargado por Nino-Nakano',
            body: 'Descarga completada.',
            mediaType: 1,
            mediaUrl: null,
            thumbnailUrl: null,
            sourceUrl: null,
            containsAutoReply: true,
            renderLargerThumbnail: true,
            showAdAttribution: false,
          }
        }
      }, { quoted: m });
      await m.react('✅');
    } catch (error) {
      await m.react('❌');
      conn.reply(
        m.chat,
        `❌ *Error:* ${error.message || 'Error al descargar!'}`,
        m
      );
    }
  } else {
    await m.react('❌');
    conn.reply(
      m.chat,
      "Comando no reconocido.",
      m
    );
  }
};

handler.command = ['ytmp3', 'yta', 'ytva'];
handler.tags = ['downloader'];

export default handler;

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format)) {
      throw new Error('Formato no soportado.');
    }

    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      const response = await axios.request(config);
      if (response.data && response.data.success) {
        const { id } = response.data;
        const downloadUrl = await ddownr.cekProgress(id);
        return downloadUrl;
      } else {
        throw new Error('Fallo al obtener los detalles del video.');
      }
    } catch (error) {
      throw error;
    }
  },
  cekProgress: async (id) => {
    const config = {
      method: 'GET',
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      throw error;
    }
  }
};
