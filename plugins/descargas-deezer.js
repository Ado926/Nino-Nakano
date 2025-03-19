import axios from 'axios';
import yts from 'yt-search';

const handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) {
        return conn.reply(m.chat, `🌹 Ejemplo: ${usedPrefix + command} Joji`, m, rcanal);
    }

    let searchMusicDeezerFind, ABC;

    try {
        searchMusicDeezerFind = (await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(text)}`)).data;

        if (!searchMusicDeezerFind.data || searchMusicDeezerFind.data.length === 0) {
            return conn.reply(m.chat, 'No hay resultados de la API de Deezer.', m);
        }

        const songData = searchMusicDeezerFind.data[0];
        const artistName = songData.artist.name;
        const songTitle = songData.title;
        const albumTitle = songData.album.title;
        const duration = songData.duration;
        const size = 'Desconocido';
        const explicitLyrics = songData.explicit_lyrics ? 'Sí' : 'No';
        const artistLink = songData.artist.link;
        const albumLink = songData.album.tracklist.replace('api.', '');
        const deezerLink = songData.link;
        const previewUrl = songData.preview;

        ABC = await yts(`${artistName} ${songTitle}`);
        const informationVideoYT = ABC.videos[0];

        if (!informationVideoYT) {
            return conn.reply(m.chat, 'No se encontró información del video en YouTube.', m);
        }

        let durationFormatted = new Date(duration * 1000).toISOString().substr(11, 8);
        let txt = '`乂  D E E Z E R   -  M P 3`\n\n' +
                  `    ✩   *Título* : ${songTitle}\n` +
                  `    ✩   *Autor* : ${artistName}\n` +
                  `    ✩   *Álbum* : ${albumTitle}\n` +
                  `    ✩   *Duración* : ${durationFormatted}\n` +
                  `    ✩   *Calidad* : 128kbps\n` +
                  `    ✩   *Letras Explícitas* : ${explicitLyrics}\n` +
                  `    ✩   *Link a Deezer* : ${deezerLink}\n` +
                  `    ✩   *Link al Artista* : ${artistLink}\n\n` +
                  `> *- ↻ El audio se está enviando, espera un momento...*`;

        await conn.sendMessage(m.chat, {
            image: { url: informationVideoYT.thumbnail },
            caption: txt
        });

        await conn.sendMessage(m.chat, {
            audio: { url: previewUrl },
            mimetype: 'audio/mpeg'
        }, { quoted: m });
        
    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, 'Error al procesar la solicitud. Verifique la entrada o intente nuevamente.', m);
    }
}

handler.help = ['deezer'];
handler.tags = ['descargas'];
handler.command = ['deezer', 'deezermusic', 'dzr'];
handler.register = true;

export default handler;