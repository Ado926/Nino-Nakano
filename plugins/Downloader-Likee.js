/* 
- Downloader Likee By Jose
- Power By Team Code Titans
- https://whatsapp.com/channel/0029ValMlRS6buMFL9d0iQ0S 
*/
// *🍁 [ Likee Video Downloader ]*

import axios from 'axios';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return conn.reply(m.chat, '🚩 Ingresa la URL de Likee que deseas descargar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* https://l.likee.video/v/XXXXXXXXX/`, m, rcanal);
  
  await m.react('🕓');

  try {
    const response = await axios.get(`https://dark-shan-yt.koyeb.app/download/likee?url=${encodeURIComponent(text)}`);
    
    if (response.data.status) {
      const videoData = response.data.data;
      
      let txt = '`乂  L I K E E  -  D O W N L O A D`\n\n';
      txt += `    ✩  *Vistas* : ${videoData.views}\n`;
      txt += `    ✩  *Likes* : ${videoData.likes}\n`;
      txt += `    ✩  *Comentarios* : ${videoData.comments}\n\n`;
      txt += `    ✩  *Miniatura* : ${videoData.thumbnail}\n\n`;
      txt += `> 🚩 Enlace con marca de agua: ${videoData.withWatermark}\n`;
      txt += `> 🚩 Enlace sin marca de agua: ${videoData.withoutWatermark}`;

      await conn.sendMessage(m.chat, { video: { url: videoData.withoutWatermark }, caption: txt }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('✖️');
      await conn.reply(m.chat, 'Error al obtener datos desde Likee.', m);
    }
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, 'Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
}

handler.tags = ['downloader'];
handler.help = ['likee *<url>*'];
handler.command = ['likee', 'likedl', 'likeedownloader'];
handler.register = true;

export default handler;