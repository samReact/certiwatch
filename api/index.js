const express = require('express');
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const cors = require('cors');
const Jimp = require('jimp');
require('dotenv').config();

const app = express();
const port = 5000;

const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function fillPng(req) {
  const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
  const image = await Jimp.read('./nft_template.png');
  const {
    brand,
    model,
    year,
    gender,
    serial,
    watch_case,
    bracelet,
    movement,
    color
  } = req;
  image.print(font, 220, 120, brand);
  image.print(font, 220, 140, model);
  image.print(font, 220, 160, watch_case);
  image.print(font, 220, 180, bracelet);
  image.print(font, 220, 200, movement);
  image.print(font, 220, 220, color);
  image.print(font, 220, 240, gender);
  image.print(font, 220, 260, year);
  image.print(font, 220, 280, serial);
  image.print(font, 220, 300, 'VERIDESK LLC');
  image.print(font, 220, 320, 'Pierre Dupont - x21233');
  await image.writeAsync('filled.png');
}

async function pinFileToIPFS() {
  const pinata = new pinataSDK(key, secret);
  const readableStreamForFile = fs.createReadStream('filled.png');

  const options = {
    pinataMetadata: {
      name: 'CWT'
    },
    pinataOptions: {
      cidVersion: 0
    }
  };

  const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
  const body = {
    description: 'Certificate of authenticity',
    image: `ipfs://${result.IpfsHash}`,
    name: 'Certificate CWT'
  };

  const response = await pinata.pinJSONToIPFS(body, options);
  return response;
}

app.post('/api/uploadIpfs', async (req, res) => {
  try {
    await fillPng(req.body);
    const hash = await pinFileToIPFS();
    res.send(hash);
  } catch (error) {
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
