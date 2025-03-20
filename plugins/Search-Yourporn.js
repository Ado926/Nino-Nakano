import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { text, usedPrefix, command, conn }) => {
    if (!text) {
        return conn.reply(m.chat, `🍭 Ejemplo: ${usedPrefix + command} hermana`, m, rcanal);
    }

    const ypsearch = async (query) => {
        try {
            const url = `https://www.youporn.com/search/?query=${encodeURIComponent(query)}`;
            const { data } = await axios.get(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
                },
            });

            const $ = cheerio.load(data);
            const results = [];

            $(".video-box").each((i, el) => {
                const title = $(el).find(".video-title").text().trim() || "No title found";
                const videoPath = $(el).find("a").attr("href");
                const url = videoPath ? `https://www.youporn.com${videoPath}` : "No URL";
                const thumbnail = $(el).find("img").attr("data-src") || $(el).find("img").attr("src") || "No thumbnail";
                const duration = $(el).find(".video-duration").text().trim() || "No duration";

                results.push({ title, url, thumbnail, duration });
            });

            return results.length > 0 ? results : [];
        } catch (error) {
            console.error("Error:", error.message);
            return [];
        }
    };

    const results = await ypsearch(text);

    if (results.length === 0) {
        return conn.reply(m.chat, 'No se encontraron resultados.', m);
    }

    let allResultsText = '`乂  Y O U P O R N   -  V I D E O S`\n\n';
    results.forEach((video, index) => {
        allResultsText += 
            `    ✩   *Título* : ${video.title}\n` +
            `    ✩   *URL* : ${video.url}\n` +
            `    ✩   *Duración* : ${video.duration}\n` +
            `    ✩   *Miniatura* : ${video.thumbnail}\n` +
            `    ✩   *Número* : ${index + 1}\n\n`;
    });

    const firstVideo = results[0];

    await conn.sendMessage(m.chat, {
        image: { url: firstVideo.thumbnail },
        caption: allResultsText
    });
};

handler.help = ['youpornsearch'];
handler.tags = ['busqueda'];
handler.command = ['youpornsearch', 'ypsearch'];
handler.register = true;

export default handler;