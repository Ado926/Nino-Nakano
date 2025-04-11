import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, '[ ✰ ] Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m);

    await m.react('🕓');
    let url = encodeURIComponent(args[0]);
    let apis = [
        `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${url}`,
        `https://api.vreden.my.id/api/ytmp3?url=${url}`
    ];

    let data;
    for (let api of apis) {
        try {
            const response = await fetch(api);
            if (!response.ok) continue;

            data = await response.json();
            if (data.url) break;
        } catch (e) {
            console.log(`Error con API: ${api}`, e.message);
        }
    }

    if (!data || !data.url) {
        await m.react('✖️');
        return conn.reply(m.chat, 'Ocurrió un error al intentar descargar el audio. Intenta con otro enlace o más tarde.', m);
    }

    try {
        let txt = '`乂  Y O U T U B E  -  M P 3`\n\n' +
            `    ✩   *Título* : ${data.title}\n` +
            `    ✩   *Calidad* : ${data.quality || 'Desconocida'}\n` +
            `    ✩   *Duración* : ${Math.floor((data.lengthSeconds || 0) / 60)} minutos\n\n` +
            '> *- ↻ El audio se está enviando, espera un momento...*';

        await conn.sendFile(m.chat, data.thumbnail || '', 'thumbnail.jpg', txt, m);
        await conn.sendMessage(m.chat, {
            audio: { url: data.url },
            fileName: `${data.title}.mp3`,
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });

        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, 'Ocurrió un error durante el envío del audio. Inténtalo de nuevo.', m);
    }
};

handler.help = ['ytmp3 *<link yt>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'yta', 'fgmp3'];
handler.register = true;

export default handler;
