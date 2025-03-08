import gplay from 'google-play-scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix: prefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '🚩 Ingresa un link de la PlayStore.\n\nEjemplo:\n' + `> *${usedPrefix + command}* https://play.google.com/store/apps/details?id=com.facebook.lite`, m, rcanal);
  }

  await m.react('🕓');

  const url = `${args[0]}`;
  const packageName = url.split("=")[1];
  console.log(packageName);

  try {
    const info = await gplay.app({ appId: packageName });
    const title = info.title;
    console.log(`${title}\n${info.appId}`);
    
    const link = `https://d.apkpure.com/b/APK/${info.appId}?version=latest`;
    await conn.sendFile(m.chat, link, `${title}.apk`, '', m, false, { 
      mimetype: 'application/vnd.android.package-archive', 
      asDocument: true 
    });

    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
  }
}

handler.command = /^(dlplaystore)$/i;
export default handler;