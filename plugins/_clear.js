import fs from 'fs/promises';

const paths = {
  NakanoJadiBot: `./${jadi}/`,
  NakanoSession: `./${sessions}/`
};

async function cleanDirectory(path, skipFiles) {
  try {
    const entries = await fs.readdir(path);
    for (const entry of entries) {
      const entryPath = `${path}${entry}`;
      const stats = await fs.stat(entryPath);
      if (stats.isDirectory() && entry !== 'creds.json') {
        const files = await fs.readdir(entryPath);
        
        for (const file of files) {
          if (!skipFiles.includes(file)) {
            try {
              await fs.unlink(`${entryPath}/${file}`);
            } catch (err) {
            }
          }
        }
      }
    }
  } catch (err) {
  }
}

async function cleanUp() {
  const skipFiles = ['creds.json'];
  for (const [name, path] of Object.entries(paths)) {
    if (name === 'NakanoSession') continue;
    await cleanDirectory(path, skipFiles);
  }
}

async function cleanNakanoSession() {
  const sessionPath = paths.NakanoSession;
  await cleanDirectory(sessionPath, ['creds.json']);
}

async function main() {
  await cleanUp();
  await cleanNakanoSession();
}

setInterval(main, 60 * 1000);
main();