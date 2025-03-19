import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, '[ ✰ ] Ingresa el vínculo del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m, rcanal);

  await m.react('🕓');

  try {
    const query = args[0].replace('https://www.youtube.com/watch?v=', '').replace('youtube.com/watch?v=', '').replace('https://youtu.be/', '');
    const response = await fetch(`https://carisys.online/api/downloads/youtube/play?query=${query}`);
    const data = await response.json();

    if (!data.status) throw new Error('No se pudo obtener el audio.');

    const { titulo, desc, tempo, views, imagem, id, audio } = data.resultado;

    let txt = '`乂  Y O U T U B E  -  M P 3`\n\n' +
              `    ✩   *Título* : ${titulo}\n` +
              `    ✩   *Descripción* : ${desc}\n` +
              `    ✩   *Duración* : ${tempo}\n` +
              `    ✩   *Vistas* : ${views}\n\n` +
              '> *- ↻ El audio se está enviando, espera un momento...*';

    await conn.sendFile(m.chat, imagem, 'thumbnail.jpg', txt, m);
    await conn.sendMessage(m.chat, { audio: { url: audio }, fileName: `${titulo}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    conn.reply(m.chat, 'Ocurrió un error al intentar procesar tu petición. Asegúrate de que el enlace sea válido.', m);
  }
};

handler.help = ['play3 *<link yt>*'];
handler.tags = ['downloader'];
handler.command = ['playt3', 'play3', 'playfgmp3'];
handler.register = true;

export default handler;