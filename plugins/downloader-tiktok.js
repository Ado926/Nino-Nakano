/* 
- Downloader TikTok By Jose XrL
- Power By Team Code Titans
- https://whatsapp.com/channel/0029ValMlRS6buMFL9d0iQ0S 
*/
// *🍁 [ TikTok Video Downloader ]*

import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, '🚩 Ingresa la URL de TikTok que deseas descargar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* https://vm.tiktok.com/ZMhF6DMEH/`, m, rcanal);
  
  await m.react('🕓');

  try {
    const response = await axios.get(`https://vapis.my.id/api/ttdl?url=${encodeURIComponent(text)}`);
    
    if (response.data.status) {
      const video = response.data.data; 
      
      let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
      txt += `    ✩  *Título* : ${video.title || 'Sin título'}\n`;
      txt += `    ✩  *Autor* : ${video.author.nickname}\n`;
      txt += `    ✩  *Duración* : ${video.duration}\n`;
      txt += `    ✩  *Vistas* : ${video.stats.views}\n`;
      txt += `    ✩  *Likes* : ${video.stats.likes}\n`;
      txt += `    ✩  *Comentarios* : ${video.stats.comment}\n`;
      txt += `    ✩  *Compartidos* : ${video.stats.share}\n`;
      txt += `    ✩  *Descargas* : ${video.stats.download}\n`;
      txt += `    ✩  *Audio* : ${video.music_info.title}\n\n`;
      txt += `> 🚩 Enlace al video: ${video.data[0].url}`;

      await conn.sendMessage(m.chat, { video: { url: video.data[0].url }, caption: txt }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('✖️');
      await conn.reply(m.chat, 'Error al obtener datos desde TikTok.', m);
    }
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, 'Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
}

handler.tags = ['downloader'];
handler.help = ['tiktok *<url>*'];
handler.command = ['tiktok', 'ttdl', 'tiktokdl', 'tiktoknowm', 'tt', 'ttnowm', 'tiktokaudios'];
handler.register = true;

export default handler;