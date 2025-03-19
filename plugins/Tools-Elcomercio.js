import axios from 'axios';

const handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🚩 Ingrese el término que desea buscar.\n\nEjemplo:\n> *${usedPrefix + command}* Castillo`, m, rcanal);

    await m.react('🕓');

    try {
        const response = await axios.get(`https://delirius-apiofc.vercel.app/tools/elcomercio?query=${encodeURIComponent(text)}`);
        const { status, data } = response.data;

        if (!status || data.length === 0) {
            return conn.reply(m.chat, `😞 No se encontró información sobre "${text}".`, m);
        }

        let messageText = '`乂  I N F O R M A C I Ó N -  B Ú S Q U E`\n\n';
        
        data.forEach(item => {
            const { title, publish, url, image } = item;
            messageText += `✩  *Título*: ${title}\n`;
            messageText += `✩  *Publicado*: ${publish}\n`;
            messageText += `✩  *Enlace*: ${url}\n`;
            messageText += `✩  *Imagen*: ${image}\n\n`;
        });

        await conn.sendMessage(m.chat, { text: messageText }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `Error al obtener información.`, m);
    }
};

handler.help = ['elcomerciope <término>'];
handler.tags = ['tools'];
handler.command = ['elcomerciope', 'elcomercio'];
handler.register = true;

export default handler;