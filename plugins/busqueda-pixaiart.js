import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
    if (!text) {
        return conn.reply(message.chat, `🍭 *Por favor, ingresa una palabra clave para buscar imágenes...*`, message, rcanal);
    }

    await message.react('🍬');
    conn.reply(message.chat, `*🌩 Buscando imágenes de ${text}...*`, message, rcanal);

    const apiUrl = `https://delirius-apiofc.vercel.app/search/pixaiart?query=${text}`;
    
    try {
        const response = await axios.get(apiUrl);
        const images = response.data.data;
        let cards = [];

        for (const [index, item] of images.entries()) {
            if (index >= 5) break; 
            cards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `Título: *${item.title}*\nCreador: *${item.name}*\n👤 Usuario: ${item.username}\n❤️ Likes: ${item.likes}\n💬 Comentarios: ${item.comments}`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `📅 Creado: ${item.created} | Resolución: ${item.resolution}`,
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `Imagen de ${item.name}`,
                    hasMediaAttachment: true,
                    imageMessage: await createImageMessage(item.image),
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Ver Más",
                            Url: item.image,
                        }),
                    }],
                }),
            });
        }

        const carouselMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `📌 Resultados de la búsqueda: ${text}`,
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: 'Imágenes generadas por PixaiArt',
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            hasMediaAttachment: false,
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: cards,
                        }),
                    }),
                },
            },
        }, { quoted: message });

        await conn.relayMessage(message.chat, carouselMessage.message, { messageId: carouselMessage.key.id });
    } catch (error) {
        console.error(error);
        conn.reply(message.chat, `Error al buscar imágenes.`, message);
    }
};

async function createImageMessage(imageUrl) {
    const { imageMessage } = await generateWAMessageContent({
        'image': {
            'url': imageUrl,
        },
    }, {
        'upload': conn.waUploadToServer,
    });
    return imageMessage;
}

handler.tags = ['pixaiart'];
handler.help = ['pixaiart *<palabra clave>*'];
handler.command = ['pixaiart', 'pixaiartsearch'];
handler.register = true;

export default handler;