import cheerio from "cheerio";

async function obtenerLetras(jtituloLagu) {
  try {
    const respuesta = await fetch(`https://r.jina.ai/https://www.google.com/search?q=letra+de+${encodeURIComponent(tituloLagu)}&hl=es`, {
      headers: {
        'x-return-format': 'html',
        'x-engine': 'cf-browser-rendering',
      }
    });
    const texto = await respuesta.text();
    const $ = cheerio.load(texto);
    const letras = [];
    const salida = [];
    const resultado = {};

    $('div.PZPZlf').each((i, e) => {
      const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
      if (!penemu) salida.push($(e).text().trim());
    });

    $('div[jsname="U8S5sf"]').each((i, el) => {
      let out = '';
      $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
        out += $(span).text() + '\n';
      });
      letras.push(out.trim());
    });

    resultado.letras = letras.join('\n\n');
    resultado.titulo = salida.shift();
    resultado.subtitulo = salida.shift();
    resultado.plataforma = salida.filter(_ => !_.includes(':'));
    salida.forEach(_ => {
      if (_.includes(':')) {
        const [nombre, valor] = _.split(':');
        resultado[nombre.toLowerCase()] = valor.trim();
      }
    });
    return resultado;
  } catch (error) {
    return { error: error.message };
  }
}

const handler = async (m, { text }) => {
  if (!text) return m.reply('🍬 Por favor ingresa el título de la canción cuya letra deseas buscar.');
  
  try {
    const respuesta = await fetch(`https://r.jina.ai/https://www.google.com/search?q=letra+de+${encodeURIComponent(text)}&hl=es`, {
      headers: {
        'x-return-format': 'html',
        'x-engine': 'cf-browser-rendering',
      }
    });
    const html = await respuesta.text();
    const $ = cheerio.load(html);
    const letras = [];
    const salida = [];
    const resultado = {};
    
    $('div.PZPZlf').each((i, e) => {
      const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
      if (!penemu) salida.push($(e).text().trim());
    });

    $('div[jsname="U8S5sf"]').each((i, el) => {
      let out = '';
      $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
        out += $(span).text() + '\n';
      });
      letras.push(out.trim());
    });

    resultado.letras = letras.join('\n\n');
    resultado.titulo = salida.shift();
    resultado.subtitulo = salida.shift();
    resultado.plataforma = salida.filter(_ => !_.includes(':'));
    salida.forEach(_ => {
      if (_.includes(':')) {
        const [nombre, valor] = _.split(':');
        resultado[nombre.toLowerCase()] = valor.trim();
      }
    });

    if (!resultado.letras) return m.reply('No se encontraron letras.');

    let mensaje = `*Título :* ${resultado.titulo}\n`;
    if (resultado.subtitulo) mensaje += `*Subtítulo :* ${resultado.subtitulo}\n`;
    if (resultado.plataforma.length) mensaje += `*Plataforma :* ${resultado.plataforma.join(', ')}\n`;
    Object.keys(resultado).forEach(key => {
      if (!['letras', 'titulo', 'subtitulo', 'plataforma'].includes(key)) {
        mensaje += `*${key.replace(/_/g, ' ')} :* ${resultado[key]}\n`;
      }
    });
    mensaje += `\n*Letras :*\n${resultado.letras}`;

    m.reply(mensaje);
  } catch (e) {
    m.reply('Hubo un error al obtener las letras.');
  }
};

handler.help = ['googlelirik*<búsqueda>*'];
handler.tags = ['search'];
handler.command = /^(googlelirik|googlelyrics|googlelyric|googleletra)$/i;
handler.register = true;

export default handler;
