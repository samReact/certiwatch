require('dotenv').config();
const key = process.env.PINATA_KEY;
const secret = process.env.PINATA_SECRET;
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK(key, secret);
const fs = require('fs');
const readableStreamForFile = fs.createReadStream(
  './client/src/assets/certificate.pdf'
);

// console.log(secret);

const options = {
  pinataMetadata: {
    name: 'CWT'
  },
  pinataOptions: {
    cidVersion: 0
  }
};

pinata
  .pinFileToIPFS(readableStreamForFile, options)
  .then((result) => {
    const body = {
      description: 'Certificate of authenticity',
      image: `ipfs://${result.IpfsHash}`,
      name: 'Certificate CWT'
    };

    pinata
      .pinJSONToIPFS(body, options)
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
