import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🚩 Ingrese el nombre del mod que busca.\n\nEjemplo:\n> *${usedPrefix + command}* Minecraft`, m, rcanal);

    await m.react('🕓');

    try {
        const response = await axios.get(`https://api.dorratz.com/v2/happymod-s?query=${encodeURIComponent(text)}`);
        const mods = response.data;

        if (!mods || mods.length === 0) {
            return conn.reply(m.chat, `😞 No se encontraron mods relacionados con "${text}".`, m);
        }

        let msg = '🛠️  R E S U L T A D O S  -  M O D S\n\n';
        mods.forEach(mod => {
            msg += `✩   Nombre : ${mod.name}\n`;
            msg += `✩   Creador : ${mod.creator}\n`;
            msg += `✩   Calificación : ${mod.rating}\n`;
            msg += `✩   Enlace : ${mod.link}\n`;
            msg += `✩   Icono : ${mod.icon}\n\n`;
        });

        await conn.sendMessage(m.chat, { text: msg }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `Error al obtener información sobre el mod.`, m);
    }
};

handler.help = ['mods *<query>*'];
handler.tags = ['info'];
handler.command = ['mods', 'mcmods'];
handler.register = true;

export default handler;