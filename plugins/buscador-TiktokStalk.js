import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `🚩 Por favor, ingrese un nombre de usuario para buscar.\n\nEjemplo:\n> *${usedPrefix + command}* jose.xrl15`, m, rcanal);
  }

  await m.react('🕓');
  try {
    const res = await fetch(`https://vapis.my.id/api/tt-stalk?username=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.data) {
      await m.react('✖️');
      return await conn.reply(m.chat, '❌ No se encontraron resultados para esta búsqueda.', m);
    }

    const user = json.data.user;
    const stats = json.data.stats;
    
    let txt = `📌 *T I K T O K - S T A L K*\n\n`;
    txt += `👤 *Nombre:* ${user.nickname}\n`;
    txt += `🔖 *Usuario:* ${user.uniqueId}\n`;
    txt += `📅 *Cuenta creada:* ${new Date(user.createTime * 1000).toLocaleDateString('es-ES')}\n`;
    txt += `📜 *Bio:* ${user.signature || 'Sin descripción'}\n`;
    txt += `👥 *Seguidores:* ${stats.followerCount.toLocaleString()}\n`;
    txt += `🔄 *Siguiendo:* ${stats.followingCount.toLocaleString()}\n`;
    txt += `❤️ *Me gusta totales:* ${stats.diggCount.toLocaleString()}\n`;
    txt += `🎥 *Videos publicados:* ${stats.videoCount}\n`;
    txt += `🔗 *Perfil:* https://www.tiktok.com/@${user.uniqueId}\n\n`;

    await conn.sendMessage(m.chat, { image: { url: user.avatarLarger }, caption: txt }, { quoted: m });
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await conn.reply(m.chat, '⚠️ Hubo un error al procesar la solicitud. Intenta de nuevo más tarde.', m);
  }
};

handler.help = ['ttstalk *<nombre>*'];
handler.tags = ['stalk'];
handler.command = ['ttstalk', 'tiktokstalk'];
handler.register = true;

export default handler;
