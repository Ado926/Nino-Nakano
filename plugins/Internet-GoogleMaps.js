import axios from 'axios';

async function obtenerCoordenadas(latitud, longitud) {
    const enlaceMaps = `https://www.google.com/maps?q=${latitud},${longitud}`;
    return `📍 *Ubicación en Google Maps* 📍\n\n🌍 *Latitud:* ${latitud}\n📍 *Longitud:* ${longitud}\n🔗 *Enlace:* ${enlaceMaps}`;
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || !args[1]) {
        return m.reply(`Amigo, debes proporcionar la latitud y longitud.\n\n📍 Ejemplo: ${usedPrefix}${command} -23.55052 -46.633308`);
    }

    const latitud = args[0];
    const longitud = args[1];

    m.reply('🍬 Procesando, por favor espera...');

    try {
        const mensaje = await obtenerCoordenadas(latitud, longitud);
        await conn.sendMessage(m.chat, { text: mensaje }, { quoted: m });
    } catch (error) {
        m.reply(`Error : ${error.message}`);
    }
}

handler.help = ['maps']
handler.command = ['maps', 'ubicacion']
handler.tags = ['internet']

export default handler;