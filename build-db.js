const path = require('path');
const fs = require('fs-extra');
const items = require('./data/items.json');
const pokedex = require('./data/pokedex.json');
const skills = require('./data/skills.json');
const types = require('./data/types.json');

const writeDb = () =>
  new Promise((fulfill, reject) => {
    fs.writeFile(
      path.resolve(__dirname, 'build', 'db.json'),
      JSON.stringify({
        items,
        pokedex,
        skills,
        types,
      }),
      err => {
        if (err) {
          console.error(`Error writing db`);
          reject(err);
        }
        console.log(`Complete generate db`);
        fulfill();
      }
    );
  });

async function generateDb() {
  try {
    await fs.ensureDir(path.resolve(__dirname, 'build'));

    await writeDb();
  } catch (e) {
    console.error('Error when generateDb');
    console.error(e);
  }
}

generateDb();
