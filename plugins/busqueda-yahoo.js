import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🍬 Por favor, ingrese el nombre que desea buscar en Yahoo.\n\nEjemplo:\n> *${usedPrefix + command}* Inception`, m, rcanal);

    await m.react('🕓');

    try {
        const response = await axios.get(`https://api.dorratz.com/v2/yahoo-s?query=${encodeURIComponent(text)}&pageCount=5`);
        const results = response.data;

        if (!results || results.length === 0) {
            return conn.reply(m.chat, `😞 No se encontraron resultados para "${text}".`, m);
        }

        let txt = '`乂  Y A H O O  -  B Ú S Q U E\n\n`';

        results.forEach(item => {
            txt += `➤ *Título:* ${item.title}\n`;
            txt += `➤ *Descripción:* ${item.description}\n`;
            txt += `➤ *Enlace:* ${item.link}\n\n`;
        });

        const image = 'https://qu.ax/KCJsX.jpg'; 
        await conn.sendMessage(m.chat, { image: { url: image }, caption: txt }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `😔 Ocurrió un error al intentar obtener la información.`, m);
    }
};

handler.help = ['yahoosearch *<búsqueda>*'];
handler.tags = ['search'];
handler.command = ['yahoosearch'];
handler.register = true;

export default handler;