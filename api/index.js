const express = require('express');
const cors = require('cors');
const services = require('./services.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = 5000;

app.use(express.json({ limit: '100000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(cors());

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1800s' });
}

app.get('/test', (req, res) => {
  res.status(200).send('Hello Get!');
});

app.post('/test', (req, res) => {
  res.status(200).send('post Hello !');
});

app.post('/api/access', (req, res) => {
  const token = generateAccessToken({ user: req.body.user });
  res.status(200).json(token);
});

app.post('/api/fillPng', authenticateToken, (req, res) => {
  services.fillPng(req, res);
});

app.post('/api/uploadImages', authenticateToken, (req, res) => {
  services.uploadImages(req, res);
});

app.post('/api/uploadIpfs', authenticateToken, (req, res) => {
  services.pinFileToIPFS(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
