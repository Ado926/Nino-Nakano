import fetch from 'node-fetch';

let handler = async(m, { conn, args, text }) => {

  if (!text) return m.reply('Ingrese un link de YouTube\n');

  m.react("⏳");

  let video;
  try {
    video = await (await fetch(`https://api.neoxr.eu/api/youtube?url=${text}&type=video&quality=480p&apikey=GataDios`)).json();
  } catch (error) {
    try {
      video = await (await fetch(`https://api.fgmods.xyz/api/downloader/ytmp4?url=${text}&quality=480p&apikey=be9NqGwC`)).json();
    } catch (error) {
      try {
        video = await (await fetch(`https://api.alyachan.dev/api/ytv?url=${text}&apikey=uXxd7d`)).json();
      } catch (error) {
        video = await (await fetch(`https://good-camel-seemingly.ngrok-free.app/download/mp4?url=${text}`)).json();
      }
    }
  }

  let data = video?.data || video?.result || video

  let link = data?.url || data?.download_url || data?.dl_url || data?.downloads?.link?.[0]

  if (!link) return m.reply('《✧》Hubo un error al intentar acceder al link.\n> Si el problema persiste, repórtalo en el grupo de soporte.');

  const infoMessage = '乂  Y O U T U B E  -  M P 4\n\n' +
    `    ✩   *Título* : ${data.info_do_video?.title || data.title || 'Desconocido'}\n` +
    `    ✩   *Calidad* : ${data.download?.quality || data.quality || 'Desconocida'}\n` +
    `    ✩   *Duración* : ${data.info_do_video?.timestamp || data.duration || 'Desconocida'}\n` +
    `    ✩   *Visitas* : ${data.info_do_video?.views || data.views || 'Desconocidas'}\n` +
    `    ✩   *Publicado hace* : ${data.info_do_video?.ago || data.ago || 'Desconocido'}\n\n` +
    '> *- ↻ El video se está enviando, espera un momento...*'

  await conn.reply(m.chat, infoMessage, m)

  await conn.sendMessage(m.chat, {
    video: { url: link },
    mimetype: "video/mp4",
    caption: ``,
  }, { quoted: m });

  m.react("⭐");
}

handler.command = ['ytvx', 'ytmp4x', 'yt']
handler.register = true 
handler.estrellas = 0
export default handler;