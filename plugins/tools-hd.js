import fetch from 'node-fetch'

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
        })

        return Buffer.from(await response.arrayBuffer())
    } catch {
        return null
    }
}

let manejador = async (m, { conn, usedPrefix, command }) => {
    conn.mejorador = conn.mejorador || {}

    if (m.sender in conn.mejorador)
        throw "🍬Hay un proceso en curso. Por favor espera."

    let q = m.quotes ? m.quotes : m
    let mime = (q.msg || q).mimetype || q.mediaType || ""
    if (!mime) throw "🍬Envía/Responde con una foto."
    if (!/image\/(jpe?g|png)/.test(mime)) throw `🍬 El tipo ${mime} no es compatible.`

    conn.mejorador[m.sender] = true
    await conn.sendMessage(m.chat, { react: { text: "🧃", key: m.key } })

    let img = await q.download?.()
    let imgMejorada = await Escalar(img)

    if (imgMejorada) {
        await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
        conn.sendFile(
            m.chat,
            imgMejorada,
            "",
            "іmᥲgᥱᥒ ᥴ᥆ᥒ᥎ᥱr𝗍іძᥲ ᥲ һძ ᥴ᥆ᥒ é᥊і𝗍᥆ ✅",
            m
        )
    } else {
        await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
        m.reply("*Resultado:* Fallido ");
    }

    delete conn.mejorador[m.sender]
}

manejador.help = ["remini"]
manejador.tags = ["remini"]
manejador.command = /^(hd|remini)$/i

export default manejador