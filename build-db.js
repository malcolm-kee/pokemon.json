const path = require('path');
const fs = require('fs-extra');
const { ncp } = require('ncp');
const rimraf = require('rimraf');
const items = require('./data/items.json');
const pokedex = require('./data/pokedex.json');
const skills = require('./data/skills.json');
const types = require('./data/types.json');

const buildFolder = path.resolve(__dirname, 'build');

const clean = () =>
  new Promise((fulfill, reject) => {
    rimraf(buildFolder, err => {
      if (err) {
        return reject(err);
      }
      console.info(`Complete remove build folder.`);
      fulfill();
    });
  });

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

const copyAssets = () =>
  new Promise((fulfill, reject) => {
    console.info(`Start copying assets...`);
    ncp('assets', 'build/assets', err => {
      if (err) {
        return reject(err);
      }
      console.info(`Asset copy completed!`);
      fulfill();
    });
  });

async function build() {
  try {
    await clean();
    await fs.ensureDir(buildFolder);
    await writeDb();
    await copyAssets();
  } catch (e) {
    console.error(`Error during build`);
    console.error(e);
  }
}

build();
