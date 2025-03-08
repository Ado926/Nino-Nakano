/* 
- Git Clone Bot
- Free Code Titans 
- Power By Jose XrL
*/

// *🍁 [ Git Clone Bot ]*

import fetch from 'node-fetch';

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

const isUrl = (url) => url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi);

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const inputError = `[!] *Entrada incorrecta*\n\nEjemplo: ${usedPrefix + command} https://github.com/usuario/repositorio`;
  if (!text) return await conn.reply(m.chat, inputError, m, rcanal);

  await conn.reply(m.chat, "🌹 Descargando archivo... Por favor espera.", m, rcanal);

  if (!isUrl(args[0]) || !args[0].includes('github.com')) {
    return await conn.reply(m.chat, "¡Enlace inválido!", m);
  }

  const [, user, repo] = args[0].match(regex) || [];
  if (!user || !repo) return await conn.reply(m.chat, "¡Enlace del repositorio de GitHub inválido!", m, rcanal);

  const repoName = repo.replace(/.git$/, '');
  const url = `https://api.github.com/repos/${user}/${repoName}/zipball`;
  const fileName = `${encodeURIComponent(repoName)}.zip`;

  try {
    await conn.sendFile(m.chat, url, fileName, null, m, rcanal);
    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant } });
  } catch (error) {
    await conn.reply(m.chat, `Error: ${error.message}`, m);
  }
};

handler.help = ["gitclone"];
handler.tags = ["downloader"];
handler.command = ["gitclone"];

export default handler;