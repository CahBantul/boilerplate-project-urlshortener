require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const mongoose = require('mongoose');

// import Model Url
const Url = require('./models/url');

// koneksi ke mongoDB
mongoose.connect(process.env.MONGO_URI);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// json parser
app.use(express.json());

// urlencoded parser
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;

  // cek jumlah data dalam database
  let countUrl = await Url.count();
  countUrl++;

  // filtering nonabjad pada akhir url
  const UrlFiltered = url.replace(/[A-Za-z]$/, '');
  console.log(UrlFiltered);

  // validasi domain menggunakan dns.lookup
  dns.lookup(url, (err, address) => {
    if (address == undefined) {
      res.json({ error: 'invalid url' });
    } else {
    }
  });
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
