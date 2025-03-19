import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `🍬 Ingrese un título de película para buscar.\n\nEjemplo:\n> *${usedPrefix + command}* Blackpink`, m, rcanal);
  }

  await m.react('🕓');
  try {
    const res = await fetch(`https://delirius-apiofc.vercel.app/search/cuevana?q=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.data || json.data.length === 0) {
      await m.react('✖️');
      return await conn.reply(m.chat, 'No se encontraron resultados para esta búsqueda.', m);
    }

    let responseText = '`R E S U L T A D O S  D E  B U S Q U E D A`\n\n';
    json.data.forEach(movie => {
      responseText += `*Título:* ${movie.title}\n`;
      responseText += `*Descripción:* ${movie.description}\n`;
      responseText += `*Enlace:* ${movie.link}\n`;
      responseText += `*Imagen:* ${movie.image}\n\n`;
    });
    
    const firstMovie = json.data[0];
    await conn.sendMessage(m.chat, { image: { url: firstMovie.image }, caption: responseText }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, 'Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
};

handler.help = ['cuevanasearch <título>'];
handler.tags = ['busquedas'];
handler.command = ['cuevanasearch', 'searchcuevana'];
handler.register = true;

export default handler;
