const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const Jimp = require('jimp');

module.exports = {
  uploadImages: async (req, res) => {
    const key = process.env.PINATA_KEY;
    const secret = process.env.PINATA_SECRET;
    const pinata = new pinataSDK(key, secret);
    const images = [];

    const options = {
      pinataMetadata: {
        name: 'CWT assets'
      },
      pinataOptions: {
        cidVersion: 0
      }
    };

    const { photos } = req.body;

    try {
      for (let i = 0; i < photos.length; i++) {
        const src = photos[i];
        let buff = Buffer.from(src.split(',')[1], 'base64');
        fs.writeFileSync(`./image${i}.png`, buff);
        const readableStreamForFile = fs.createReadStream(`./image${i}.png`);
        const result = await pinata.pinFileToIPFS(
          readableStreamForFile,
          options
        );
        images.push(`ipfs://${result.IpfsHash}`);
      }

      const body = {
        images
      };
      const response = await pinata.pinJSONToIPFS(body, options);
      return response;
    } catch (err) {
      res.send(err.message);
    }
  },
  pinFileToIPFS: async (req, res) => {
    const key = process.env.PINATA_KEY;
    const secret = process.env.PINATA_SECRET;
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

    const {
      brand,
      model,
      year,
      gender,
      serial,
      watch_case,
      bracelet,
      movement,
      color,
      expert_addr,
      expert_name,
      images_url
    } = req.body;

    try {
      const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
      const body = {
        description: 'Certificate of authenticity',
        image: `ipfs://${result.IpfsHash}`,
        name: 'Certificate CWT',
        attributes: [
          {
            trait_type: 'Brand',
            value: brand
          },
          {
            trait_type: 'Model',
            value: model
          },
          {
            trait_type: 'Case',
            value: watch_case
          },
          {
            trait_type: 'Bracelet',
            value: bracelet
          },
          {
            trait_type: 'Movement',
            value: movement
          },
          {
            trait_type: 'Color',
            value: color
          },
          {
            trait_type: 'Gender',
            value: gender
          },
          {
            trait_type: 'Year',
            value: year
          },
          {
            trait_type: 'Serial',
            value: serial
          },
          {
            trait_type: 'Expert address',
            value: expert_addr
          },
          {
            trait_type: 'Expert name',
            value: expert_name
          },
          {
            images: 'Images',
            value: images_url
          }
        ]
      };

      const response = await pinata.pinJSONToIPFS(body, options);

      res.send(response);
    } catch (err) {
      res.send(err.message);
    }
  },
  fillPng: async (req, res) => {
    try {
      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
      const smallfont = await Jimp.loadFont(Jimp.FONT_SANS_12_BLACK);
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
        color,
        expert_addr,
        expert_name
      } = req.body;
      image.print(font, 220, 120, brand);
      image.print(font, 220, 140, model);
      image.print(font, 220, 160, watch_case);
      image.print(font, 220, 180, bracelet);
      image.print(font, 220, 200, movement);
      image.print(font, 220, 220, color);
      image.print(font, 220, 240, gender);
      image.print(font, 220, 260, year);
      image.print(font, 220, 280, serial);
      image.print(smallfont, 220, 300, expert_addr);
      image.print(font, 220, 320, expert_name);
      await image.writeAsync('filled.png');

      return 'success';
    } catch (err) {
      res.send(err.message);
    }
  }
};