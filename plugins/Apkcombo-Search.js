import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const image = 'https://qu.ax/MZCmT.jpg';

    if (!text) return conn.reply(m.chat, `🚩 Ingrese el nombre de la aplicación que busca.\n\nEjemplo:\n> *${usedPrefix + command}* WhatsApp`, m, rcanal);

    await m.react('🕓');

    try {
        const response = await axios.get(`https://api.rynn-archive.biz.id/search/apkcombo?q=${encodeURIComponent(text)}`);
        const apps = response.data.result;

        if (!apps || apps.length === 0) {
            return conn.reply(m.chat, `😞 No se encontraron aplicaciones relacionadas con "${text}".`, m);
        }

        let msg = `*乂  S E A R C H  -   A P K  C O M B O*\n\n`;
        apps.forEach(app => {
            msg += `✩   Nombre : ${app.name}\n`;
            msg += `✩   Desarrollador : ${app.developer}\n`;
            msg += `✩   Calificación : ${app.rating}\n`;
            msg += `✩   Tamaño : ${app.size}\n`;
            msg += `✩   Enlace : ${app.link}\n\n`;
        });

        await conn.sendMessage(m.chat, { image: { url: image }, caption: msg }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `Error al obtener información sobre la aplicación.`, m);
    }
};

handler.help = ['apkcombosearch <término>'];
handler.tags = ['search'];
handler.command = ['apkcombosearch'];
handler.register = true;

export default handler;