require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
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
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', async (req, res) => {
  const urlBody = req.body.url;

  // cek jumlah data dalam database
  let countUrl = await Url.count();
  countUrl++;

  // parsing url dari body
  try {
    const urlParse = new URL(urlBody);

    // cek sudah ada di databasae atau belum
    const duplicate = await Url.findOne({ original_url: urlParse.origin });
    if (duplicate) {
      res.json({
        original_url: duplicate.original_url,
        short_url: duplicate.short_url,
      });
    } else {
      // save to mongoDB
      Url.create({
        original_url: urlParse.origin,
        short_url: countUrl,
      })
        .then((result) => {
          console.log(result);
          res.json({
            original_url: result.original_url,
            short_url: result.short_url,
          });
        })
        .catch((err) => console.log(err));
    }
  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:shorturl', async (req, res) => {
  Url.findOne({ short_url: req.params.shorturl })
    .then((url) => {
      res.redirect(url.original_url);
    })
    .catch((err) => {
      res.json({ error: 'salah input url' });
    });
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
