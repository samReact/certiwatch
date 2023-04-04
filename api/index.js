const express = require('express');
const cors = require('cors');
const services = require('./services.js');
var { expressjwt: jwt } = require('express-jwt');

require('dotenv').config();

const secret = process.env.JWT_SECRET;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '100000mb' }));
app.use(express.urlencoded({ extended: true }));

app.post(
  '/api/uploadImages',
  jwt({ secret, algorithms: ['HS256'] }),
  async (req, res) => {
    try {
      const result = await services.uploadImages(req, res);
      res.send(result);
    } catch (error) {
      throw error;
    }
  }
);

app.post(
  '/api/uploadIpfs',
  jwt({ secret, algorithms: ['HS256'] }),
  async (req, res) => {
    res.send('ok');
    // try {
    //   await services.fillPng(req, res);
    //   await services.pinFileToIPFS(req, res);
    // } catch (error) {
    //   throw error;
    // }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
