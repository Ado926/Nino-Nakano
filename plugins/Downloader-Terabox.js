import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`Ejemplo:\n${usedPrefix + command} https://terabox.com/s/1kReYr_2pyxLZ2c2kEAHF3A`);

  await m.react('🕓');
  
  try {
    const result = await terabox(text);
    if (!result.status || !result.data.length) return m.reply('Ingresa una URL válida.');

    for (let i = 0; i < result.data.length; i++) {
      const { filename, size, downloadUrl } = result.data[i];
      const caption = `📄 *Nombre del archivo:* ${filename}\n📏 *Tamaño:* ${size} bytes`;

      await m.react('✅');
      await conn.sendFile(m.chat, downloadUrl, filename, caption, m);
    }
  } catch (err) {
    console.error(err);
    m.reply('Error al descargar el archivo.');
  }
};

handler.help = ["terabox *<url>*"];
handler.tags = ["dl"];
handler.command = ["terabox"];

export default handler;

async function terabox(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`https://vapis.my.id/api/terabox?url=${encodeURIComponent(url)}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}
