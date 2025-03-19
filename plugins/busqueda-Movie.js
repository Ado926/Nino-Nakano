import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🚩 Ingrese el nombre de la película que busca.\n\nEjemplo:\n> *${usedPrefix + command}* BLACKPINK`, m, rcanal);

    await m.react('🕓');

    try {
        const response = await axios.get(`https://delirius-apiofc.vercel.app/search/movie?query=${encodeURIComponent(text)}`);
        const movies = response.data.data;

        if (!movies || movies.length === 0) {
            return conn.reply(m.chat, `😞 No se encontraron películas relacionadas con "${text}".`, m);
        }

        let msg = '`M O V I E  -  S E A R C H`\n\n';
        const firstMovie = movies[0];

        msg += `✩   Título : ${firstMovie.title}\n`;
        msg += `✩   Fecha de lanzamiento : ${firstMovie.release_date}\n`;
        msg += `✩   Calificación : ${firstMovie.vote_average}\n`;
        msg += `✩   Resumen : ${firstMovie.overview}\n`;
        
        const image = firstMovie.image;

        await conn.sendMessage(m.chat, { image: { url: image }, caption: msg }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `Error al obtener información sobre la película.`, m);
    }
};

handler.help = ['movie <término>'];
handler.tags = ['search'];
handler.command = ['movie', 'moviepelicula', 'buscarpeliculamovie'];
handler.register = true;

export default handler;