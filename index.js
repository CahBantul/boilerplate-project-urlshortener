require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');

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
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.get('/api/shorturl/:shorturl', async (req, res) => {
  Url.findOne({ short_url: req.params.shorturl })
    .then((url) => {
      res.redirect(url.original_url);
    })
    .catch((err) => {
      res.json({ error: 'invalid url' });
    });
});

app.post('/api/shorturl', async (req, res) => {
  const bodyurl = req.body.url;

  // cek jumlah data dalam database
  let countUrl = await Url.count();
  countUrl++;

  // url parser
  const test = new URL(bodyurl);

  // validasi domain name server
  dns.lookup(test.hostname, (error, address) => {
    // pengkondisian jika tidak ada alamatnya
    if (!address) {
      res.json({ error: 'Invalid URL' });
    } else {
      // cek apakah sudah ada di database atau belum
      Url.findOne({ original_url: bodyurl })
        .then((result) => {
          // jika belum ada maka di  ke databse
          if (!result) {
            const url = new Url({ original_url: bodyurl, short_url: countUrl });
            url.save((err, data) => {
              res.json({
                original_url: data.original_url,
                short_url: data.short_url,
              });
            });
          } else {
            res.json({
              original_url: result.original_url,
              short_url: result.short_url,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
