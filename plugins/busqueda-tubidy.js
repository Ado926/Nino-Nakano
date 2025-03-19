import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🍬 Por favor, ingrese el nombre que desea buscar.\n\nEjemplo:\n> *${usedPrefix + command}* phonk`, m, rcanal);

    await m.react('🕓');

    try {
        const response = await axios.get(`https://api.dorratz.com/v2/tubidy-search?q=${encodeURIComponent(text)}&pages=1`);
        const results = response.data.results;

        if (!results || results.length === 0) {
            return conn.reply(m.chat, `😞 No se encontraron resultados para "${text}".`, m);
        }

        let txt = '`乂  T U B I D Y  -  B Ú S Q U E\n\n`';
        results.forEach(item => {
            txt += `➤ *Título:* ${item.title}\n`;
            txt += `➤ *Duración:* ${item.duration}\n`;
            txt += `➤ *Enlace:* ${item.url}\n`;
            txt += `➤ *Imagen:* ${item.imageUrl}\n\n`;
        });

        const image = results[0].imageUrl;
        await conn.sendMessage(m.chat, { image: { url: image }, caption: txt }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `😔 Ocurrió un error al intentar obtener la información.`, m);
    }
};

handler.help = ['tubidysearch *<búsqueda>*'];
handler.tags = ['search'];
handler.command = ['tubidysearch'];
handler.register = true;

export default handler;