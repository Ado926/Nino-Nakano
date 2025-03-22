import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return conn.reply(message.chat, `🍭 *⍴᥆r 𝖿ᥲ᥎᥆r, іᥒgrᥱsᥲ ᥣ᥆ 𝗊ᥙᥱ ძᥱsᥱᥲs ᑲᥙsᥴᥲr ᥱᥒ ⍴іᥒ𝗍ᥱrᥱs𝗍..*`, message, rcanal);
    }

    await message.react('🍬');
    conn.reply(message.chat, `*🌩 Dᥱsᥴᥲrgᥲᥒძ᥆ іmágᥱᥒᥱs, ⍴᥆r 𝖿ᥲ᥎᥆r ᥱs⍴ᥱrᥲ...*`, message, rcanal);

    async function createImageMessage(imageUrl) {
        const { imageMessage } = await generateWAMessageContent({
            'image': {
                'url': imageUrl
            }
        }, {
            'upload': conn.waUploadToServer
        });
        return imageMessage;
    }

    try {
        const response = await axios.get(`https://archive-ui.tanakadomp.biz.id/search/pinterest?q=${text}`);
        const images = response.data.result.map(item => item.image_hd);

        let cards = [];
        for (const [index, imageUrl] of images.entries()) {
            if (index >= 5) break;
            cards.push({
                body: proto.Message.InteractiveMessage.Body.fromObject({
                    text: `Imagen - ${index + 1}`
                }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({
                    text: 'Pinterest'
                }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: '',
                    hasMediaAttachment: true,
                    imageMessage: await createImageMessage(imageUrl)
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "Ver en Pinterest 🧃",
                            Url: `https://www.pinterest.com/search/pins/?rs=typed&q=${text}`
                        })
                    }]
                })
            });
        }

        const carouselMessage = generateWAMessageFromContent(message.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `📌 Rᥱsᥙᥣ𝗍ᥲძ᥆s ⍴ᥲrᥲ: ${text}`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: 'Gᥲᥣᥱríᥲ ძᥱ іmágᥱᥒᥱs ᥒіᥒ᥆ ᥒᥲkᥲᥒ᥆',
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            hasMediaAttachment: false
                        }),
                        carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                            cards: cards
                        })
                    })
                }
            }
        }, { quoted: message });

        await conn.relayMessage(message.chat, carouselMessage.message, { messageId: carouselMessage.key.id });
    } catch (error) {
        console.error(error);
        conn.reply(message.chat, `Error al buscar imágenes en Pinterest.`, message);
    }
};

handler.help = ['pinterest'];
handler.tags = ['descargas'];
handler.command = ['pinterest', 'pin', 'pinterestsearch'];

export default handler;