import axios from 'axios';

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];

const handler = async (m, { conn, text, command }) => {
  await m.react('✖️');
  if (!text.trim()) throw `💜 Por favor, ingresa un enlace de YouTube para descargar el audio.`;

  const url = text.trim();

  if (command === 'ytvadoc' || command === 'ytadoc' || command === 'ytmp3doc') {
    try {
      const downloadUrl = await ddownr.download(url, 'mp3');
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl }, 
        mimetype: 'audio/mpeg', 
        fileName: `${Math.random().toString(36).substring(7)}.mp3`
      }, { quoted: m });
      await m.react('✅');
    } catch (error) {
      await m.react('❌');
      m.reply(`❌ *Error:* ${error.message || 'Error al descargar!'}`);
    }
  } else {
    throw "Comando no reconocido.";
  }
};

handler.command = handler.help =  ['ytmp3doc', 'ytadoc'];
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