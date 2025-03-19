import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `🚩 Por favor, ingrese una URL de imagen.\n\nEjemplo:\n> *${usedPrefix + command}* https://i.postimg.cc/fWSq0Tsz/apitest.jpg`, m, rcanal);
  }

  await m.react('🕓');
  try {
    const apiUrl = `https://delirius-apiofc.vercel.app/tools/cdn?url=${encodeURIComponent(text)}&filename=Delirius`;
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.data) {
      await m.react('✖️');
      return await conn.reply(m.chat, '❌ No se encontraron resultados para esta búsqueda de imagen.', m);
    }

    const { filename, size, publish, url } = json.data;
    
    let txt = '`乂  I M A G E -  C D N`\n\n';
    txt += `🍬 *Nombre del archivo:* ${filename}\n`;
    txt += `💾 *Tamaño:* ${size}\n`;
    txt += `📅 *Publicado el:* ${publish}\n`;
    txt += `🔗 *URL de la Imagen:* ${url}\n`;
    
    await conn.sendMessage(m.chat, { image: { url }, caption: txt }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, '⚠️ Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
};

handler.help = ['cdn <url>'];
handler.tags = ['tools'];
handler.command = ['cdn', 'cdnimage'];
handler.register = true;

export default handler;
