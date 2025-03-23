import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, '[ ✰ ] Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m, rcanal);
    
    await m.react('🕓');

    try {
        const response = await fetch(`https://api.nexfuture.com.br/api/downloads/youtube/mp4/v3?url=${encodeURIComponent(args[0])}`);
        
        if (!response.ok) throw new Error("Error en la respuesta de la API");
        
        const data = await response.json();

        if (!data.download || !data.download.downloadLink) {
            throw new Error("No se pudo obtener el enlace de descarga.");
        }

        let txt = '`乂  Y O U T U B E  -  M P 4`\n\n' +
            `    ✩   *Título* : ${data.info_do_video.title}\n` +
            `    ✩   *Calidad* : ${data.download.quality}\n` +
            `    ✩   *Duración* : ${data.info_do_video.timestamp}\n` +
            `    ✩   *Visitas* : ${data.info_do_video.views}\n` +
            `    ✩   *Publicado hace* : ${data.info_do_video.ago}\n\n` +
            '> *- ↻ El video se está enviando, espera un momento...*';

        await conn.sendFile(m.chat, data.info_do_video.thumbnail, 'thumbnail.jpg', txt, m);
        
        await conn.sendMessage(m.chat, { video: { url: data.download.downloadLink }, fileName: `${data.info_do_video.title}.mp4`, mimetype: 'video/mp4' }, { quoted: m });
        
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, 'Ocurrió un error durante la descarga. Inténtalo de nuevo más tarde.', m);
    }
};

handler.help = ['ytmp4 *<link yt>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp4', 'yta', 'fgmp4'];
handler.register = true;

export default handler;