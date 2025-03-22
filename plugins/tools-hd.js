import fetch from 'node-fetch';

const handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || "";

        if (!mime) return m.reply(`${emoji} Por favor, responda a una imagen para aumentar el *HD*.`);
        if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`${emoji2} El formato del archivo (${mime}) no es compatible, envía o responde a una imagen.`);

        conn.reply(m.chat, `${emoji2} Mejorando la calidad de la imagen....`, m, {
            contextInfo: { externalAdReply: { 
                mediaUrl: null, 
                mediaType: 1, 
                showAdAttribution: true,
                title: packname,
                body: wm,
                previewType: 0, 
                thumbnail: icons,
                sourceUrl: channel 
            }}
        });

        let img = await q.download?.();
        let imgMejorada = await Escalar(img);

        if (imgMejorada) {
            const etiqueta = `🍬 Imagen mejorada para ${m.sender.split('@')[0]} .`;
            conn.sendMessage(m.chat, { image: imgMejorada, caption: etiqueta }, { quoted: m });
        } else {
            return m.reply(`${msm} Ocurrió un error durante el proceso de mejora.`);
        }

    } catch {
        return m.reply(`${msm} Ocurrió un error.`);
    }
};

handler.help = ["remini", "hd", "enhance"];
handler.tags = ["tools"];
handler.register = true;
handler.command = ["remini", "hd", "enhance"];
export default handler;

async function Escalar(imagenBuffer) {
    try {
        const response = await fetch("https://lexica.qewertyy.dev/upscale", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image_data: imagenBuffer.toString("base64"),
                format: "binary",
            }),
        });

        return Buffer.from(await response.arrayBuffer());
    } catch {
        return null;
    }
}