import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, '[ ✰ ] Ingresa el enlace del vídeo de *YouTube* junto al comando.\n\n`» Ejemplo :`\n' + `> *${usedPrefix + command}* https://youtu.be/QSvaCSt8ixs`, m, rcanal);
    
    await m.react('🕓');
    try {
        const apiUrl = `https://api.ryzendesu.vip/api/tool/yt-transcript?url=${encodeURIComponent(args[0])}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status) {
            const transcript = data.transcript;
            let txt = '`乂  Y O U T U B E  -  T R A N S C R I P T`\n\n' +
                `    ✩   *Transcripción* : \n${transcript}\n\n` +
                '> *- 🍭 La transcripción fue enviada exitosamente.*';
            await conn.reply(m.chat, txt, m, rcanal);
            await m.react('✅');
        } else {
            await m.reply('No se pudo obtener la transcripción del video, verifica la URL o que el video tenga subtítulos disponibles.');
            await m.react('✖️');
        }
    } catch (error) {
        await m.reply('Ocurrió un error al intentar obtener la transcripción.');
        await m.react('✖️');
    }
}

handler.help = ['yttranscript *<link yt>*'];
handler.tags = ['downloader'];
handler.command = ['yttranscript', 'transcryptyt'];
handler.register = true;

export default handler;