let handler = async (m, { conn, usedPrefix, command }) => {
  let grupos = `*Hola!, te invito a unirte a los grupos oficiales del Bot para convivir con la comunidad.....*

   *_╭━━━⊜ ⌊• 1 •⌉_*
  *_┃🌹❏ https://chat.whatsapp.com/I2g1kNUSxf75HmZp5Nr3Ua_*
*_╰━━━━━━━━━━━━━━━━⊜_*

   *_╭━━━⊜ ⌊• 2 •⌉_*
  *_┃🌹❏ https://chat.whatsapp.com/EyIKeHl16JNB4J6O4KMjpD_*
*_╰━━━━━━━━━━━━━━━━⊜_*

   *_╭━━━⊜ ⌊• 3 •⌉_*
  *_┃🌹❏ https://chat.whatsapp.com/CX0KRkfViZS0jKZHkTJlCM_*
*_╰━━━━━━━━━━━━━━━━⊜_*

   *_╭━━━⊜ ⌊• Canal •⌉_*
  *_┃🌹❏ https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M_*
*_╰━━━━━━━━━━━━━━━━⊜_*`

  const catalogo1 = 'https://qu.ax/NTXEi.mp4'

  await conn.sendFile(m.chat, catalogo1, 'jose.jpg', grupos, m, rcanal)
  await m.react(emojis)
}

handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler