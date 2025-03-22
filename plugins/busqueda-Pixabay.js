import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
    if (!text) {
        return conn.reply(message.chat, `🍭 *Por favor, ingresa una palabra clave para buscar imágenes...*`, message, rcanal);
    }

    await message.react('🍬');
    conn.reply(message.chat, `*🌩 Buscando imágenes de ${text}...*`, message, rcanal);

    const apiUrl = `https://delirius-apiofc.vercel.app/search/pixabay?query=${text}`;
    
    try {
        const response = await axios.get(apiUrl);
        const images = response.data.data;
        let cards = [];

        for (const [index, item] of images.entries()) {
            if (index >= 5) break;
            cards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `Imagen ${index + 1}: ${item.tags}`,
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: `Usuario: ${item.user}\n🍬 Likes: ${item.likes}`,
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: `Imagen de ${item.user}`,
                    hasMediaAttachment: true,
                    imageMessage: await createImageMessage(item.image),
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Ver Más",
                            Url: item.link,
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
                            text: 'Imágenes generadas por Pixabay',
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

handler.tags = ['pixabay'];
handler.help = ['pixabay *<palabra clave>*'];
handler.command = ['pixabay', 'pixabaysearch'];
handler.register = true;

export default handler;