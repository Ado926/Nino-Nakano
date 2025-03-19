import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🚩 Ingrese el nombre de la canción.\n\nEjemplo:\n> *${usedPrefix + command}* Feel Special`, m, rcanal);
    await m.react('🕓');

    try {
        const response = await axios.get(`https://delirius-apiofc.vercel.app/search/deezer?q=${encodeURIComponent(text)}`);
        const { status, data } = response.data;

        if (!status || data.length === 0) {
            return conn.reply(m.chat, `😞 No se pudo encontrar canciones para "${text}".`, m);
        }

        let txt = '`乂  D E E Z E R  -  B Ú S Q U E`\n\n';
        
        for (let song of data) {
            txt += `✩   Título: ${song.title}\n`;
            txt += `✩   Artista: ${song.artist}\n`;
            txt += `✩   Duración: ${song.duration}\n`;
            txt += `✩   URL: ${song.url}\n`;
            txt += `✩   Escuchar: ${song.preview}\n\n`;
        }

        const image = data[0].image;

        await conn.sendMessage(m.chat, { image: { url: image }, caption: txt }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `Error al obtener información de la canción.`, m);
    }
};

handler.help = ['deezersearch *<búsqueda>*'];
handler.tags = ['search'];
handler.command = ['deezersearch'];
handler.register = true;

export default handler;