import axios from 'axios';

let handler = async (m, { conn, args }) => {
    if (!args[0]) return conn.reply(m.chat, `[ 🧸 ]  Ingresa un link de Likee`, m, rcanal);
    if (!args[0].match(/likee/gi)) return conn.reply(m.chat, `[ ✰ ]  Verifica que el link sea de *Likee*`, m, rcanal);

    await m.react('🕓');
    try {
        const url = args[0];
        const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/like-downloader?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data.links && data.links["no watermark"]) {
            const videoWithoutWatermark = data.links["no watermark"];
            await conn.sendMessage(m.chat, { url: videoWithoutWatermark }, { quoted: m });
            await m.react('✅');
        } else {
            await conn.reply(m.chat, `[ ✰ ]  Ocurrió un error: No se pudo obtener el video sin marca de agua.`, m);
            await m.react('✖️');
        }
    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, `[ ✰ ]  Ocurrió un error al procesar tu solicitud.`, m);
        await m.react('✖️');
    }
};

handler.help = ['likeedownload *<url>*'];
handler.tags = ['downloader'];
handler.command = ['likee', 'likedownload'];
handler.register = true;

export default handler;
