import fetch from 'node-fetch';

let handler = async (m, { conn, command, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, '🚩 Ingresa el texto que deseas convertir en un logo.\nEjemplo:\n' + `> *${usedPrefix + command}* Jose`, m, rcanal);

  await m.react('🕓');

  try {
    let imageUrl;
    let cmd = command.substring(4); 
    let api = {
      "amongus": "amongus",
      "aniversario": "aniversario",
      "naruto": "naruto",
      "zombie": "zombie",
      "desfoque": "desfoque",
      "colorido": "colorido",
      "grafite2": "grafite2",
      "grafite": "grafite",
      "estrelas": "estrelas",
      "clouds": "clouds",
      "joker": "joker",
      "blood": "blood",
      "horror": "horror",
      "halloween": "halloween",
      "frozen": "frozen",
      "freecreate": "freecreate",
      "3druby": "3druby",
      "papercut": "papercut",
      "ligatures": "ligatures",
      "advancedglow": "advancedglow",
      "typography": "typography",
      "pixelglitch": "pixelglitch",
      "glitch": "glitch",
      "neonglitch": "neonglitch",
      "flag": "flag",
      "flag3d": "flag3d",
      "deleting": "deleting",
      "blackpink": "blackpink",
      "glowing": "glowing",
      "underwater": "underwater",
      "logomaker": "logomaker",
      "cartoon": "cartoon",
      "watercolor": "watercolor",
      "affectclouds": "affectclouds",
      "blackpinklogo": "blackpinklogo",
      "gradient": "gradient",
      "summerbeach": "summerbeach",
      "luxurygold": "luxurygold",
      "multicoloredneon": "multicoloredneon",
      "sandsummer": "sandsummer",
      "galaxywallpaper": "galaxywallpaper",
      "1917": "1917",
      "markingneon": "markingneon",
      "royal": "royal",
      "galaxy": "galaxy",
      "darkgreen": "darkgreen",
      "lighteffects": "lighteffects",
      "dragonball": "dragonball",
      "neondevil": "neondevil",
      "wooden3d": "wooden3d",
      "metal3d": "metal3d",
      "sunset": "sunset",
      "cemetery": "cemetery"
    };
    
    if (cmd in api) {
      let res = await fetch(`https://carisys.online/api/logos/${api[cmd]}?texto=${encodeURIComponent(text)}`);
      if (!res.ok) throw new Error('Error en la solicitud a la API');
      imageUrl = res.url;
    } else {
      conn.reply(m.chat, '❌ Comando no reconocido.');
      return;
    }

    await conn.sendFile(m.chat, imageUrl, 'logo.png', 'Aquí tienes tu logo:', m);
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await conn.react('✖️');
    await conn.reply(m.chat, '❌ Ocurrió un error al generar el logo. Inténtalo nuevamente.', m);
  }
}

handler.help = [
  'logoamongus *<texto>*',
  'logoaniversario *<texto>*',
  'logonaruto *<texto>*',
  'logozombie *<texto>*',
  'logodesfoque *<texto>*',
  'logocolorido *<texto>*',
  'logografite2 *<texto>*',
  'logografite *<texto>*',
  'logoestrelas *<texto>*',
  'logoclouds *<texto>*',
  'logojoker *<texto>*',
  'logoblood *<texto>*',
  'logohorror *<texto>*',
  'logohalloween *<texto>*',
  'logofrozen *<texto>*',
  'logofreecreate *<texto>*',
  'logo3druby *<texto>*',
  'logopapercut *<texto>*',
  'logoligatures *<texto>*',
  'logoadvancedglow *<texto>*',
  'logotypography *<texto>*',
  'logopixelglitch *<texto>*',
  'logoglitch *<texto>*',
  'logoneonglitch *<texto>*',
  'logoflag *<texto>*',
  'logoflag3d *<texto>*',
  'logodeleting *<texto>*',
  'logoblackpink *<texto>*',
  'logoglowing *<texto>*',
  'loudounderwater *<texto>*',
  'logologomaker *<texto>*',
  'logocartoon *<texto>*',
  'logowatercolor *<texto>*',
  'logoaffectclouds *<texto>*',
  'logoblackpinklogo *<texto>*',
  'logogradient *<texto>*',
  'logosummerbeach *<texto>*',
  'logoluxurygold *<texto>*',
  'logomulticoloredneon *<texto>*',
  'logosandsummer *<texto>*',
  'logogalaxywallpaper *<texto>*',
  'logo1917 *<texto>*',
  'logomarkingneon *<texto>*',
  'logoroyal *<texto>*',
  'logogalaxy *<texto>*',
  'logodarkgreen *<texto>*',
  'logolighteffects *<texto>*',
  'logodragonball *<texto>*',
  'logoneondevil *<texto>*',
  'logowooden3d *<texto>*',
  'logometal3d *<texto>*',
  'logosunset *<texto>*',
  'logocemetery *<texto>*'
];

handler.tags = ['logotipos'];
handler.command = [
  'logoamongus', 'logoaniversario', 'logonaruto', 'logozombie', 'logodesfoque',
  'logocolorido', 'logografite2', 'logografite', 'logoestrelas', 'logoclouds',
  'logojoker', 'logoblood', 'logohorror', 'logohalloween', 'logofrozen',
  'logofreecreate', 'logo3druby', 'logopapercut', 'logoligatures', 'logoadvancedglow',
  'logotypography', 'logopixelglitch', 'logoglitch', 'logoneonglitch', 'logoflag',
  'logoflag3d', 'logodeleting', 'logoblackpink', 'logoglowing', 'loudounderwater',
  'logologomaker', 'logocartoon', 'logowatercolor', 'logoaffectclouds', 'logoblackpinklogo',
  'logogradient', 'logosummerbeach', 'logoluxurygold', 'logomulticoloredneon', 'logosandsummer',
  'logogalaxywallpaper', 'logo1917', 'logomarkingneon', 'logoroyal', 'logogalaxy',
  'logodarkgreen', 'logolighteffects', 'logodragonball', 'logoneondevil', 'logowooden3d',
  'logometal3d', 'logosunset', 'logocemetery'
];
handler.register = true;

export default handler;