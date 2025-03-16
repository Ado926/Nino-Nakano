
import axios from 'axios';

let handler = async (m, { conn }) => {
  try {
    await m.react('🕓');
    
    const response = await axios.get('https://delirius-apiofc.vercel.app/tools/movistar');
    
    if (response.status === 200 && response.data.status === true) {
      let newsArray = response.data.data;
      
      if (newsArray.length === 0) {
        await m.reply('No hay noticias disponibles en este momento.');
        return;
      }

      let text = '`乂  M O V I S T A R  -  N O T I C I A S`\n\n';
      
      for (let news of newsArray) {
        text += `✩ *Título*: ${news.title}\n`;
        text += `✩ *Descripción*: ${news.description}\n`;
        text += `✩ *URL*: ${news.url}\n`;
        text += `✩ *Imagen*: ${news.image}\n\n`;
      }
      
      await conn.sendMessage(m.chat, { text: text }, { quoted: m });
      await m.react('✅');
    } else {
      await m.react('✖️');
      await conn.reply(m.chat, 'Error al obtener las noticias de Movistar Deportes.', m);
    }
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, 'Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
}

handler.tags = ['noticias'];
handler.help = ['movistar-noticias'];
handler.command = ['movistarnews', 'movistar'];
handler.register = true;

export default handler;
