const express = require('express');
const cors = require('cors');
const services = require('./services.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '100000mb' }));
app.use(express.urlencoded({ extended: true }));

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

app.get('/', (req, res) => {
  res.send('hello world !');
});

app.get('/api', (req, res) => {
  res.send('api !');
});

app.post('/api/access', (req, res) => {
  const token = generateAccessToken({ user: req.body.user });
  res.json(token);
});

app.post('/api/fillPng', authenticateToken, async (req, res) => {
  await services.fillPng(req, res);
});

app.post('/api/uploadImages', authenticateToken, async (req, res) => {
  services.uploadImages(req, res);
});

app.post('/api/uploadIpfs', authenticateToken, async (req, res) => {
  services.pinFileToIPFS(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
