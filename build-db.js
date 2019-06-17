require('dotenv').config();
const path = require('path');
const fs = require('fs-extra');
const { ncp } = require('ncp');
const rimraf = require('rimraf');
const items = require('./data/items.json');
const pokedex = require('./data/pokedex.json');
const skills = require('./data/skills.json');
const types = require('./data/types.json');
const createHomePage = require('./homepage');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

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

const getFiles = dir => () =>
  new Promise((fulfill, reject) => {
    fs.readdir(path.resolve(__dirname, 'assets', dir), (err, files) => {
      if (err) {
        return reject(err);
      }
      fulfill(files);
    });
  });

const getAllImages = getFiles('images');
const getAllSprites = getFiles('sprites');
const getAllThumbnails = getFiles('thumbnails');

const mapPokedexData = async pokemons => {
  const [images, sprites, thumbnails] = await Promise.all([
    getAllImages(),
    getAllSprites(),
    getAllThumbnails(),
  ]);

  return pokemons.map(pokemon => {
    const image = images.find(
      fileName =>
        fileName.substring(0, 3) === String(pokemon.id).padStart(3, '0')
    );
    const sprite = sprites.find(
      fileName =>
        fileName.substring(0, 3) === String(pokemon.id).padStart(3, '0')
    );
    const thumbnail = thumbnails.find(
      fileName =>
        fileName.substring(0, 3) === String(pokemon.id).padStart(3, '0')
    );

    return Object.assign({}, pokemon, {
      image: image && `${BASE_URL}/images/${image}`,
      sprite: sprite && `${BASE_URL}/sprites/${sprite}`,
      thumbnail: thumbnail && `${BASE_URL}/thumbnails/${thumbnail}`,
    });
  });
};

const writeDb = pokedex =>
  new Promise((fulfill, reject) => {
    const db = {
      pokedex,
      items,
      skills,
      types,
    };

    fs.writeFile(
      path.resolve(__dirname, 'build', 'db.json'),
      JSON.stringify(db),
      err => {
        if (err) {
          console.error(`Error writing db`);
          reject(err);
        }
        console.log(`Complete generate db`);
        fulfill(db);
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

const generateHomePage = db =>
  new Promise((fulfill, reject) => {
    const html = createHomePage(
      Object.keys(db)
        .map(key => `${BASE_URL}/api/${key}`)
        .concat(`${BASE_URL}/graphql`)
    );

    fs.writeFile(
      path.resolve(__dirname, 'build', 'assets', 'index.html'),
      html,
      err => {
        if (err) {
          return reject(err);
        }
        return fulfill();
      }
    );
  });

async function build() {
  try {
    await clean();
    await fs.ensureDir(buildFolder);
    const pokemons = await mapPokedexData(pokedex);
    const db = await writeDb(pokemons);
    await copyAssets();
    await generateHomePage(db);
  } catch (e) {
    console.error(`Error during build`);
    console.error(e);
  }
}

build();
