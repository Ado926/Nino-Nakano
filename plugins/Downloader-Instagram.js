import axios from 'axios';

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🚩 Por favor, ingresa un enlace de Instagram.', m, rcanal);
  }

  const instagramUrl = args[0];
  let res;

  try {
    await m.react('💜');
    res = await axios.get(`https://apis-starlights-team.koyeb.app/starlight/instagram-dl?url=${encodeURIComponent(instagramUrl)}`);
  } catch (e) {
    return conn.reply(m.chat, 'Error al obtener datos. Verifica el enlace.', m);
  }

  const result = res.data;
  if (!result || result.data.length === 0) {
    return conn.reply(m.chat, 'No se encontraron resultados.', m);
  }

  const videoData = result.data[0]; 
  const videoUrl = videoData.dl_url;

  if (!videoUrl) {
    return conn.reply(m.chat, 'No se encontró un enlace de descarga válido.', m);
  }

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: '🍓 Aquí tienes el video de Instagram.', fileName: 'instagram.mp4', mimetype: 'video/mp4' }, { quoted: m });
      await m.react('✅');
      break;
    } catch (e) {
      if (attempt === maxRetries) {
        await m.react('❌');
        return conn.reply(m.chat, 'Error al enviar el video después de varios intentos.', m);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

handler.help = ['instagram', 'insta'];
handler.tags = ['descargas'];
handler.command = /^(instagramdl|instagram|insta|igdl|ig|instagramdl2|instagram2|igdl2|ig2|instagramdl3|instagram3|igdl3|ig3)$/i
handler.register = true;

export default handler;