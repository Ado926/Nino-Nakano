import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '🚩 Ingresa el término de búsqueda.', m, rcanal);

    await m.react('🕓');
    try {
        const response = await fetch(`https://api.rynn-archive.biz.id/search/apkcombo?q=${encodeURIComponent(text)}`);
        const data = await response.json();

        if (!data.status || !data.result || data.result.length === 0) {
            throw new Error('No se encontraron resultados para tu búsqueda.');
        }

        let txt = `*乂  S E A R C H  -   A P K  C O M B O*\n\n`;
        for (const app of data.result) {
            txt += `    ✩  *Nombre* : ${app.name}\n`;
            txt += `    ✩  *Desarrollador* : ${app.developer}\n`;
            txt += `    ✩  *Calificación* : ${app.rating}\n`;
            txt += `    ✩  *Tamaño* : ${app.size}\n`;
            txt += `    ✩  *Enlace* : ${app.link}\n\n`;
        }

        await conn.reply(m.chat, txt, m, rcanal);
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        await conn.reply(m.chat, '🚩 Ocurrió un error: ' + error.message, m);
    }
};

handler.help = ['apksearch <término>'];
handler.tags = ['search'];
handler.command = ['apksearch'];
handler.register = true;

export default handler;