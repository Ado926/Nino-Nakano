import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(
            m.chat,
            '[ ✰ ] Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n' +
            '`» Ejemplo :`\n' +
            `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`,
            m
        );
    }

    await m.react('🕓');

    const apis = [
        `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(args[0])}`,
        `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(args[0])}`
    ];

    let data = null;

    for (let api of apis) {
        try {
            const res = await fetch(api);
            if (!res.ok) continue;
            const json = await res.json();

            if (json && (json.url || json.result?.url)) {
                data = {
                    title: json.title || json.result?.title || 'Sin título',
                    quality: json.quality || json.result?.quality || 'Desconocida',
                    lengthSeconds: json.lengthSeconds || json.result?.duration || 0,
                    thumbnail: json.thumbnail || json.result?.thumbnail || '',
                    url: json.url || json.result?.url
                };
                break;
            }
        } catch (e) {
            console.log(`Error al intentar con API: ${api}\n`, e.message);
        }
    }

    if (!data) {
        await m.react('✖️');
        return conn.reply(m.chat, 'No se pudo obtener el audio. Intenta con otro enlace o más tarde.', m);
    }

    try {
        let texto = '`乂  Y O U T U B E  -  M P 3`\n\n' +
            `    ✩   *Título* : ${data.title}\n` +
            `    ✩   *Calidad* : ${data.quality}\n` +
            `    ✩   *Duración* : ${Math.floor(data.lengthSeconds / 60)} minutos\n\n` +
            '> *- ↻ El audio se está enviando, espera un momento...*';

        if (data.thumbnail) {
            await conn.sendFile(m.chat, data.thumbnail, 'thumbnail.jpg', texto, m);
        } else {
            await conn.sendMessage(m.chat, { text: texto }, { quoted: m });
        }

        await conn.sendMessage(
            m.chat,
            {
                audio: { url: data.url },
                fileName: `${data.title}.mp3`,
                mimetype: 'audio/mpeg',
                ptt: true
            },
            { quoted: m }
        );

        await m.react('✅');
    } catch (err) {
        console.error(err);
        await m.react('✖️');
        conn.reply(m.chat, 'Ocurrió un error al enviar el audio.', m);
    }
};

handler.help = ['ytmp3 *<link yt>*'];
handler.tags = ['downloader'];
handler.command = ['ytmp3', 'yta', 'fgmp3'];
handler.register = true;

export default handler;
