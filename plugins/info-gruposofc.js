import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {

let grupos = `*Hola!, te invito a unirte a los grupos oficiales del Bot para convivir con la comunidad.....*

   *_╭━━━⊜ ⌊• 1 •⌉_*
  *_┃🌹❏ https://chat.whatsapp.com/EteP5pnrAZC14y9wReGF1V_*
*_╰━━━━━━━━━━━━━━━━⊜_*

   *_╭━━━⊜ ⌊• 2 •⌉_*
  *_┃🌹❏ https://chat.whatsapp.com/EyIKeHl16JNB4J6O4KMjpD_*
*_╰━━━━━━━━━━━━━━━━⊜_*

   *_╭━━━⊜ ⌊• 3 •⌉_*
  *_┃🌹❏ https://chat.whatsapp.com/DeJvBuS7QgB3Ybp1BZulWL_*
*_╰━━━━━━━━━━━━━━━━⊜_*

   *_╭━━━⊜ ⌊• Canal •⌉_*
  *_┃🌹❏ https://whatsapp.com/channel/0029Vb4cQJu2f3EB7BS7o11M_*
*_╰━━━━━━━━━━━━━━━━⊜_*`

await conn.sendFile(m.chat, catalogo, "grupos.jpg", grupos, m)

await m.react(🥛)

}
handler.help = ['grupos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups']

export default handler
